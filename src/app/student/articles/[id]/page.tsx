'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Calendar,
  ArrowRight,
  Sparkles,
  Volume2,
  Square,
  Pause,
  Share2,
  CheckCircle2,
  Bookmark,
  Radio,
  FileText,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Award,
  RotateCcw,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Article } from '@/lib/supabase/types';
import { formatDateIndo } from '@/lib/utils';

interface MiniQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_MODULE_QUIZZES: Record<string, MiniQuizQuestion[]> = {
  'art-1': [
    {
      question: 'Manakah Message Marker yang tepat digunakan saat kapal memberikan peringatan bahaya navigasi mendesak?',
      options: ['INSTRUCTION', 'WARNING', 'INFORMATION', 'ADVICE'],
      correctIndex: 1,
      explanation: 'WARNING digunakan khusus untuk peringatan bahaya navigasi mendesak seperti buoy padam, cuaca ekstrem, atau kapal hanyut.',
    },
    {
      question: 'Bagaimana respons baku dalam SMCP jika Anda tidak mendengar instruksi dengan jelas?',
      options: ['Pardon me, what?', 'Maybe, I think so', 'Say again', 'Repeat please bro'],
      correctIndex: 2,
      explanation: 'Frasa baku IMO SMCP untuk meminta pengulangan pesan transmisi adalah "Say again".',
    },
  ],
  'art-2': [
    {
      question: 'Mesin derek yang digunakan untuk mengangkat dan menurunkan rantai jangkar disebut...',
      options: ['Fairlead', 'Windlass', 'Bollard', 'Capstan'],
      correctIndex: 1,
      explanation: 'Windlass adalah mesin derek jangkar utama yang dipasang di haluan kapal (forecastle).',
    },
    {
      question: 'Pompa yang berfungsi membuang akumulasi air got dari lambung kapal terbawah adalah...',
      options: ['Bilge Pump', 'Scavenge Air Pump', 'Fuel Purifier', 'Ballast Pump'],
      correctIndex: 0,
      explanation: 'Bilge Pump bertugas mengalirkan air got (bilge water) dari kamar mesin melewati separator minyak.',
    },
  ],
  'art-3': [
    {
      question: 'Jika ada kapal lain berada tepat 90 derajat di lambung kiri kapal Anda, arah tersebut dinamakan...',
      options: ['Ahead', 'Astern', 'Abeam Port', 'Abeam Starboard'],
      correctIndex: 2,
      explanation: 'Abeam Port berarti tepat melintang 90 derajat di sebelah kiri (port side) kapal.',
    },
  ],
  'art-4': [
    {
      question: 'Berapa pola tiupan bunyi alarm darurat umum (General Emergency Alarm) di atas kapal?',
      options: [
        '1 tiupan panjang',
        '7 tiupan pendek disusul 1 tiupan panjang',
        '3 tiupan pendek terus menerus',
        '2 tiupan panjang 1 tiupan pendek',
      ],
      correctIndex: 1,
      explanation: 'General Emergency Alarm sesuai SOLAS adalah 7 tiupan pendek disusul 1 tiupan panjang (7 short blasts + 1 prolonged blast).',
    },
  ],
};

const ALL_MODULE_IDS = ['art-1', 'art-2', 'art-3', 'art-4'];

