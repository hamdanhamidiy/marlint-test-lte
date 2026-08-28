import { supabase } from '@/lib/supabase/client';

export interface EntitlementItem {
  id: string;
  user_id: string;
  marlint_test_id: string | null;
  test_number: number;
  source: string;
  source_id: string | null;
  is_active: boolean;
  granted_at: string;
  revoked_at?: string | null;
  revoke_reason?: string | null;
  student_name?: string;
  student_email?: string;
  sender_name?: string;
  sender_phone?: string;
  proof_url?: string | null;
  amount?: number;
}

/**
 * Mendapatkan daftar paket ujian yang terbuka untuk pengguna (Set of test numbers).
 * - Paket #1 selalu GRATIS (is_free: true).
 * - Paket #2-10 terkunci KECUALI ada baris is_active: true di test_entitlements pada Supabase.
 * - Staff/Admin/Instructor otomatis terbuka semua (1..10).
 */
export async function getUserUnlockedTests(
  userId?: string | null,
  userEmail?: string | null,
  isStaff: boolean = false
): Promise<Set<number>> {
  // 1. Staff mendapatkan akses semua paket
  if (isStaff) {
    return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }

  // 2. Paket 1 adalah default gratis untuk semua siswa
  const unlockedTests = new Set<number>([1]);

  if (!userId) {
    return unlockedTests;
  }

  try {
    // 3. Query tabel test_entitlements di Supabase (HANYA YANG is_active: true)
    const { data: entitlements, error } = await supabase
      .from('test_entitlements')
      .select('test_number, is_active')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!error && entitlements && entitlements.length > 0) {
      entitlements.forEach((e) => {
        if (typeof e.test_number === 'number') {
          unlockedTests.add(e.test_number);
        }
      });
    }

    // 4. Update localStorage cache agar sinkron
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `marlins_entitlements_${userId}`,
        JSON.stringify(Array.from(unlockedTests))
      );
    }
  } catch (err) {
    console.warn('Error querying Supabase test_entitlements, checking local cache fallback:', err);
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`marlins_entitlements_${userId}`);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            arr.forEach((num) => unlockedTests.add(Number(num)));
          }
        }
      } catch {}
    }
  }

  return unlockedTests;
}

/**
 * Siswa mengajukan konfirmasi pembayaran QRIS (Status PENDING menunggu verifikasi Admin)
 */
export async function submitQrisPaymentRequest(
  userId: string,
  testNumber: number,
  invoiceId: string,
  paymentDetails: {
    sender_name: string;
    sender_phone?: string;
    proof_url?: string | null;
    amount: number;
    note?: string;
  }
): Promise<{ success: boolean; error?: string; entitlementId?: string }> {
  try {
    // 1. Cari marlint_test_id dari tabel marlint_tests
    const { data: testData } = await supabase
      .from('marlint_tests')
      .select('id, test_number')
      .eq('test_number', testNumber)
      .maybeSingle();

    const marlintTestId = testData?.id || null;

    const metaJson = JSON.stringify({
      sender_name: paymentDetails.sender_name,
      sender_phone: paymentDetails.sender_phone || '',
      proof_url: paymentDetails.proof_url || null,
      amount: paymentDetails.amount,
      note: paymentDetails.note || '',
      submitted_at: new Date().toISOString(),
    });

    // 2. Insert ke test_entitlements dengan is_active: false (PENDING!)
    const { data, error } = await supabase
      .from('test_entitlements')
      .insert({
        user_id: userId,
        marlint_test_id: marlintTestId,
        test_number: testNumber,
        source: 'qris_pending',
        source_id: invoiceId,
        is_active: false, // PENDING: Belum aktif sampai disetujui Admin!
        granted_at: new Date().toISOString(),
        revoke_reason: metaJson,
      })
      .select('id')
      .single();

    if (error) {
      console.warn('Supabase pending entitlement insert error:', error.message);
      throw error;
    }

    return { success: true, entitlementId: data?.id };
  } catch (err: any) {
    console.error('Error submitting QRIS payment request:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Admin menyetujui / memverifikasi pembayaran QRIS (Akses Ujian Langsung Terbuka!)
 */
export async function approveQrisPayment(
  entitlementId: string,
  userId: string,
  testNumber: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Update status di database Supabase menjadi AKTIF (is_active: true)
    const { error } = await supabase
      .from('test_entitlements')
      .update({
        is_active: true,
        source: 'qris_verified',
        granted_at: new Date().toISOString(),
      })
      .eq('id', entitlementId);

    if (error) throw error;

    // 2. Kirim sinyal broadcast realtime lintas tab
    if (typeof window !== 'undefined') {
      try {
        const channel = new BroadcastChannel('marlins_entitlements_sync');
        channel.postMessage({ type: 'ENTITLEMENT_GRANTED', userId, testNumber });
        channel.close();
      } catch {}
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error approving QRIS payment:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Admin menolak / membatalkan pembayaran yang tidak valid
 */
export async function rejectQrisPayment(
  entitlementId: string,
  reason: string = 'Pembayaran tidak ditemukan dalam mutasi rekening'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('test_entitlements')
      .delete()
      .eq('id', entitlementId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Memberikan / mengaktifkan akses paket ujian di Supabase secara langsung (Manual Admin)
 */
export async function grantTestEntitlement(
  userId: string,
  testNumber: number,
  source: string = 'manual_admin',
  sourceId: string = `MANUAL-${Date.now()}`
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: testData } = await supabase
      .from('marlint_tests')
      .select('id, test_number')
      .eq('test_number', testNumber)
      .maybeSingle();

    const marlintTestId = testData?.id || null;

    const { error } = await supabase.from('test_entitlements').insert({
      user_id: userId,
      marlint_test_id: marlintTestId,
      test_number: testNumber,
      source: source,
      source_id: sourceId,
      is_active: true,
      granted_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase entitlement insert error:', error.message);
    }

    if (typeof window !== 'undefined') {
      const entKey = `marlins_entitlements_${userId}`;
      let currentEnts: number[] = [1];
      try {
        const raw = localStorage.getItem(entKey);
        if (raw) currentEnts = JSON.parse(raw);
      } catch {}
      if (!currentEnts.includes(testNumber)) {
        currentEnts.push(testNumber);
        localStorage.setItem(entKey, JSON.stringify(currentEnts));
      }

      try {
        const channel = new BroadcastChannel('marlins_entitlements_sync');
        channel.postMessage({ type: 'ENTITLEMENT_GRANTED', userId, testNumber });
        channel.close();
      } catch {}
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error granting test entitlement:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Mencabut akses ujian oleh admin
 */
export async function revokeTestEntitlement(
  entitlementId: string,
  reason: string = 'Dicabut oleh Administrator'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('test_entitlements')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoke_reason: reason,
      })
      .eq('id', entitlementId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

