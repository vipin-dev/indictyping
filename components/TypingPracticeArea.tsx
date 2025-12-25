'use client';

import React, { useRef } from 'react';
import TargetTextRenderer from './TargetTextRenderer';
import OnScreenKeyboard from './OnScreenKeyboard';
import StatsBar from './StatsBar';
import TypingInput from './TypingInput';
import { KeyboardRow } from '@/layouts/malayalam_inscript';

export interface TypingPracticeAreaProps {
  // Text props
  targetText: string;
  userInput: string;
  onInputChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  
  // Keyboard props
  layout: KeyboardRow[];
  highlightedKey: string | null;
  suggestedKeys?: { code: string; shift?: boolean }[] | null;
  
  // Stats props
  wpm: number;
  accuracy: number;
  timeElapsed: number; // in seconds
  onReset: () => void;
  
  // UI state
  isFocused?: boolean;
  onFocusClick?: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  
  // Optional customization
  showKeyboard?: boolean;
  showStats?: boolean;
  showInput?: boolean;
  className?: string;
}

/**
 * Reusable component that combines typing input, target text display, on-screen keyboard, and stats
 * Can be used in any page for typing practice
 * 
 * @example
 * // Basic usage with all features
 * <TypingPracticeArea
 *   targetText="Sample text to type"
 *   userInput={userInput}
 *   onInputChange={handleInputChange}
 *   onKeyDown={handleKeyDown}
 *   layout={malayalamInScriptLayout}
 *   highlightedKey={highlightedKey}
 *   suggestedKeys={suggestedKeys}
 *   wpm={wpm}
 *   accuracy={accuracy}
 *   timeElapsed={timeElapsed}
 *   onReset={handleReset}
 *   isFocused={isFocused}
 *   onFocusClick={focusInput}
 *   inputRef={inputRef}
 * />
 * 
 * @example
 * // Usage without keyboard (stats only)
 * <TypingPracticeArea
 *   targetText={targetText}
 *   userInput={userInput}
 *   onInputChange={handleInputChange}
 *   layout={layout}
 *   highlightedKey={null}
 *   wpm={wpm}
 *   accuracy={accuracy}
 *   timeElapsed={timeElapsed}
 *   onReset={handleReset}
 *   showKeyboard={false}
 *   showStats={true}
 * />
 */
export default function TypingPracticeArea({
  targetText,
  userInput,
  onInputChange,
  onKeyDown,
  layout,
  highlightedKey,
  suggestedKeys,
  wpm,
  accuracy,
  timeElapsed,
  onReset,
  isFocused = false,
  onFocusClick,
  inputRef,
  showKeyboard = true,
  showStats = true,
  showInput = true,
  className = '',
}: TypingPracticeAreaProps) {
  const internalInputRef = useRef<HTMLTextAreaElement>(null);
  const typingInputRef = inputRef ?? internalInputRef;

  const handleFocusClick = () => {
    typingInputRef.current?.focus();
    onFocusClick?.();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Typing Input - Hidden */}
      {showInput && (
        <TypingInput
          value={userInput}
          onChange={onInputChange}
          onKeyDown={onKeyDown || (() => {})}
          targetText={targetText}
          inputRef={typingInputRef}
        />
      )}

      {/* Target Text Section */}
      <div>
        <div
          role="button"
          tabIndex={0}
          onClick={handleFocusClick}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && handleFocusClick) {
              e.preventDefault();
              handleFocusClick();
            }
          }}
          className="cursor-pointer"
        >
          <div
            className={`rounded-3xl transition-all duration-200 ${
              isFocused ? 'ring-2 ring-[#BB86FC] ring-offset-2 ring-offset-[#121212]' : ''
            }`}
          >
            <TargetTextRenderer targetText={targetText} userInput={userInput} />
          </div>
        </div>
      </div>

      {/* Keyboard Section */}
      {showKeyboard && (
        <div className="rounded-3xl border border-[#424242] bg-[#1E1E1E] shadow-lg">
          <div className="px-5 pt-3 pb-2 flex items-center justify-end border-b border-[#424242]">
            <div className="flex items-center gap-3 text-[10px] text-[#9E9E9E]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#BB86FC] shadow-sm shadow-[#BB86FC]/50" />
                <span className="text-[#E0E0E0]">Active</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FF9800] shadow-sm shadow-[#FF9800]/50" />
                <span className="text-[#E0E0E0]">Suggested</span>
              </span>
            </div>
          </div>
          <div className="overflow-x-auto p-5">
            <OnScreenKeyboard
              layout={layout}
              highlightedKey={highlightedKey}
              suggestedKeys={suggestedKeys}
            />
          </div>
        </div>
      )}

      {/* Stats Section */}
      {showStats && (
        <StatsBar
          wpm={wpm}
          accuracy={accuracy}
          timeElapsed={timeElapsed}
          onReset={onReset}
        />
      )}
    </div>
  );
}

