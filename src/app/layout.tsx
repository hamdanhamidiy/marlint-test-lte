import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Marlins Test - Sekolah Perhotelan & Kapal Pesiar LTE Cruise',
  description: 'Platform resmi evaluasi dan asesmen Bahasa Inggris Marlins Test untuk lembaga pelatihan perhotelan & kru kapal pesiar LTE Cruise (Hotel & Marine Training Center).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable} scroll-smooth`}>
      <body className={`${plusJakartaSans.className} font-sans antialiased min-h-screen bg-white text-slate-900 selection:bg-[#0284C7] selection:text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

