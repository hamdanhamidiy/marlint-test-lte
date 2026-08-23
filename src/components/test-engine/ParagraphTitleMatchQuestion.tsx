'use client';

import React from 'react';
import { Question } from '@/lib/supabase/types';
import { ChevronDown } from 'lucide-react';

interface ParagraphTitleMatchQuestionProps {
  question: Question;
  selectedAnswers?: Record<string, string>;
  onAnswer: (answers: Record<string, string>) => void;
}

export default function ParagraphTitleMatchQuestion({
  question,
  selectedAnswers = {},
  onAnswer,
}: ParagraphTitleMatchQuestionProps) {
  const articleTitle = question.question_data?.article_title || question.question_text || 'READING PASSAGE';
  const paragraphs = question.question_data?.paragraphs || [];
  const titles = question.question_data?.titles || [];

  const handleSelectTitle = (paragraphId: string, title: string) => {
    const next = { ...selectedAnswers, [paragraphId]: title };
    onAnswer(next);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Passage Title */}
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold tracking-widest text-slate-800 uppercase font-heading">
          {articleTitle.replace(/\.?$/, '.')}
        </h3>
      </div>

      {/* Paragraphs with dropdown selector directly above each paragraph */}
      <div className="space-y-6 text-left">
        {paragraphs.map((p: any, idx: number) => {
          const currentTitle = selectedAnswers[p.id] || '';

          return (
            <div key={p.id || idx} className="space-y-2.5">
              {/* Dropdown Title Pill (Authentic Marlins Style) */}
              <div className="relative inline-block w-full sm:w-auto min-w-[260px] max-w-full">
                <select
                  value={currentTitle}
                  onChange={(e) => handleSelectTitle(p.id, e.target.value)}
                  className={`w-full appearance-none px-4 py-2 pr-9 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer outline-none shadow-2xs ${
                    currentTitle
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs'
                      : 'bg-teal-50/50 border-teal-300 text-teal-800 hover:border-teal-500'
                  }`}
                >
                  <option value="" className="bg-white text-slate-400">
                    select answer
                  </option>
                  {titles.map((title: string, tIdx: number) => (
                    <option key={tIdx} value={title} className="bg-white text-slate-800 py-1 font-medium">
                      {title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-teal-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Paragraph Content */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {p.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
