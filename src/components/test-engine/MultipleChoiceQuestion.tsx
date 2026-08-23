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
    <div className="space-y-2.5 pt-1">
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
            className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
              isSelected
                ? 'bg-indigo-50/90 border-[#4F46E5] text-slate-900 shadow-2xs font-semibold ring-1 ring-[#4F46E5]'
                : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-normal'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
              <span
                className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-[#4F46E5] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {optionLabel}
              </span>
              <span className="text-xs sm:text-sm leading-relaxed font-medium break-words">
                {option}
              </span>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                isSelected
                  ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-2xs'
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
