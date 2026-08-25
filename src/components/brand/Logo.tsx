import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  subtitleText = 'Hotel Marine Training Center',
  variant = 'dark',
  href = '/',
  className = '',
  hideTextOnMobile = false,
}: LogoProps) {
  const sizeClasses = {
    sm: {
      imgBox: 'w-8 h-8',
      text: 'text-sm',
      badge: 'text-[9px] px-1.5 py-0.5',
      subtitle: 'text-[9px]',
    },
    md: {
      imgBox: 'w-10 h-10',
      text: 'text-base sm:text-lg',
      badge: 'text-[10px] px-2 py-0.5',
      subtitle: 'text-[10px]',
    },
    lg: {
      imgBox: 'w-12 h-12',
      text: 'text-xl sm:text-2xl',
      badge: 'text-xs px-2.5 py-0.5',
      subtitle: 'text-xs',
    },
    xl: {
      imgBox: 'w-16 h-16',
      text: 'text-2xl sm:text-3xl',
      badge: 'text-xs px-3 py-1',
      subtitle: 'text-sm',
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official LTE Cruise Logo */}
      <div
        className={`${sizeClasses.imgBox} relative flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 drop-shadow-xs`}
      >
        <img
          src="/images/lte-cruise-logo.png"
          alt="LTE Cruise - Hotel Marine Training Center"
          className="w-full h-full object-contain filter"
        />
      </div>

      {/* Clean Modern Typography */}
      <div className={`flex flex-col ${hideTextOnMobile ? 'hidden sm:flex' : ''}`}>
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-heading font-extrabold tracking-tight ${
              variant === 'light' ? 'text-white' : 'text-slate-950'
            } ${sizeClasses.text}`}
          >
            LTE <span className="text-[#0284C7]">Cruise</span>
          </span>

          {showBadge && (
            <span
              className={`font-mono font-black uppercase tracking-wider rounded-md ${sizeClasses.badge} ${
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
            className={`font-bold tracking-tight mt-0.5 ${
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
