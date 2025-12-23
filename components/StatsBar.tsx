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
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500">WPM</span>
            <div className="text-3xl font-semibold text-indigo-700">{Math.round(wpm)}</div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-xs uppercase tracking-wider text-slate-500">Accuracy</span>
            <div className="text-3xl font-semibold text-indigo-700">{Math.round(accuracy)}%</div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500">Time</span>
            <div className="text-xl font-semibold text-slate-800">{formatTime(timeElapsed)}</div>
          </div>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
