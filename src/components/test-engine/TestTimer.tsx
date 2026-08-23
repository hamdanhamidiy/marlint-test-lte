'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatStopwatch } from '@/lib/utils';

interface TestTimerProps {
  startedAt?: string;
}

export default function TestTimer({ startedAt }: TestTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    if (!startedAt) return 0;
    const diff = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    return Math.max(0, diff);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (startedAt) {
        const diff = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
        setElapsedSeconds(Math.max(0, diff));
      } else {
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="inline-flex items-center gap-1.5 text-slate-300 font-mono text-xs sm:text-sm font-semibold tracking-wider">
      <Clock className="w-4 h-4 text-slate-400" />
      <span>{formatStopwatch(elapsedSeconds)}</span>
    </div>
  );
}
