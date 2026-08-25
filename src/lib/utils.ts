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

/**
 * Deterministic Pseudo-Random Number Generator (PRNG) based on string seed.
 * Produces consistent random sequences for a specific attempt/session ID.
 */
export function createSeededRandom(seedStr: string): () => number {
  let h = 1779033703 ^ (seedStr || 'marlins').length;
  for (let i = 0; i < (seedStr || 'marlins').length; i++) {
    h = Math.imul(h ^ (seedStr || 'marlins').charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffles an array using Fisher-Yates algorithm and a custom PRNG.
 */
export function shuffleArrayWithSeed<T>(array: T[], rng: () => number): T[] {
  if (!array || array.length <= 1) return [...(array || [])];
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Randomizes questions order and their internal multiple-choice options,
 * dropdown options, draggable labels, and word arrangement lists per test session.
 */
export function randomizeTestQuestions(questions: any[], sessionKey: string): any[] {
  if (!questions || !Array.isArray(questions) || questions.length === 0) return [];
  const rng = createSeededRandom(sessionKey || `marlins-${Date.now()}`);

  // 1. Shuffle the order of questions
  const shuffledQuestions = shuffleArrayWithSeed(questions, rng);

  // 2. Shuffle choices / options inside each question
  return shuffledQuestions.map((q, idx) => {
    const cloned = { ...q, order_number: idx + 1 };

    // Multiple Choice / Audio Listening / Image Choice options
    if (cloned.options && Array.isArray(cloned.options) && cloned.options.length > 1) {
      cloned.options = shuffleArrayWithSeed(cloned.options, rng);
    }

    // Question Data sub-options
    if (cloned.question_data && typeof cloned.question_data === 'object') {
      const qData = { ...cloned.question_data };

      // Sentence reorder word chips
      if (qData.words && Array.isArray(qData.words) && qData.words.length > 1) {
        qData.words = shuffleArrayWithSeed(qData.words, rng);
      }

      // Drag and drop labels pool
      if (qData.labels && Array.isArray(qData.labels) && qData.labels.length > 1) {
        qData.labels = shuffleArrayWithSeed(qData.labels, rng);
      }

      // Paragraph title match dropdown options
      if (qData.titles && Array.isArray(qData.titles) && qData.titles.length > 1) {
        qData.titles = shuffleArrayWithSeed(qData.titles, rng);
      }

      // Gap fill choices per blank
      if (qData.gaps && Array.isArray(qData.gaps)) {
        qData.gaps = qData.gaps.map((gap: any) => {
          if (gap && gap.options && Array.isArray(gap.options) && gap.options.length > 1) {
            return {
              ...gap,
              options: shuffleArrayWithSeed(gap.options, rng),
            };
          }
          return gap;
        });
      }

      cloned.question_data = qData;
    }

    return cloned;
  });
}

