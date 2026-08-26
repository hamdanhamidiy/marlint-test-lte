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
  badgeText = '',
  showSubtitle = true,
  subtitleText = 'LTE Cruise Training Center',
  variant = 'dark',
  href = '/',
  className = '',
  hideTextOnMobile = false,
}: LogoProps) {
  const sizeClasses = {
    sm: {
      imgBox: 'w-7 h-7',
      text: 'text-sm',
      badge: 'text-[9px] px-1.5 py-0.5',
      subtitle: 'text-[9px]',
    },
    md: {
      imgBox: 'w-9 h-9',
      text: 'text-[15px]',
      badge: 'text-[10px] px-2 py-0.5',
      subtitle: 'text-[10px]',
    },
    lg: {
      imgBox: 'w-11 h-11',
      text: 'text-lg sm:text-xl',
      badge: 'text-xs px-2.5 py-0.5',
      subtitle: 'text-xs',
    },
    xl: {
      imgBox: 'w-14 h-14',
      text: 'text-2xl',
      badge: 'text-xs px-3 py-1',
      subtitle: 'text-xs sm:text-sm',
    },
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official LTE Cruise Logo Icon */}
      <div
        className={`${sizeClasses.imgBox} relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        <img
          src="/images/lte-cruise-logo.png"
          alt="Marlins Test - LTE Cruise"
          className="w-full h-full object-contain filter drop-shadow-2xs"
        />
      </div>

      {/* Clean Horizontal Modern Typography: MarlinsTest with LTE Cruise subline */}
      <div className={`flex flex-col justify-center min-w-0 ${hideTextOnMobile ? 'hidden sm:flex' : ''}`}>
        <div className="flex items-center gap-1.5 leading-tight whitespace-nowrap">
          <span
            className={`font-heading font-extrabold tracking-tight whitespace-nowrap ${
              variant === 'light' ? 'text-white' : 'text-slate-950'
            } ${sizeClasses.text}`}
          >
            Marlins<span className="text-[#0284C7]">Test</span>
          </span>

          {showBadge && badgeText && (
            <span
              className={`font-mono font-bold uppercase tracking-wider rounded-full shrink-0 ${sizeClasses.badge} ${
                variant === 'light'
                  ? 'bg-sky-500/20 text-[#38BDF8] border border-sky-400/30'
                  : 'bg-orange-50 text-[#C2410C] border border-orange-200/90 shadow-2xs'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {showSubtitle && (
          <p
            className={`font-semibold tracking-tight leading-tight whitespace-nowrap truncate ${
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
