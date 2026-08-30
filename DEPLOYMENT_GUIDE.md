# 🚀 Panduan Lengkap Deployment Produksi & Setup Domain Sendiri
## Platform Marlins Test (Next.js + Supabase)

Dokumen ini adalah panduan langkah demi langkah untuk menerbitkan website Marlins Test ke server hosting berbayar (*production*) menggunakan domain kustom sendiri, dengan standar keamanan tinggi dan perlindungan anti-DDoS.

---

## 📋 DAFTAR ISI
1. [Langkah 1: Menjalankan Skrip Keamanan SQL di Supabase](#langkah-1-menjalankan-skrip-keamanan-sql-di-supabase)
2. [Langkah 2: Deployment ke Hosting Berbayar](#langkah-2-deployment-ke-hosting-berbayar)
   - [Opsi A: Vercel Pro (Sangat Direkomendasikan)](#opsi-a-vercel-pro-rekomendasi-terbaik)
   - [Opsi B: VPS Linux (DigitalOcean / IDCloudHost / Biznet)](#opsi-b-vps-linux-node-pm2-nginx)
3. [Langkah 3: Menghubungkan Domain Sendiri (Custom Domain)](#langkah-3-menghubungkan-domain-sendiri)
4. [Langkah 4: Konfigurasi Cloudflare (Proteksi DDoS, WAF & Caching)](#langkah-4-konfigurasi-cloudflare-keamanan--kecepatan)
5. [Langkah 5: Konfigurasi Supabase untuk Produksi](#langkah-5-konfigurasi-supabase-untuk-produksi)
6. [Langkah 6: Checklist Pasca Peluncuran (Post-Launch Checklist)](#langkah-6-checklist-pasca-peluncuran)

---

## 1. Menjalankan Skrip Keamanan SQL di Supabase

Sebelum menghubungkan website ke domain publik, aktifkan perlindungan database:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard).
2. Pilih project Anda (`xekfarqemnyfguxtpeoj` atau project produksi baru).
3. Di bilah navigasi kiri, klik **SQL Editor**.
4. Buka file `supabase_production_rls.sql` di project ini, lalu **salin (copy) seluruh kodenya**.
5. Tempel (paste) ke SQL Editor Supabase, lalu klik tombol **Run** (atau `Ctrl + Enter`).
6. Pastikan muncul pesan `Success. No rows returned`.

> **Hasil:** Semua tabel (`users`, `student_results`, `certificates`, `test_entitlements`) kini terlindungi dengan *Row Level Security*. Siswa hanya bisa melihat datanya sendiri dan kunci jawaban tidak bisa dimanipulasi dari luar.

---

## 2. Deployment ke Hosting Berbayar

### OPSI A: Vercel Pro (Rekomendasi Terbaik)
*Next.js dibuat oleh tim Vercel, sehingga deployment ke Vercel memberikan performa maksimal, CDN global instan, dan auto-scaling otomatis saat ribuan siswa login serentak.*

1. **Push kode ke GitHub/GitLab:**
   ```bash
   git add .
   git commit -m "feat: production security and server evaluation ready"
   git push origin main
   ```
2. **Buka [Vercel](https://vercel.com) & Login.**
3. Klik **Add New...** -> **Project**.
4. Pilih repository GitHub proyek `marlin-web` Anda, lalu klik **Import**.
5. Di bagian **Environment Variables**, tambahkan variabel berikut:

   | Key | Value | Keterangan |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xekfarqemnyfguxtpeoj.supabase.co` | URL Supabase Anda |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Anon Key Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | *(Salin dari Supabase Project Settings -> API -> service_role secret)* | Kunci Admin Rahasia |
   | `NEXT_PUBLIC_APP_URL` | `https://domainanda.com` | Domain resmi website Anda |

6. Klik **Deploy**. Tunggu 1–2 menit hingga build selesai.

---

### OPSI B: VPS Linux (Node + PM2 + Nginx)
*Jika memilih server mandiri (Ubuntu 22.04 / 24.04 LTS):*

1. **Install Node.js 20 LTS & PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git nginx
   sudo npm install -g pm2
   ```
2. **Clone repo & build:**
   ```bash
   cd /var/www
   git clone <URL_REPO_ANDA> marlin-web
   cd marlin-web
   npm install --production=false
   npm run build
   ```
3. **Jalankan dengan PM2:**
   ```bash
   pm2 start npm --name "marlins-web" -- start
   pm2 save
   pm2 startup
   ```
4. **Konfigurasi Nginx Reverse Proxy (`/etc/nginx/sites-available/marlins`):**
   ```nginx
   server {
       listen 80;
       server_name domainanda.com www.domainanda.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
5. **Aktifkan site dan pasang SSL Let's Encrypt:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/marlins /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d domainanda.com -d www.domainanda.com
   ```

---

## 3. Menghubungkan Domain Sendiri

1. Beli domain pilihan Anda (misal `marlinstest.com` atau `marlins.id`) di registrar domain (Domainesia, Niagahoster, Namecheap, Cloudflare, dll).
2. Di dashboard **Vercel** -> Masuk ke Project -> **Settings** -> **Domains**.
3. Ketik domain Anda (misal: `domainanda.com` dan `www.domainanda.com`), lalu klik **Add**.
4. Vercel akan memberikan catatan DNS:
   - **Type A Record:** Arahkan `@` ke IP Vercel (`76.76.21.21`).
   - **Type CNAME Record:** Arahkan `www` ke `cname.vercel-dns.com`.

---

## 4. Konfigurasi Cloudflare (Keamanan & Kecepatan)

Menggunakan Cloudflare di depan hosting Anda sangat disarankan untuk mencegah website down akibat lonjakan traffic atau serangan DDoS:

1. Buat akun di [Cloudflare.com](https://cloudflare.com) (Gratis).
2. Klik **Add Site**, masukkan nama domain Anda.
3. Ubah *Nameserver* di tempat Anda membeli domain menjadi Nameserver Cloudflare (diberikan oleh Cloudflare).
4. Di Dashboard Cloudflare:
   - **SSL/TLS Menu:** Pilih mode **Full (Strict)**.
   - **Security / WAF:** Aktifkan **Bot Fight Mode** untuk memblokir script bot nakal.
   - **Caching / Configuration:** Set *Browser Cache TTL* ke 4 hours. File audio listening dan sertifikat akan di-cache di CDN Cloudflare terdekat di Jakarta/Indonesia, sehingga website sangat kencang dan hemat kuota hosting.

---

## 5. Konfigurasi Supabase untuk Produksi

1. **Ubah Site URL & Redirect URLs:**
   * Masuk ke **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
   * **Site URL:** Ganti dari `http://localhost:3000` menjadi `https://domainanda.com`.
   * **Redirect URLs:** Tambahkan:
     * `https://domainanda.com/**`
     * `https://www.domainanda.com/**`
2. **Koneksi Database Connection Pooling:**
   * Di **Project Settings** -> **Database** -> Cari bagian **Connection Pooling** (Port 6543 / Supavisor).
   * Connection pooling memastikan puluhan siswa yang submit ujian secara bersamaan tidak menghabiskan batas kuota koneksi database.
3. **Konfigurasi SMTP Email (Opsional tapi Direkomendasikan):**
   * Secara default, Supabase Free membatasi 3 email/jam untuk verifikasi akun.
   * Masuk ke **Authentication** -> **SMTP Settings** -> Hubungkan layanan email transaksional seperti **Resend**, **SendGrid**, atau **Mailgun** agar pengiriman email konfirmasi pendaftaran tidak pernah macet.

---

## 6. Checklist Pasca Peluncuran

- [ ] Skrip SQL RLS (`supabase_production_rls.sql`) sudah dijalankan di Supabase SQL Editor.
- [ ] Environment variable `SUPABASE_SERVICE_ROLE_KEY` sudah terpasang di Vercel / server.
- [ ] Domain kustom sudah terpasang SSL (HTTPS gembok hijau aktif).
- [ ] Uji coba pendaftaran akun siswa baru di `/register` dan verifikasi bahwa data masuk ke tabel `users`.
- [ ] Uji coba pengerjaan 1 paket ujian sampai selesai:
  - Nilai dihitung dengan benar di server.
  - Sertifikat otomatis terbit jika lulus.
  - Halaman `/verify` bisa memverifikasi nomor sertifikat.
- [ ] Akses halaman `/admin` tanpa login untuk memastikan sistem mengalihkan (redirect) ke halaman login dengan aman.

---
*Platform Marlins Test Anda kini siap melayani ribuan pengguna dengan domain sendiri secara aman dan profesional!*
