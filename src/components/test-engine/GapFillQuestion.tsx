'use client';

import React from 'react';
import { Question } from '@/lib/supabase/types';
import { ChevronDown } from 'lucide-react';

interface GapFillQuestionProps {
  question: Question;
  selectedAnswers?: Record<string, string>;
  onAnswer: (answers: Record<string, string>) => void;
}

export default function GapFillQuestion({
  question,
  selectedAnswers = {},
  onAnswer,
}: GapFillQuestionProps) {
  const template = question.question_data?.text_template || question.question_text || '';
  const gaps = question.question_data?.gaps || [];

  const handleGapChange = (gapIndex: number, value: string) => {
    const nextAnswers = { ...selectedAnswers, [String(gapIndex)]: value };
    onAnswer(nextAnswers);
  };

  const parts = template.split(/\{(\d+)\}/g);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-100 shadow-sm leading-loose text-sm sm:text-base text-slate-800">
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            const gapIndex = parseInt(part, 10);
            const gapDef = gaps[gapIndex] || gaps.find((g: any) => g.index === gapIndex);
            const currentVal = selectedAnswers[String(gapIndex)] || '';
            const options = gapDef?.options || [];

            return (
              <span key={index} className="inline-block mx-1.5 my-1 align-middle">
                <span className="relative inline-flex items-center">
                  <select
                    value={currentVal}
                    onChange={(e) => handleGapChange(gapIndex, e.target.value)}
                    className={`appearance-none font-bold px-4 py-2 pr-8 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer outline-none shadow-2xs ${
                      currentVal
                        ? 'bg-[#EEF0FF] border-[#5046E5] text-[#5046E5] shadow-xs ring-2 ring-[#5046E5]/20'
                        : 'bg-slate-50 border-dashed border-slate-300 text-slate-500 hover:border-indigo-400'
                    }`}
                  >
                    <option value="" disabled className="bg-white text-slate-400">
                      [Pilih jawaban...]
                    </option>
                    {options.map((opt: string, optIdx: number) => (
                      <option key={optIdx} value={opt} className="bg-white text-slate-800 py-1 font-medium">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#5046E5] absolute right-2.5 pointer-events-none" />
                </span>
              </span>
            );
          }

          return <span key={index}>{part}</span>;
        })}
      </div>

      <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
        <span className="w-2 h-2 rounded-full bg-[#5046E5]" />
        <span>Pilih kata yang tepat dari menu dropdown pada setiap bagian rumpang di atas.</span>
      </p>
    </div>
  );
}
