/**
 * QRIS (Quick Response Code Indonesian Standard) Dynamic & Static Amount Generator
 * Sesuai Standar Bank Indonesia & ASPI (EMVCo QR Code Specification)
 */

/**
 * Menghitung Checksum CRC-16 / CCITT-FALSE (Polynomial 0x1021, Initial 0xFFFF)
 */
export function calculateCRC16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Template QRIS Statis Standar Resmi Pemilik (GoPay / QRIS Merchant Real)
 * Merchant: Hamdan Hamidiy, Digital & (NMID: ID1025422240032)
 */
export const DEFAULT_STATIC_QRIS =
  '00020101021126610014COM.GO-JEK.WWW01189360091435809969220210G5809969220303UMI51440014ID.CO.QRIS.WWW0215ID10254222400320303UMI5204899953033605802ID5925Hamdan Hamidiy, Digital &6007SUMENEP61056941262070703A01630464B7';

export interface QrisTLV {
  tag: string;
  len: number;
  val: string;
}

/**
 * Mem-parse string QRIS menjadi deretan TLV (Tag-Length-Value) EMVCo
 */
export function parseQrisTLV(qris: string): QrisTLV[] {
  const tags: QrisTLV[] = [];
  let i = 0;
  while (i < qris.length) {
    const tag = qris.substring(i, i + 2);
    const len = parseInt(qris.substring(i + 2, i + 4), 10);
    if (isNaN(len)) break;
    const val = qris.substring(i + 4, i + 4 + len);
    tags.push({ tag, len, val });
    i += 4 + len;
  }
  return tags;
}

/**
 * Mengubah string QRIS Statis menjadi QRIS Dinamis dengan Nominal Otomatis (Tag 54 EMVCo)
 * @param staticQris String QRIS statis (hasil scan QRIS toko/merchant Anda)
 * @param amount Nominal tagihan (angka bulat dalam Rupiah, misal 49000)
 * @param taxFee Optional biaya layanan / tax (jika ada)
 * @returns String QRIS Dinamis lengkap dengan CRC16 yang valid
 */
export function convertStaticToDynamicQris(
  staticQris: string,
  amount: number,
  taxFee: number = 0
): string {
  if (!staticQris || typeof staticQris !== 'string') {
    staticQris = DEFAULT_STATIC_QRIS;
  }

  let raw = staticQris.trim();
  if (!raw.startsWith('000201')) {
    raw = DEFAULT_STATIC_QRIS;
  }

  const tags = parseQrisTLV(raw);
  const totalAmount = Math.round(amount + taxFee);
  const amountStr = totalAmount.toString();

  const newTags: QrisTLV[] = [];
  let inserted54 = false;

  for (const item of tags) {
    // 1. Lewati CRC tag 63 lama
    if (item.tag === '63') {
      continue;
    }

    // 2. Ubah Tag 01 (Point of Initiation Method) dari '11' (Static) menjadi '12' (Dynamic)
    if (item.tag === '01') {
      newTags.push({ tag: '01', len: 2, val: '12' });
      continue;
    }

    // 3. Lewati Tag 54/55 lama jika ada
    if (item.tag === '54' || item.tag === '55') {
      continue;
    }

    // 4. Sisipkan Tag 54 tepat setelah Tag 53 (atau sebelum Tag 58)
    if ((item.tag === '58' || parseInt(item.tag, 10) > 54) && !inserted54) {
      newTags.push({ tag: '54', len: amountStr.length, val: amountStr });
      inserted54 = true;
    }

    newTags.push(item);
  }

  // Jika belum disisipkan
  if (!inserted54) {
    newTags.push({ tag: '54', len: amountStr.length, val: amountStr });
  }

  // Rekonstruksi string QRIS tanpa CRC
  let payload = '';
  for (const item of newTags) {
    const lenStr = item.val.length.toString().padStart(2, '0');
    payload += item.tag + lenStr + item.val;
  }

  // Tambahkan Header Tag 63 (CRC Tag = '6304')
  payload += '6304';

  // Hitung ulang CRC16 CCITT yang valid
  const crc = calculateCRC16(payload);

  return payload + crc;
}

/**
 * Ekstrak informasi merchant lengkap dari string QRIS
 */
export function parseQrisMerchantInfo(qrisString: string): {
  merchantName: string;
  merchantCity: string;
  postalCode: string;
  nmid: string;
  acquirer: string;
  isDynamic: boolean;
} {
  try {
    const tags = parseQrisTLV(qrisString);
    const tagMap: Record<string, string> = {};
    tags.forEach((t) => (tagMap[t.tag] = t.val));

    // Tag 59: Merchant Name
    const merchantName = tagMap['59'] || 'Hamdan Hamidiy, Digital &';

    // Tag 60: Merchant City
    const merchantCity = tagMap['60'] || 'SUMENEP';

    // Tag 61: Postal Code
    const postalCode = tagMap['61'] || '69412';

    // NMID: Extract from Tag 51 or Tag 26 (ID1025422240032)
    let nmid = 'ID1025422240032';
    if (tagMap['51'] && tagMap['51'].includes('ID1025422240032')) {
      nmid = 'ID1025422240032';
    } else {
      const match = qrisString.match(/ID\d{13}/);
      if (match) nmid = match[0];
    }

    // Acquirer info
    let acquirer = 'GoPay / QRIS Nasional';
    if (qrisString.includes('GO-JEK') || qrisString.includes('COM.GO-JEK')) {
      acquirer = 'GoPay Merchant / QRIS';
    } else if (qrisString.includes('DANA')) {
      acquirer = 'DANA Bisnis / QRIS';
    } else if (qrisString.includes('BCA')) {
      acquirer = 'BCA Merchant / QRIS';
    }

    return {
      merchantName,
      merchantCity,
      postalCode,
      nmid,
      acquirer,
      isDynamic: tagMap['01'] === '12',
    };
  } catch {
    return {
      merchantName: 'Hamdan Hamidiy, Digital &',
      merchantCity: 'SUMENEP',
      postalCode: '69412',
      nmid: 'ID1025422240032',
      acquirer: 'GoPay / QRIS Nasional',
      isDynamic: true,
    };
  }
}


