'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  RotateCcw,
  Sparkles,
  Zap,
  Ship,
  Sliders,
} from 'lucide-react';

interface AudioListeningQuestionProps {
  audioUrl?: string;
  pronunciationText?: string;
  maxPlays?: number;
  isRadioTransmission?: boolean;
}

export default function AudioListeningQuestion({
  audioUrl,
  pronunciationText,
  maxPlays = 3,
  isRadioTransmission = false,
}: AudioListeningQuestionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(0.9);
  const [voiceAccent, setVoiceAccent] = useState<'gb' | 'us'>('gb');

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setPlayCount(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [audioUrl, pronunciationText]);

  // Audio VHF Marine Radio Beep generator using Web Audio API
  const playVhfRadioBeep = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  };

  const speakText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (playCount >= maxPlays) return;

    playVhfRadioBeep();

    window.speechSynthesis.cancel();
    const textToSpeak = pronunciationText || 'Please listen carefully to the official maritime broadcast.';
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Pick best natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredLang = voiceAccent === 'gb' ? 'en-GB' : 'en-US';
    const selectedVoice =
      voices.find((v) => v.lang.startsWith(preferredLang) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))) ||
      voices.find((v) => v.lang.startsWith(preferredLang)) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = preferredLang;
    utterance.rate = playbackRate;
    utterance.pitch = 0.95;

    setIsPlaying(true);

    utterance.onend = () => {
      setIsPlaying(false);
      setPlayCount((prev) => prev + 1);
      playVhfRadioBeep();
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
        audioRef.current.playbackRate = playbackRate;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => {
            console.warn('HTML5 Audio failed, fallback to Speech Synthesis:', e);
            speakText();
          });
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
    <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 max-w-xl mx-auto transition-all shadow-xs space-y-3 select-none font-sans">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      {/* Main Playback Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            disabled={remainingPlays <= 0 && !isPlaying}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ${
              isPlaying
                ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-500/20'
                : remainingPlays > 0
                ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-slate-900/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title={isPlaying ? 'Jeda Audio' : 'Putar Rekaman Audio'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Volume2 className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <span>{isPlaying ? 'Memutar Audio Maritim...' : 'Audio Soal Listening & SMCP'}</span>
              </span>
              {isPlaying && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-1 bg-[#0284C7] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2.5" />
                  <span className="w-1 bg-[#0284C7] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-4" />
                  <span className="w-1 bg-[#0284C7] rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2" />
                  <span className="w-1 bg-[#0284C7] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3.5" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {remainingPlays > 0
                ? isPlaying
                  ? 'Dengarkan percakapan dan instruksi maritim'
                  : 'Klik tombol putar untuk mendengarkan'
                : 'Batas kuota putar audio telah tercapai'}
            </p>
          </div>
        </div>

        {/* Plays Limit Counter Badge */}
        <div className="shrink-0">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-xl border font-mono ${
              remainingPlays > 0
                ? 'bg-sky-50 text-[#0284C7] border-sky-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {remainingPlays}x sisa putar
          </span>
        </div>
      </div>

      {/* Audio Controls: Speed & Accent Switches */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Kecepatan:</span>
          <button
            type="button"
            onClick={() => setPlaybackRate(0.85)}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
              playbackRate === 0.85
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            0.85x (Lambat)
          </button>
          <button
            type="button"
            onClick={() => setPlaybackRate(0.95)}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
              playbackRate === 0.95
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Standar STCW (0.95x)
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Aksen:</span>
          <button
            type="button"
            onClick={() => setVoiceAccent('gb')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
              voiceAccent === 'gb'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🇬🇧 British (IMO)
          </button>
          <button
            type="button"
            onClick={() => setVoiceAccent('us')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
              voiceAccent === 'us'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🇺🇸 International
          </button>
        </div>
      </div>
    </div>
  );
}
