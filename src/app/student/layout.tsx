'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import Logo from '@/components/brand/Logo';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isExamTakingMode = pathname?.includes('/student/test/take/');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F5F9] text-slate-900">
        <div className="p-4 rounded-3xl bg-white shadow-xl shadow-sky-500/10 border border-slate-100 flex flex-col items-center gap-3 animate-pulse">
          <Logo size="lg" showSubtitle={false} />
          <p className="text-xs font-bold text-slate-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Focused Full-Screen CBT Layout when actively taking an exam
  if (isExamTakingMode) {
    return (
      <div className="min-h-screen bg-[#F0F2F6] text-slate-900 p-0 sm:p-3 lg:p-4 flex flex-col justify-center">
        <div className="w-full max-w-[1400px] mx-auto bg-white rounded-none sm:rounded-2xl border-0 sm:border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[90vh]">
          <main className="flex-1 p-3 sm:p-4 lg:p-5 bg-[#F9FAFC] overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F6] text-slate-900 p-0 sm:p-4 lg:p-6 flex flex-col justify-center relative">
      {/* Mobile Left Sidebar Drawer (Root Level for flawless layering) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Outer Rounded Container */}
      <div className="w-full max-w-[1520px] mx-auto bg-white rounded-none sm:rounded-[32px] border-0 sm:border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex min-h-screen sm:min-h-[92vh]">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Main Workspace Area (TopHeader + Children) */}
        <div className="flex-1 flex flex-col bg-[#F9FAFC] min-w-0 overflow-y-auto">
          {/* Top Header */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-100 bg-[#F9FAFC]/95 backdrop-blur-xs sticky top-0 z-20">
            <TopHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          </div>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-5 lg:p-5.5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
