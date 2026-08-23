'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import AdminSidebar from '@/components/navbar/AdminSidebar';
import { Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 p-0.5 animate-pulse mb-4 shadow-lg shadow-purple-500/15">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Shield className="w-7 h-7 text-purple-600 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <p className="text-sm font-bold text-slate-800">Memuat Portal Admin Marlins...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-white bg-grid-pattern text-slate-900 selection:bg-purple-600 selection:text-white">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
