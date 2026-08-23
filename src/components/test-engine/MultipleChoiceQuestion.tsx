'use client';

import React from 'react';
import { Question } from '@/lib/supabase/types';
import { Check } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
}

export default function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onAnswer,
}: MultipleChoiceQuestionProps) {
  const options = question.options || [];

  return (
    <div className="space-y-3 pt-2">
      {options.map((option, idx) => {
        const optionLabel = String.fromCharCode(65 + idx);
        const isSelected =
          selectedAnswer !== undefined &&
          (selectedAnswer === option ||
            selectedAnswer.toLowerCase() === option.toLowerCase() ||
            selectedAnswer === String(idx));

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onAnswer(option)}
            className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-sky-50/90 border-[#0284C7] text-slate-950 shadow-xs font-bold ring-1 ring-[#0284C7]'
                : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-normal hover:shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
              <span
                className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center transition-colors shrink-0 shadow-2xs ${
                  isSelected
                    ? 'bg-[#0284C7] text-white shadow-sky-500/20'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {optionLabel}
              </span>
              <span className="text-xs sm:text-sm leading-relaxed font-semibold break-words">
                {option}
              </span>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                isSelected
                  ? 'bg-[#0284C7] border-[#0284C7] text-white shadow-xs'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
