'use client';

import React, { useState } from 'react';
import { Question } from '@/lib/supabase/types';
import { Check, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

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
  const transcript = question.question_data?.audio_transcript;
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="space-y-5">
      {transcript && (
        <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5046E5]">Transkrip Percakapan / Audio:</span>
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#5046E5] font-bold transition-colors cursor-pointer"
            >
              {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranscript ? 'Sembunyikan' : 'Lihat Transkrip'}</span>
            </button>
          </div>
          {showTranscript && (
            <p className="mt-2.5 pt-2.5 border-t border-slate-200/60 text-xs sm:text-sm text-slate-700 italic leading-relaxed font-normal">
              "{transcript}"
            </p>
          )}
        </div>
      )}

      {/* Image Grid Options */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {options.map((opt: string, idx: number) => {
          const optionLabel = String.fromCharCode(65 + idx);
          const customLabel = optionLabels[idx];
          const isSelected = selectedAnswer === opt || selectedAnswer === customLabel || selectedAnswer === String(idx);
          const isUrl = opt.startsWith('http://') || opt.startsWith('https://') || opt.startsWith('/');

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onAnswer(customLabel || opt)}
              className={`group relative flex flex-col p-3 rounded-2xl border text-left transition-all duration-150 overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-[#EEF0FF] border-[#5046E5] ring-2 ring-[#5046E5]/20 shadow-sm font-bold scale-[1.02]'
                  : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              {/* Badge label */}
              <div className="flex items-center justify-between mb-2 w-full">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shadow-2xs ${
                    isSelected ? 'bg-[#5046E5] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {optionLabel}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#5046E5] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Image preview */}
              <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100 mb-2">
                {isUrl ? (
                  <img
                    src={opt}
                    alt={`Option ${optionLabel}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-1" />
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