// Helper to parse inline markdown like **bold** text and *italic* text
function parseInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export default function SingleArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = (params.id as string) || 'art-1';

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedPhraseIndex, setCopiedPhraseIndex] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'medium' | 'large'>('normal');

  // Text-To-Speech (TTS Audio Player)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mini-Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // 1. Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Load Article Data
  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          setIsPlayingAudio(false);
          setIsPausedAudio(false);
        }

        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .maybeSingle();

        const fallbackData: Record<string, Article> = {
          'art-1': {
            id: 'art-1',
            title: 'Standard Marine Communication Phrases (SMCP) Essentials',
            summary: 'Panduan lengkap frasa komunikasi standar IMO untuk percakapan radio VHF antar kapal, VTS, dan stasiun pandu pelabuhan.',
            content: `Standard Marine Communication Phrases (SMCP) merupakan instrumen penting keselamatan maritim internasional yang ditetapkan oleh International Maritime Organization (IMO).

Dalam komunikasi navigasi maritim, kejelasan informasi dan penggunaan frasa yang seragam adalah kunci utama untuk mencegah salah pengertian dan bahaya tabrakan di laut.

### 1. Penggunaan Message Markers
Message Markers digunakan pada awal transmisi radio VHF untuk menegaskan maksud dari pesan yang disampaikan:
- **INSTRUCTION**: Pesan yang mengikat secara regulasi navigasi (misal instruksi dari VTS).
- **ADVICE**: Saran navigasi dari stasiun pandu atau otoritas pelabuhan.
- **WARNING**: Peringatan bahaya navigasi mendesak (misal kapal hanyut, cuaca buruk, buoy padam).
- **INFORMATION**: Informasi umum mengenai posisi, draft, atau perkiraan waktu kedatangan (ETA).
- **QUESTION**: Permintaan informasi spesifik dari stasiun kapal lain.
- **ANSWER**: Jawaban langsung atas pertanyaan yang telah diajukan.
- **REQUEST**: Permintaan bantuan atau asistensi operasional (misal Tug assistance).
- **INTENTION**: Pernyataan tindakan manuver yang akan segera dilakukan oleh kapal.

### 2. Standar Respons Baku (Standard Responses)
Dalam komunikasi SMCP, setiap respons harus ringkas, tegas, dan tidak boleh ambigu:
- Hindari kata yang tidak pasti seperti "Maybe" atau "I think so".
- Gunakan frasa resmi: "Understood", "Mistake - correction", "Say again", dan "Stand by on VHF Channel 16".

Pelajari dan praktikkan frasa ini secara teratur untuk memastikan kesiapan penuh menghadapi evaluasi Marlins English Test.`,
            category: 'Radio Communication',
            author: 'Capt. Maritime Instructor',
            read_time_minutes: 6,
            is_published: true,
            created_at: new Date().toISOString(),
          },
          'art-2': {
            id: 'art-2',
            title: 'Essential Maritime Vocabulary: Deck & Engine Terminology',
            summary: 'Daftar istilah kunci kosakata maritim seputar peralatan geladak kapal, kamar mesin, tali-temali, dan penataan kargo.',
            content: `Penguasaan kosakata teknis geladak (deck) dan kamar mesin (engine room) adalah fondasi mutlak bagi setiap pelaut yang bekerja di armada niaga maupun kapal pesiar internasional.

### 1. Istilah Geladak & Olah Gerak (Deck Terminology)
Kosakata harian operasional geladak kapal:
- **Windlass**: Mesin derek jangkar untuk mengangkat dan menurunkan rantai jangkar di haluan.
- **Fairlead**: Pemandu tali tambat agar tidak bergesekan langsung dengan lambung kapal.
- **Bollard**: Tiang besi kokoh di dermaga atau geladak untuk mengikatkan tali tambat (mooring line).
- **Heave Up**: Perintah untuk menarik tali atau rantai ke atas menggunakan mesin derek.
- **Slack Away**: Perintah untuk mengendurkan tali tambat secara bertahap dan aman.

### 2. Istilah Kamar Mesin (Engine Terminology)
Istilah penting permesinan kapal:
- **Auxiliary Engine**: Mesin bantu diesel penghasil daya listrik utama bagi seluruh sistem kapal.
- **Bilge Pump**: Pompa khusus untuk membuang akumulasi air got dari bagian terendah lambung kapal.
- **Scavenge Air**: Udara bertekanan bersih yang disuplai ke silinder mesin untuk pembakaran optimal.
- **Fuel Oil Purifier**: Alat pemisah sentrifugal untuk memurnikan bahan bakar minyak dari kotoran dan air.`,
            category: 'Vocabulary',
            author: 'Chief Engineer Consultant',
            read_time_minutes: 5,
            is_published: true,
            created_at: new Date().toISOString(),
          },
          'art-3': {
            id: 'art-3',
            title: 'Mastering Prepositions and Directions at Sea',
            summary: 'Memahami preposisi arah navigasi kapal: Ahead, Astern, Abeam, Port side, Starboard side, Forward, dan Aft.',
            content: `Bahasa Inggris Maritim memiliki tata cara penunjukan arah dan posisi spasial yang sangat spesifik untuk mencegah kesalahan navigasi antar perwira jaga di anjungan (bridge).

### 1. Kuadran Posisi Kapal (Relative Bearings)
Penunjukan posisi relatif objek terhadap haluan kapal:
- **Ahead**: Tepat lurus di depan haluan kapal (000° relatif).
- **Astern**: Tepat lurus di belakang buritan kapal (180° relatif).
- **Abeam Port**: Tepat 90 derajat di lambung kiri kapal.
- **Abeam Starboard**: Tepat 90 derajat di lambung kanan kapal.
- **On the Starboard Bow**: Berada di arah serong depan sebelah kanan kapal (kira-kira 045°).
- **On the Port Quarter**: Berada di arah serong belakang sebelah kiri kapal (kira-kira 225°).

### 2. Arah di Dalam Kapal (Internal Vessel Directions)
Pergerakan di atas kapal:
- **Forward (Fwd)**: Bergerak menuju ke arah haluan (depan kapal).
- **Aft**: Bergerak menuju ke arah buritan (belakang kapal).
- **Athwartships**: Melintang dari satu sisi lambung ke sisi lambung lainnya.`,
            category: 'Grammar & Navigation',
            author: 'Navigation Deck Officer',
            read_time_minutes: 4,
            is_published: true,
            created_at: new Date().toISOString(),
          },
          'art-4': {
            id: 'art-4',
            title: 'Emergency Drill Commands and Life-Saving Appliances (LSA)',
            summary: 'Perintah baku saat latihan darurat kapal: Fire Drill, Abandon Ship, Man Overboard (MOB), dan pengoperasian LSA.',
            content: `Kesiapan menghadapi situasi darurat di laut diatur secara ketat oleh konvensi SOLAS (Safety of Life at Sea). Setiap kru kapal wajib memahami komando audio dan terminologi keselamatan internasional.

### 1. Isyarat Darurat Umum (Alarm Signals)
Kenali bunyi tanda bahaya di atas kapal:
- **General Emergency Alarm**: Tujuh tiupan/bunyi pendek disusul satu bunyi panjang (7 short blasts + 1 prolonged blast).
- **Fire Alarm**: Bunyi sirine terus-menerus (continuous ringing).
- **Abandon Ship Order**: Hanya diberikan langsung secara verbal oleh Nakhoda (Master).

### 2. Peralatan Keselamatan Jiwa (Life-Saving Appliances)
Peralatan wajib standar IMO SOLAS:
- **Muster Station**: Titik kumpul yang telah ditentukan bagi seluruh penumpang dan awak kapal saat terjadi situasi darurat.
- **Immersion Suit**: Pakaian pelindung termal tahan air untuk mencegah hipotermia di air laut dingin.
- **EPIRB (Emergency Position Indicating Radio Beacon)**: Pemancar sinyal darurat satelit otomatis untuk lokasi kapal tenggelam.
- **SART (Search and Rescue Transponder)**: Perangkat radar pencari lokasi sekoci penolong oleh kapal penolong.
- **Lifebuoy with Self-Igniting Light**: Pelampung penolong yang dilengkapi lampu otomatis menyala saat tercebur ke laut.`,
            category: 'Safety & Emergency',
            author: 'Safety Officer & Auditor',
            read_time_minutes: 7,
            is_published: true,
            created_at: new Date().toISOString(),
          },
        };

        const currentArticle = (data as Article) || fallbackData[articleId] || fallbackData['art-1'];
        setArticle(currentArticle);

        // Restore bookmarks & completed status from localStorage
        if (typeof window !== 'undefined') {
          const savedBookmarks = JSON.parse(localStorage.getItem('marlins_article_bookmarks') || '[]');
          setIsBookmarked(savedBookmarks.includes(articleId));

          const savedCompleted = JSON.parse(localStorage.getItem('marlins_article_completed') || '[]');
          setIsCompleted(savedCompleted.includes(articleId));
        }
      } catch (err) {
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [articleId]);

  // Handle Text-To-Speech (Native Web Speech API)
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Fitur audio browser tidak didukung pada peramban ini.');
      return;
    }

    if (isPlayingAudio && !isPausedAudio) {
      window.speechSynthesis.pause();
      setIsPausedAudio(true);
      return;
    }

    if (isPausedAudio) {
      window.speechSynthesis.resume();
      setIsPausedAudio(false);
      return;
    }

    // Start fresh audio playback
    window.speechSynthesis.cancel();

    const plainText = `${article?.title}. ${article?.summary || ''}. ${article?.content?.replace(/[#*_-]/g, '') || ''}`;
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = 'en-US';
    utterance.rate = playbackSpeed;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (enVoice) utterance.voice = enVoice;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  };

  // Speak single term/phrase on card
  const handleSpeakPhrase = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCopyPhrase = (phrase: string, index: number) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(phrase);
      setCopiedPhraseIndex(index);
      setTimeout(() => setCopiedPhraseIndex(null), 2000);
    }
  };

  const toggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('marlins_article_bookmarks') || '[]');
      const updated = nextState ? [...saved, articleId] : saved.filter((id: string) => id !== articleId);
      localStorage.setItem('marlins_article_bookmarks', JSON.stringify(updated));
    }
  };

  const toggleCompleted = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('marlins_article_completed') || '[]');
      const updated = nextState ? [...saved, articleId] : saved.filter((id: string) => id !== articleId);
      localStorage.setItem('marlins_article_completed', JSON.stringify(updated));
    }
  };

  // Previous & Next navigation
  const currentIndex = ALL_MODULE_IDS.indexOf(articleId);
  const prevArticleId = currentIndex > 0 ? ALL_MODULE_IDS[currentIndex - 1] : null;
  const nextArticleId = currentIndex < ALL_MODULE_IDS.length - 1 ? ALL_MODULE_IDS[currentIndex + 1] : null;
  const currentQuizzes = SAMPLE_MODULE_QUIZZES[articleId] || [];

  if (loading) {
    return (
      <div className="p-16 text-center bg-white border border-slate-200/80 rounded-3xl max-w-md mx-auto space-y-3 shadow-2xs">
        <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto animate-spin">
          <BookOpen className="w-4 h-4" />
        </div>
        <h2 className="text-xs font-bold text-slate-700">Memuat Modul Pembelajaran Maritim...</h2>
      </div>
    );
  }

  if (!article) return null;

  // Custom typography size classes
  const textSizeClass =
    fontSize === 'large'
      ? 'text-base sm:text-lg leading-relaxed'
      : fontSize === 'medium'
      ? 'text-sm sm:text-base leading-relaxed'
      : 'text-xs sm:text-sm leading-relaxed';

  /**
   * ROBUST ARTICLE PARSER:
   * Accurately parses and structures markdown content into headings,
   * definition cards for key terms, bullet lists, and paragraphs.
   */
  const renderStructuredContent = (rawText: string) => {
    if (!rawText) return null;

    // 1. Normalize line endings and inline bullet points
    let normalized = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    // Split concatenated inline bullets like "...disampaikan: - **INSTRUCTION**: ... - **ADVICE**: ..."
    normalized = normalized.replace(/([^\n])\s+-\s+\*\*/g, '$1\n- **');
    normalized = normalized.replace(/([^\n])\s+-\s+([A-Z])/g, '$1\n- $2');

    // Separate headings if stuck to preceding text
    normalized = normalized.replace(/([^\n])\s*(###?\s*\d+\.|\d+\.\s+[A-Z])/g, '$1\n\n$2');

    const rawBlocks = normalized.split(/\n\n+/);

    let globalItemCounter = 0;

    return rawBlocks.map((block, blockIdx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Case A: Section Headings (e.g. "### 1. Penggunaan Message Markers" or "1. Penggunaan Message Markers")
      const headingMatch = trimmed.match(/^(?:###?\s*)?(\d+)\.\s+(.*)$/);
      if (headingMatch && !trimmed.includes('\n')) {
        const [, num, headingTitle] = headingMatch;
        return (
          <div key={blockIdx} className="pt-6 pb-2 border-t border-slate-100 first:pt-0 first:border-0 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-[#0284C7] font-mono text-[11px] font-extrabold tracking-wider border border-sky-100">
              <span>BAGIAN #{num}</span>
            </div>
            <h2 className="font-heading text-lg sm:text-2xl font-extrabold text-slate-950 flex items-center gap-2.5 tracking-tight text-[#0B192C]">
              <span className="w-1.5 h-6 rounded-full bg-[#0284C7] shrink-0" />
              <span>{headingTitle}</span>
            </h2>
          </div>
        );
      }

      // If a heading was combined with description text in the same block (e.g. "### 1. Title\nDescription text...")
      const firstLine = trimmed.split('\n')[0].trim();
      const combinedHeadingMatch = firstLine.match(/^(?:###?\s*)?(\d+)\.\s+(.*)$/);
      if (combinedHeadingMatch) {
        const [, num, headingTitle] = combinedHeadingMatch;
        const restOfBlock = trimmed.split('\n').slice(1).join('\n').trim();

        return (
          <div key={blockIdx} className="space-y-4 pt-6 border-t border-slate-100 first:pt-0 first:border-0">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-[#0284C7] font-mono text-[11px] font-extrabold tracking-wider border border-sky-100">
                <span>BAGIAN #{num}</span>
              </div>
              <h2 className="font-heading text-lg sm:text-2xl font-extrabold text-slate-950 flex items-center gap-2.5 tracking-tight text-[#0B192C]">
                <span className="w-1.5 h-6 rounded-full bg-[#0284C7] shrink-0" />
                <span>{headingTitle}</span>
              </h2>
            </div>

            {restOfBlock && renderSubContent(restOfBlock, blockIdx, globalItemCounter, (val) => { globalItemCounter = val; })}
          </div>
        );
      }

      return renderSubContent(trimmed, blockIdx, globalItemCounter, (val) => { globalItemCounter = val; });
    });
  };

  const renderSubContent = (
    subText: string,
    keyPrefix: string | number,
    itemCounter: number,
    updateCounter: (val: number) => void
  ) => {
    const lines = subText.split('\n').map((l) => l.trim()).filter(Boolean);

    // Extract bullet items vs normal paragraphs
    const isBulletList = lines.every((l) => l.startsWith('- ') || l.startsWith('* '));

    if (isBulletList) {
      // Check if items follow the key-value dictionary pattern: "- **KEY**: Description"
      const isKeyValue = lines.some((l) => l.includes('**') && l.includes(':'));

      if (isKeyValue) {
        return (
          <div key={keyPrefix} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 pb-2">
            {lines.map((line, lIdx) => {
              const cleanLine = line.replace(/^[-*]\s*/, '');
              const match = cleanLine.match(/^\*\*(.*?)\*\*:\s*(.*)$/);
              const currentIndex = itemCounter + lIdx;

              if (match) {
                const [, key, val] = match;
                return (
                  <div
                    key={lIdx}
                    className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:border-sky-300 hover:bg-sky-50/20 transition-all duration-200 flex flex-col justify-between space-y-2.5 group shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-xl bg-sky-100 text-[#0284C7] font-mono text-xs font-extrabold uppercase tracking-wider shadow-2xs">
                        {key}
                      </span>
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleSpeakPhrase(`${key}. ${val}`)}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-[#0284C7] transition-colors cursor-pointer"
                          title="Dengarkan Pengucapan"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPhrase(`${key}: ${val}`, currentIndex)}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Salin Frasa"
                        >
                          {copiedPhraseIndex === currentIndex ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {parseInlineMarkdown(val)}
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={lIdx}
                  className="col-span-full flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                  <span>{parseInlineMarkdown(cleanLine)}</span>
                </div>
              );
            })}
          </div>
        );
      }

      // Regular clean bullet list
      return (
        <div key={keyPrefix} className="space-y-2.5 py-1">
          {lines.map((line, lIdx) => {
            const cleanLine = line.replace(/^[-*]\s*/, '');
            return (
              <div
                key={lIdx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>{parseInlineMarkdown(cleanLine)}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Standard styled paragraphs
    return (
      <div key={keyPrefix} className="space-y-3">
        {lines.map((line, lIdx) => {
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const cleanLine = line.replace(/^[-*]\s*/, '');
            return (
              <div
                key={lIdx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed"
              >
                <span className="w-2 h-2 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>{parseInlineMarkdown(cleanLine)}</span>
              </div>
            );
          }
          return (
            <p key={lIdx} className="leading-relaxed font-normal text-slate-600">
              {parseInlineMarkdown(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16 font-sans min-w-0">
      
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <Link
          href="/student/articles"
          className="group inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#0284C7] transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:border-[#0284C7] group-hover:text-[#0284C7] transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Pusat Materi</span>
        </Link>

        {/* Action Controls Toolbar: TTS Audio, Text Size, Bookmark, Share */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Audio Player Controls */}
          <div className="flex items-center gap-1 bg-sky-50/80 border border-sky-200/80 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isPlayingAudio && !isPausedAudio
                  ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                  : 'bg-[#0284C7] text-white hover:bg-[#0369A1]'
              }`}
              title="Dengarkan Audio Pelafalan Bahasa Inggris"
            >
              {isPlayingAudio && !isPausedAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Jeda Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPausedAudio ? 'Lanjutkan' : 'Dengarkan Audio'}</span>
                </>
              )}
            </button>

            {isPlayingAudio && (
              <button
                type="button"
                onClick={handleStopAudio}
                className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-rose-600 border border-slate-200 text-xs cursor-pointer"
                title="Hentikan Audio"
              >
                <Square className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const nextSpeed = playbackSpeed === 1.0 ? 0.8 : 1.0;
                setPlaybackSpeed(nextSpeed);
              }}
              className="px-2 py-1 rounded-lg text-[10px] font-extrabold text-[#0284C7] bg-white border border-sky-200 cursor-pointer"
              title="Kecepatan Bicara"
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* Text Size Adjuster */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${fontSize === 'normal' ? 'bg-white text-slate-950 shadow-2xs font-extrabold' : ''}`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('medium')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors text-xs ${fontSize === 'medium' ? 'bg-white text-slate-950 shadow-2xs font-extrabold' : ''}`}
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors text-sm ${fontSize === 'large' ? 'bg-white text-slate-950 shadow-2xs font-extrabold' : ''}`}
            >
              A++
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-2xs ${
              isBookmarked
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:border-slate-300'
            }`}
            title={isBookmarked ? 'Tersimpan di Bookmark' : 'Simpan ke Bookmark'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:border-slate-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Bagikan Tautan"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 text-[11px]">Tersalin</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Bagikan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Reading Card */}
      <article className="bg-white p-6 sm:p-10 rounded-[30px] border border-slate-200/90 shadow-xs space-y-7 relative overflow-hidden">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C]" />

        {/* Category & Meta Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 pt-1">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-xs font-extrabold uppercase tracking-wider">
              {article.category || 'IMO SMCP'}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Standar STCW Maritim</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-[#0284C7] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.read_time_minutes || 5} menit estimasi baca</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDateIndo(article.created_at)}</span>
            </span>
          </div>
        </div>

        {/* Article Title */}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-950 leading-[1.22] tracking-tight">
          {article.title}
        </h1>

        {/* Key Summary / Takeaway Quote Box */}
        {article.summary && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-50/90 to-blue-50/50 border-l-4 border-[#0284C7] shadow-2xs space-y-1.5">
            <span className="text-[11px] uppercase font-extrabold tracking-wider text-[#0284C7] block">
              Ringkasan Intisari Pembelajaran
            </span>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed italic">
              "{article.summary}"
            </p>
          </div>
        )}

        {/* Structured Reading Content */}
        <div className={`space-y-6 pt-1 text-slate-700 ${textSizeClass}`}>
          {renderStructuredContent(article.content)}
        </div>

        {/* Interactive Mini-Quiz Checkpoint Section */}
        {currentQuizzes.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-950">
                    Kuis Cepat Uji Pemahaman (Checkpoint)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Uji daya tangkap Anda terhadap materi sebelum melanjutkan ke simulasi ujian lengkap.
                  </p>
                </div>
              </div>

              {showQuizResults && (
                <button
                  type="button"
                  onClick={() => {
                    setUserAnswers({});
                    setShowQuizResults(false);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Ulangi Kuis</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {currentQuizzes.map((quiz, qIdx) => {
                const selectedOption = userAnswers[qIdx];
                const isAnswered = selectedOption !== undefined;
                const isCorrect = isAnswered && selectedOption === quiz.correctIndex;

                return (
                  <div
                    key={qIdx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-3"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      <span className="text-[#0284C7] font-mono mr-1.5">{qIdx + 1}.</span>
                      {quiz.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {quiz.options.map((opt, optIdx) => {
                        const isChosen = selectedOption === optIdx;
                        let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-sky-300';

                        if (showQuizResults) {
                          if (optIdx === quiz.correctIndex) {
                            btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                          } else if (isChosen) {
                            btnStyle = 'bg-rose-50 border-rose-300 text-rose-800 line-through';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-[#0284C7] border-[#0284C7] text-white font-bold shadow-xs';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              if (!showQuizResults) {
                                setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                              }
                            }}
                            className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {showQuizResults && optIdx === quiz.correctIndex && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showQuizResults && (
                      <div className={`p-3 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        <p className="font-bold">{isCorrect ? 'Benar! 🎉' : 'Kurang tepat!'}</p>
                        <p className="mt-0.5 text-[11px] font-normal">{quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {!showQuizResults && (
                <button
                  type="button"
                  onClick={() => setShowQuizResults(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    Object.keys(userAnswers).length > 0
                      ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Periksa Jawaban Kuis
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mark as Completed & Author Footer */}
        <div className="pt-7 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 p-0.5 shadow-2xs flex items-center justify-center shrink-0 text-xl">
              👨‍✈️
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                {article.author || 'Capt. Maritime Instructor'}
              </p>
              <p className="text-[11px] text-slate-400 font-normal">
                IMO SMCP & Marlins Standardized Lead Instructor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleCompleted}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isCompleted ? 'Selesai Dipelajari' : 'Tandai Selesai'}</span>
            </button>

            <Link
              href="/student/tests"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B192C] hover:from-[#0369A1] hover:to-[#075985] text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Uji Pemahaman di Soal Marlins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>

      {/* Bottom Navigation: Previous & Next Article */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {prevArticleId ? (
          <Link
            href={`/student/articles/${prevArticleId}`}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-300 hover-lift shadow-2xs flex items-center gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-sky-50 group-hover:text-[#0284C7] transition-colors shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                Modul Sebelumnya
              </span>
              <span className="text-xs font-bold text-slate-900 truncate block group-hover:text-[#0284C7] transition-colors">
                Materi #{prevArticleId.replace('art-', '')}
              </span>
            </div>
          </Link>
        ) : <div />}

        {nextArticleId && (
          <Link
            href={`/student/articles/${nextArticleId}`}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-300 hover-lift shadow-2xs flex items-center justify-between gap-3 text-right group ml-auto w-full sm:w-auto sm:min-w-[240px]"
          >
            <div className="min-w-0 text-left sm:text-right">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                Modul Selanjutnya
              </span>
              <span className="text-xs font-bold text-slate-900 truncate block group-hover:text-[#0284C7] transition-colors">
                Materi #{nextArticleId.replace('art-', '')}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-sky-50 group-hover:text-[#0284C7] transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        )}
      </div>

    </div>
  );
}
