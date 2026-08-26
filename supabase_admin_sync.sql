-- 1. Izin Akses Tabel Hak Akses Ujian Siswa (test_entitlements)
ALTER TABLE public.test_entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read test_entitlements" ON public.test_entitlements;
DROP POLICY IF EXISTS "Public Insert test_entitlements" ON public.test_entitlements;
DROP POLICY IF EXISTS "Public Update test_entitlements" ON public.test_entitlements;
DROP POLICY IF EXISTS "Public Delete test_entitlements" ON public.test_entitlements;

CREATE POLICY "Public Read test_entitlements" ON public.test_entitlements FOR SELECT USING (true);
CREATE POLICY "Public Insert test_entitlements" ON public.test_entitlements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update test_entitlements" ON public.test_entitlements FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete test_entitlements" ON public.test_entitlements FOR DELETE USING (true);

-- 2. Izin Akses Tabel Token & Voucher (access_tokens)
ALTER TABLE public.access_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read access_tokens" ON public.access_tokens;
DROP POLICY IF EXISTS "Public Insert access_tokens" ON public.access_tokens;
DROP POLICY IF EXISTS "Public Update access_tokens" ON public.access_tokens;
DROP POLICY IF EXISTS "Public Delete access_tokens" ON public.access_tokens;

CREATE POLICY "Public Read access_tokens" ON public.access_tokens FOR SELECT USING (true);
CREATE POLICY "Public Insert access_tokens" ON public.access_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update access_tokens" ON public.access_tokens FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete access_tokens" ON public.access_tokens FOR DELETE USING (true);
