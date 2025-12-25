'use client';

import React from 'react';

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  timeElapsed: number; // in seconds
  onReset: () => void;
}

/**
 * Displays typing statistics: WPM, Accuracy, Timer
 */
export default function StatsBar({ wpm, accuracy, timeElapsed, onReset }: StatsBarProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-3xl border border-[#424242] bg-[#1E1E1E] px-6 py-5 shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-[#9E9E9E] font-medium">WPM</span>
            <div className="text-3xl font-medium text-[#BB86FC]">{Math.round(wpm)}</div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-xs uppercase tracking-wider text-[#9E9E9E] font-medium">Accuracy</span>
            <div className="text-3xl font-medium text-[#03DAC6]">{Math.round(accuracy)}%</div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#424242] pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-[#9E9E9E] font-medium">Time</span>
            <div className="text-xl font-medium text-[#E0E0E0]">{formatTime(timeElapsed)}</div>
          </div>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-full bg-[#BB86FC] px-5 py-2.5 text-sm font-medium text-[#000000] hover:bg-[#E1BEE7] transition-all shadow-lg shadow-[#BB86FC]/30"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
