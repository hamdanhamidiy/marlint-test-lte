'use client';

import React, { useState } from 'react';
import { Question } from '@/lib/supabase/types';
import { Tag, X } from 'lucide-react';

interface DragDropLabelQuestionProps {
  question: Question;
  selectedAnswers?: Record<string, string>;
  onAnswer: (answers: Record<string, string>) => void;
}

export default function DragDropLabelQuestion({
  question,
  selectedAnswers = {},
  onAnswer,
}: DragDropLabelQuestionProps) {
  const labels = question.question_data?.labels || question.options || [];
  const dropZones = question.question_data?.drop_zones || [];
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const usedLabels = new Set(Object.values(selectedAnswers));

  const handleZoneClick = (zoneId: string) => {
    if (selectedLabel) {
      const next = { ...selectedAnswers, [zoneId]: selectedLabel };
      onAnswer(next);
      setSelectedLabel(null);
    } else if (selectedAnswers[zoneId]) {
      const next = { ...selectedAnswers };
      delete next[zoneId];
      onAnswer(next);
    }
  };

  const handleClearZone = (zoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = { ...selectedAnswers };
    delete next[zoneId];
    onAnswer(next);
  };

  return (
    <div className="space-y-6">
      {/* Optional Diagram / Image */}
      {question.image_url && (
        <div className="flex justify-center p-4 rounded-[24px] bg-slate-50 border border-slate-100 shadow-2xs">
          <img
            src={question.image_url}
            alt="Maritime Diagram"
            className="max-h-72 object-contain rounded-xl"
          />
        </div>
      )}

      {/* Available Labels Pool */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#5046E5] uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#5046E5]" />
            <span>Label yang Tersedia:</span>
          </h4>
          <span className="text-xs text-slate-400 font-medium">
            {selectedLabel ? `Dipilih: "${selectedLabel}" (Klik target di bawah)` : 'Klik label lalu klik target'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 p-4 rounded-[24px] bg-[#F8FAFC] border border-slate-100">
          {labels.map((label: string, idx: number) => {
            const isUsed = usedLabels.has(label);
            const isSelected = selectedLabel === label;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedLabel(isSelected ? null : label)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer ${
                  isSelected
                    ? 'bg-[#5046E5] text-white ring-2 ring-indigo-300 shadow-md shadow-indigo-500/25 scale-105'
                    : isUsed
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 line-through opacity-70'
                    : 'bg-white text-slate-800 border border-slate-200/80 hover:border-indigo-300 hover:text-[#5046E5]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drop Zones / Target List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Area Target / Deskripsi Bagian:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dropZones.map((zone: any) => {
            const currentLabel = selectedAnswers[zone.id];

            return (
              <div
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  currentLabel
                    ? 'bg-[#EEF0FF] border-[#5046E5] text-slate-900 shadow-2xs'
                    : 'bg-white border-dashed border-slate-300 hover:border-indigo-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Target #{zone.id}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    {zone.label || zone.description || zone.hint || `Area ${zone.id}`}
                  </p>
                </div>

                <div className="shrink-0">
                  {currentLabel ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-[#5046E5] text-xs font-extrabold shadow-2xs">
                      <span>{currentLabel}</span>
                      <button
                        type="button"
                        onClick={(e) => handleClearZone(zone.id, e)}
                        className="hover:text-rose-500 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      + Tempel di sini
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
