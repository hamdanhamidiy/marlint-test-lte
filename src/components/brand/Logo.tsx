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
  badgeText = 'WEB',
  showSubtitle = false,
  subtitleText = 'Maritime English',
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
      badge: 'text-[9px] px-1.5 py-0.2',
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
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Modern Minimalist Geometric Icon */}
      <div
        className={`${sizeClasses.box} relative flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 bg-gradient-to-tr from-[#4F46E5] via-[#4338CA] to-[#06B6D4] transition-transform duration-300 hover:scale-105`}
      >
        <svg
          className={`${sizeClasses.svg} text-white`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle glow circle */}
          <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
          
          {/* Modern 4-point Star / Compass Navigation Sparkle */}
          <path
            d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z"
            fill="white"
          />
          
          {/* Inner Nautical Center Ring */}
          <circle cx="12" cy="12" r="2.2" fill="#4338CA" />
        </svg>
      </div>

      {/* Clean Modern Typography */}
      <div className={`flex flex-col ${hideTextOnMobile ? 'hidden sm:flex' : ''}`}>
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-heading font-extrabold tracking-[-0.03em] ${
              variant === 'light' ? 'text-white' : 'text-slate-900'
            } ${sizeClasses.text}`}
          >
            Marlins<span className="text-[#5046E5]">Test</span>
          </span>

          {showBadge && (
            <span
              className={`font-mono font-bold uppercase tracking-wider rounded-md ${sizeClasses.badge} ${
                variant === 'light'
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-100/80'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {showSubtitle && (
          <p
            className={`font-medium tracking-tight mt-0.5 ${
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
