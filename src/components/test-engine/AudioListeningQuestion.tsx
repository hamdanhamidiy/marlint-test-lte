'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio, Volume2, RotateCcw } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface AudioListeningQuestionProps {
  audioUrl?: string;
  pronunciationText?: string;
  maxPlays?: number;
}

export default function AudioListeningQuestion({
  audioUrl,
  pronunciationText,
  maxPlays = 3,
}: AudioListeningQuestionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setPlayCount(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [audioUrl, pronunciationText]);

  const speakText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (playCount >= maxPlays) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(pronunciationText || 'Please listen carefully.');
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // clear, natural pace

    setIsPlaying(true);

    utterance.onend = () => {
      setIsPlaying(false);
      setPlayCount((prev) => prev + 1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (audioUrl) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (playCount >= maxPlays) return;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.error('Audio play error:', e));
      }
    } else if (pronunciationText) {
      if (isPlaying) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
      } else {
        speakText();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setPlayCount((prev) => prev + 1);
  };

  const remainingPlays = Math.max(0, maxPlays - playCount);

  return (
    <div className="bg-teal-50/70 p-4 sm:p-5 rounded-2xl border border-teal-200 shadow-2xs space-y-3 max-w-xl mx-auto">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Play Button & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={togglePlay}
            disabled={remainingPlays <= 0 && !isPlaying}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 ${
              isPlaying
                ? 'bg-amber-500 text-white animate-pulse'
                : remainingPlays > 0
                ? 'bg-[#00897B] text-white hover:bg-[#00796B]'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
            title="Putar Rekaman Audio"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Volume2 className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                <Radio className="w-3 h-3" />
                <span>Audio Prompt</span>
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800">
              {isPlaying ? 'Sedang memutar audio...' : 'Klik untuk mendengarkan audio'}
            </p>
            <p className="text-[11px] text-slate-500 font-normal">
              Dengarkan percakapan dan instruksi dengan seksama.
            </p>
          </div>
        </div>

        {/* Plays Count Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-teal-800 px-3 py-1 rounded-full bg-teal-100/90 border border-teal-200">
            Sisa putar: {remainingPlays}x / {maxPlays}x
          </span>
        </div>
      </div>
    </div>
  );
}
