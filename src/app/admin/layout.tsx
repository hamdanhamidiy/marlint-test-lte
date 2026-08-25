'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import AdminSidebar from '@/components/navbar/AdminSidebar';
import { Shield, Menu } from 'lucide-react';
import Logo from '@/components/brand/Logo';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin, profile, isSuperAdmin, isInstructor } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile && !isAdmin) {
        // Regular students cannot access the admin/instructor portal
        router.push('/student/dashboard');
      }
    }
  }, [user, loading, profile, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-900">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#EA580C] p-0.5 animate-pulse mb-4 shadow-lg shadow-sky-500/15">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#0284C7] animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <p className="text-xs sm:text-sm font-bold text-slate-800">Memuat Portal Pengelolaan Marlins...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isInstructorRole = profile?.role === 'instructor' || isInstructor;
  const isSuperAdminRole = profile?.role === 'super_admin' || isSuperAdmin;
  const badgeText = isSuperAdminRole ? 'SUPER ADMIN' : isInstructorRole ? 'INSTRUKTUR' : 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-slate-900 selection:bg-[#0284C7] selection:text-white font-sans">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" showBadge={false} href="/admin/dashboard" />
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
            isSuperAdminRole
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : isInstructorRole
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-orange-50 text-[#C2410C] border border-orange-200'
          }`}>
            {badgeText}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="Online" />
        </div>
      </header>

      {/* Admin Sidebar (Desktop permanent + Mobile Drawer) */}
      <AdminSidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto min-w-0 w-full">
        {children}
      </main>
    </div>
  );
}
