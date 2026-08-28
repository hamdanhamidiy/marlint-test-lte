'use client';

import React from 'react';
import { Question } from '@/lib/supabase/types';
import { Check, Image as ImageIcon } from 'lucide-react';

interface ImageChoiceQuestionProps {
  question: Question;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
}

export default function ImageChoiceQuestion({
  question,
  selectedAnswer,
  onAnswer,
}: ImageChoiceQuestionProps) {
  const options = question.options || [];
  const optionLabels = question.question_data?.option_labels || [];

  return (
    <div className="space-y-4 pt-1">
      {/* Image Grid Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {options.map((opt: string, idx: number) => {
          const optionLabel = String.fromCharCode(65 + idx);
          const customLabel = optionLabels[idx];
          const isSelected =
            selectedAnswer === opt ||
            selectedAnswer === customLabel ||
            selectedAnswer === String(idx);
          const isUrl =
            opt.startsWith('http://') || opt.startsWith('https://') || opt.startsWith('/');

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onAnswer(customLabel || opt)}
              className={`group relative flex flex-col p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-sky-50/90 border-[#0284C7] ring-2 ring-[#0284C7]/25 shadow-xs font-bold'
                  : 'bg-white border-slate-200/90 hover:border-sky-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              {/* Badge label & Checkmark */}
              <div className="flex items-center justify-between mb-2 w-full">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-colors shadow-2xs ${
                    isSelected ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {optionLabel}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] border-[#0284C7] text-white shadow-xs'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Image preview */}
              <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100/90 mb-1.5">
                {isUrl ? (
                  <img
                    src={opt}
                    alt={`Option ${optionLabel}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <ImageIcon className="w-7 h-7 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-600 font-semibold">{opt}</span>
                  </div>
                )}
              </div>

              {customLabel && (
                <p className="text-xs font-bold text-center text-slate-800 truncate w-full mt-1">
                  {customLabel}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

