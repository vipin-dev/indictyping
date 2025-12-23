'use client';

import React from 'react';
import { KeyboardRow, KeyLayout, specialKeys } from '@/layouts/malayalam_inscript';

interface OnScreenKeyboardProps {
  layout: KeyboardRow[];
  highlightedKey: string | null; // Physical key code
  suggestedKeys?: { code: string; shift?: boolean }[] | null;
}

/**
 * Renders an on-screen keyboard visualization
 * Highlights keys when they are pressed
 */
export default function OnScreenKeyboard({ layout, highlightedKey, suggestedKeys }: OnScreenKeyboardProps) {
  const getKeyLabel = (key: KeyLayout, isShift: boolean = false): string => {
    if (isShift && key.shift) {
      return key.shift;
    }
    return key.primary;
  };

  const getKeyDisplayName = (code: string): string => {
    // Map special key codes to display names
    if (code.startsWith('Digit')) {
      return code.replace('Digit', '');
    }
    if (code.startsWith('Key')) {
      return code.replace('Key', '');
    }
    return specialKeys[code] || code;
  };

  const isKeyHighlighted = (keyCode: string): boolean => {
    return highlightedKey === keyCode;
  };

  const findSuggestionForKey = (keyCode: string): { code: string; shift?: boolean } | undefined => {
    return suggestedKeys?.find((s) => s.code === keyCode);
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-inner">
      <div className="flex flex-col gap-2 max-w-full mx-auto min-w-[720px]">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.keys.map((key, keyIndex) => {
              const width = key.width || 1;
              const isHighlighted = isKeyHighlighted(key.code);
              const suggestion = findSuggestionForKey(key.code);
              
              return (
                <div
                  key={keyIndex}
                  className={`
                    flex flex-col items-center justify-center
                    h-12 px-2 rounded-lg
                    border border-slate-200
                    text-sm font-semibold
                    transition-all duration-100
                    ${isHighlighted ? 'bg-indigo-100 text-indigo-900 border-indigo-300 scale-105 shadow-md' : suggestion ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-900'}
                    min-w-[40px]
                  `}
                  style={{ flex: width }}
                >
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    {getKeyDisplayName(key.code)}
                  </div>
                  <div className="text-base">
                    {getKeyLabel(key, suggestion?.shift)}
                  </div>
                  {key.shift && (
                    <div
                      className={`text-xs ${
                        suggestion?.shift
                          ? 'text-amber-900 font-semibold'
                          : 'text-slate-400'
                      }`}
                    >
                      {key.shift}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
