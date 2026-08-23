import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceIDR(amount: number): string {
  if (amount === 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatStopwatch(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDateIndo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}

export function getCategoryInfo(category: string): {
  name: string;
  color: string;
  bg: string;
  border: string;
  iconName: string;
} {
  switch (category) {
    case 'grammar':
      return {
        name: 'Grammar',
        color: 'text-slate-800',
        bg: 'bg-slate-100',
        border: 'border-slate-300',
        iconName: 'BookOpen',
      };
    case 'vocabulary':
      return {
        name: 'Vocabulary',
        color: 'text-emerald-800',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconName: 'FileText',
      };
    case 'listening_comprehension':
    case 'audio_question':
      return {
        name: 'Listening',
        color: 'text-blue-800',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconName: 'Headphones',
      };
    case 'reading_comprehension':
      return {
        name: 'Reading',
        color: 'text-indigo-800',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        iconName: 'FileSearch',
      };
    case 'time_and_numbers':
      return {
        name: 'Time & Numbers',
        color: 'text-amber-900',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconName: 'Clock',
      };
    case 'pronunciation':
    case 'voice_recording':
      return {
        name: 'Pronunciation',
        color: 'text-slate-900',
        bg: 'bg-slate-100',
        border: 'border-slate-300',
        iconName: 'Mic',
      };
    default:
      return {
        name: category.replace('_', ' '),
        color: 'text-slate-700',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        iconName: 'HelpCircle',
      };
  }
}

export function getLevelBadge(level: string): {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  desc: string;
} {
  const norm = (level || 'A1').toUpperCase();
  switch (norm) {
    case 'C1':
      return {
        label: 'C1 - Master / Chief Engineer',
        badgeBg: 'bg-slate-900',
        badgeText: 'text-white font-bold',
        badgeBorder: 'border-slate-900',
        desc: 'Full Operational Command English (STCW Management Level)',
      };
    case 'B2':
      return {
        label: 'B2 - Chief Officer / 2nd Engineer',
        badgeBg: 'bg-slate-800',
        badgeText: 'text-white font-bold',
        badgeBorder: 'border-slate-800',
        desc: 'Advanced Maritime Operational Proficiency',
      };
    case 'B1+':
      return {
        label: 'B1+ - Officer of the Watch (OOW)',
        badgeBg: 'bg-blue-700',
        badgeText: 'text-white font-bold',
        badgeBorder: 'border-blue-700',
        desc: 'Competent Navigational & Working Proficiency',
      };
    case 'B1':
      return {
        label: 'B1 - Able Seafarer Deck/Engine',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-800 font-bold',
        badgeBorder: 'border-slate-300',
        desc: 'Standard Maritime English Communication',
      };
    case 'A2':
      return {
        label: 'A2 - Rating / Ordinary Seaman',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700 font-bold',
        badgeBorder: 'border-slate-300',
        desc: 'Basic Maritime Vocabulary & Safety Instructions',
      };
    case 'A1':
    default:
      return {
        label: 'A1 - Beginner Trainee',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-600 font-bold',
        badgeBorder: 'border-slate-200',
        desc: 'Elementary Foundation for Maritime Students',
      };
  }
}
