import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  badgeText?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
  variant?: 'light' | 'dark';
  href?: string;
  className?: string;
  hideTextOnMobile?: boolean;
}

export default function Logo({
  size = 'md',
  showBadge = false,
  badgeText = 'OFFICIAL',
  showSubtitle = false,
  subtitleText = 'Maritime English Platform',
  variant = 'dark',
  href = '/',
  className = '',
  hideTextOnMobile = false,
}: LogoProps) {
  const sizeClasses = {
    sm: {
      box: 'w-7 h-7 rounded-xl',
      svg: 'w-4 h-4',
      text: 'text-sm',
      badge: 'text-[9px] px-1.5 py-0.5',
      subtitle: 'text-[9px]',
    },
    md: {
      box: 'w-9 h-9 rounded-2xl',
      svg: 'w-5 h-5',
      text: 'text-base sm:text-lg',
      badge: 'text-[10px] px-2 py-0.5',
      subtitle: 'text-[10px]',
    },
    lg: {
      box: 'w-11 h-11 rounded-2xl',
      svg: 'w-6 h-6',
      text: 'text-xl sm:text-2xl',
      badge: 'text-xs px-2.5 py-0.5',
      subtitle: 'text-xs',
    },
    xl: {
      box: 'w-14 h-14 rounded-3xl',
      svg: 'w-8 h-8',
      text: 'text-2xl sm:text-3xl',
      badge: 'text-xs px-3 py-1',
      subtitle: 'text-sm',
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Minimalist Nautical Geometric Icon */}
      <div
        className={`${sizeClasses.box} relative flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 bg-gradient-to-tr from-[#0284C7] via-[#0369A1] to-[#0F172A] transition-transform duration-300 hover:scale-105`}
      >
        <svg
          className={`${sizeClasses.svg} text-white`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Nautical Ring */}
          <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
          
          {/* Modern 4-point Star / Compass Navigation Sparkle */}
          <path
            d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z"
            fill="white"
          />
          
          {/* Inner Nautical Center Ring */}
          <circle cx="12" cy="12" r="2.2" fill="#EA580C" />
        </svg>
      </div>

      {/* Clean Modern Typography */}
      <div className={`flex flex-col ${hideTextOnMobile ? 'hidden sm:flex' : ''}`}>
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-heading font-black tracking-tight ${
              variant === 'light' ? 'text-white' : 'text-slate-950'
            } ${sizeClasses.text}`}
          >
            Marlins<span className="text-[#EA580C]">Test</span>
          </span>

          {showBadge && (
            <span
              className={`font-mono font-black uppercase tracking-wider rounded-md ${sizeClasses.badge} ${
                variant === 'light'
                  ? 'bg-[#EA580C]/15 text-[#EA580C] border border-[#EA580C]/20'
                  : 'bg-orange-50 text-[#C2410C] border border-orange-200/90 shadow-2xs'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {showSubtitle && (
          <p
            className={`font-semibold tracking-tight mt-0.5 ${
              variant === 'light' ? 'text-slate-300' : 'text-slate-500'
            } ${sizeClasses.subtitle}`}
          >
            {subtitleText}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
