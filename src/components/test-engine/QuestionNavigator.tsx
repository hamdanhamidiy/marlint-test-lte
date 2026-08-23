'use client';

import React, { useState } from 'react';
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, any>;
  questionIds: string[];
  flaggedQuestions: Set<number>;
  onSelect: (index: number) => void;
  onToggleFlag: (index: number) => void;
}

export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
  flaggedQuestions,
  onSelect,
  onToggleFlag,
}: QuestionNavigatorProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const answeredCount = questionIds.filter((id) => {
    const ans = answers[id];
    if (ans === undefined || ans === null || ans === '') return false;
    if (typeof ans === 'object' && Object.keys(ans).length === 0) return false;
    return true;
  }).length;

  const percentCompleted = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-3 w-full">
      {/* Header Info with Mobile Toggle */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-50 text-[#5046E5] flex items-center justify-center">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Navigasi Soal
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-[#5046E5] text-[11px] font-bold font-mono">
            {answeredCount}/{totalQuestions} ({percentCompleted}%)
          </span>

          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="lg:hidden p-1 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigator"
          >
            {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#5046E5] rounded-full transition-all duration-300"
          style={{ width: `${percentCompleted}%` }}
        />
      </div>

      {/* Grid of Numbers - Visible always on desktop, collapsible on mobile */}
      <div className={`${mobileExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="p-1 max-h-[300px] overflow-y-auto">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const qId = questionIds[index];
              const hasAnswer =
                answers[qId] !== undefined &&
                answers[qId] !== null &&
                answers[qId] !== '' &&
                (typeof answers[qId] !== 'object' || Object.keys(answers[qId]).length > 0);
              const isCurrent = index === currentIndex;
              const isFlagged = flaggedQuestions.has(index);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onSelect(index);
                    // optionally collapse on mobile selection
                  }}
                  className={`relative aspect-square rounded-lg sm:rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-[#5046E5] text-white shadow-sm ring-2 ring-[#5046E5] ring-offset-1 font-extrabold z-10'
                      : isFlagged
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 font-semibold'
                      : hasAnswer
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-semibold'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <span>{index + 1}</span>
                  {isFlagged && !isCurrent && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Legend */}
        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5046E5]" />
            <span>Aktif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Terjawab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Ragu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
