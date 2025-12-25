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
    <div className="w-full rounded-2xl border border-[#424242] bg-[#2C2C2C] p-4">
      <div className="flex flex-col gap-2.5 max-w-full mx-auto">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 justify-center items-center">
            {row.keys.map((key, keyIndex) => {
              const width = key.width || 1;
              const isHighlighted = isKeyHighlighted(key.code);
              const suggestion = findSuggestionForKey(key.code);
              
              return (
                <div
                  key={keyIndex}
                  className={`
                    flex flex-col items-center justify-center
                    h-14 px-3 py-1.5 rounded-xl
                    border
                    text-sm font-medium
                    transition-all duration-200
                    ${isHighlighted 
                      ? 'bg-[#BB86FC] text-[#000000] border-[#BB86FC] scale-105 shadow-lg shadow-[#BB86FC]/50' 
                      : suggestion 
                        ? 'bg-[#FF9800]/20 text-[#FFB74D] border-[#FF9800]/50' 
                        : 'bg-[#363636] text-[#E0E0E0] border-[#424242] hover:bg-[#404040]'
                    }
                    min-w-[44px]
                  `}
                  style={{ flex: width }}
                >
                  <div className={`text-[9px] uppercase tracking-wide mb-0.5 ${
                    isHighlighted ? 'text-[#000000]/70' : suggestion ? 'text-[#FFB74D]/70' : 'text-[#9E9E9E]'
                  }`}>
                    {getKeyDisplayName(key.code)}
                  </div>
                  <div className="text-base leading-tight">
                    {getKeyLabel(key, suggestion?.shift)}
                  </div>
                  {key.shift && (
                    <div
                      className={`text-[10px] leading-tight mt-0.5 ${
                        suggestion?.shift
                          ? 'text-[#FFB74D] font-medium'
                          : 'text-[#616161]'
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
