'use client';

import React from 'react';
import { Question } from '@/lib/supabase/types';
import { RotateCcw } from 'lucide-react';

interface SentenceReorderQuestionProps {
  question: Question;
  selectedOrder?: string[];
  onAnswer: (orderedWords: string[]) => void;
}

export default function SentenceReorderQuestion({
  question,
  selectedOrder = [],
  onAnswer,
}: SentenceReorderQuestionProps) {
  const allWords = question.question_data?.words || question.options || [];

  const remainingWords = [...allWords];
  selectedOrder.forEach((w) => {
    const idx = remainingWords.indexOf(w);
    if (idx !== -1) {
      remainingWords.splice(idx, 1);
    }
  });

  const handleAddWord = (word: string) => {
    onAnswer([...selectedOrder, word]);
  };

  const handleRemoveWord = (indexToRemove: number) => {
    const nextOrder = selectedOrder.filter((_, idx) => idx !== indexToRemove);
    onAnswer(nextOrder);
  };

  const handleReset = () => {
    onAnswer([]);
  };

  return (
    <div className="space-y-6">
      {/* Constructed Sentence Zone */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm min-h-[120px] flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
            Susunan Kalimat Anda:
          </span>
          {selectedOrder.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 min-h-[50px] items-center">
          {selectedOrder.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-400 italic">
              Klik kata-kata di bawah ini secara berurutan untuk menyusun kalimat yang benar.
            </p>
          ) : (
            selectedOrder.map((word, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRemoveWord(idx)}
                className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-50 text-[#0284C7] border border-sky-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all shadow-2xs cursor-pointer"
              >
                <span>{word}</span>
                <span className="text-[10px] text-sky-400 group-hover:text-rose-500 font-bold">✕</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Word Pool */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Pilihan Kata Tersedia:
        </h4>
        <div className="flex flex-wrap gap-2.5 p-5 rounded-[24px] bg-[#F8FAFC] border border-slate-100">
          {remainingWords.length === 0 ? (
            <p className="text-xs text-emerald-700 font-bold py-1">
              ✓ Semua kata telah digunakan dalam susunan kalimat.
            </p>
          ) : (
            remainingWords.map((word, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddWord(word)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-800 border border-slate-200/80 hover:bg-sky-50 hover:border-sky-300 hover:text-[#0284C7] transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
