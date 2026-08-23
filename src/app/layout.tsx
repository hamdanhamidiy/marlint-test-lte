import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';

export const metadata: Metadata = {
  title: 'Marlins Test - Maritime English Language Proficiency',
  description: 'Official Maritime English Language Testing & CEFR Assessment Platform for Seafarers and Shipping Companies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[#F0F2F6] text-slate-900 selection:bg-[#5046E5] selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
