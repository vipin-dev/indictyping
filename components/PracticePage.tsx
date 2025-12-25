'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import TypingPracticeArea from './TypingPracticeArea';
import AdBanner from './AdBanner';
import { malayalamSamples } from '@/samples';
import { malayalamInScriptLayout } from '@/layouts/malayalam_inscript';
import { getGraphemes } from '@/utils/graphemes';
import { initAnalytics } from '@/utils/firebase';
import {
  trackTypingStart,
  trackTypingComplete,
  trackTypingReset,
  trackNewText,
  trackFocusInput,
  trackButtonClick,
  trackLinkClick,
  trackLanguageChange,
  trackSelectChange,
} from '@/utils/analytics';

export default function PracticePage() {
  const [language, setLanguage] = useState('malayalam');
  const [targetText, setTargetText] = useState(malayalamSamples[0]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
  const targetGraphemes = useMemo(() => getGraphemes(targetText), [targetText]);
  const userGraphemes = useMemo(() => getGraphemes(userInput), [userInput]);
  const glyphToKey = useMemo(() => {
    const map: Record<string, { code: string; shift?: boolean }> = {};
    malayalamInScriptLayout.forEach((row) => {
      row.keys.forEach((key) => {
        if (key.primary) {
          map[key.primary] = { code: key.code, shift: false };
        }
        if (key.shift) {
          map[key.shift] = { code: key.code, shift: true };
        }
      });
    });
    return map;
  }, []);

  // Calculate WPM (Words Per Minute)
  // Standard: 5 characters = 1 word
  const calculateWPM = useCallback((): number => {
    if (!startTime || userGraphemes.length === 0) return 0;
    const minutes = timeElapsed / 60;
    if (minutes === 0) return 0;
    const words = userGraphemes.length / 5;
    return words / minutes;
  }, [startTime, userGraphemes.length, timeElapsed]);

  // Calculate accuracy percentage
  const calculateAccuracy = useCallback((): number => {
    if (userGraphemes.length === 0) return 100;
    let correct = 0;
    const comparisons = Math.min(userGraphemes.length, targetGraphemes.length);
    for (let i = 0; i < comparisons; i++) {
      if (userGraphemes[i] === targetGraphemes[i]) {
        correct++;
      }
    }
    return (correct / userGraphemes.length) * 100;
  }, [userGraphemes, targetGraphemes]);

  // Timer effect
  useEffect(() => {
    if (!isTyping || !startTime) return;

    const interval = setInterval(() => {
      setTimeElapsed((Date.now() - startTime) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [isTyping, startTime]);

  useEffect(() => {
    const el = hiddenInputRef.current;
    if (!el) return;
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    el.addEventListener('focus', handleFocus);
    el.addEventListener('blur', handleBlur);
    return () => {
      el.removeEventListener('focus', handleFocus);
      el.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    // Initialize Firebase analytics on client
    initAnalytics();
  }, []);

  // Handle input change
  const handleInputChange = (value: string) => {
    setUserInput(value);
    const nextGraphemes = getGraphemes(value);
    
    // Start timer on first keypress
    if (!isTyping && nextGraphemes.length > 0) {
      setIsTyping(true);
      const now = Date.now();
      setStartTime(now);
      setTimeElapsed(0);
      // Track typing start
      trackTypingStart(language, targetGraphemes.length, false);
    }

    // Detect completion
    if (nextGraphemes.length === targetGraphemes.length) {
      const finalTime = startTime ? (Date.now() - startTime) / 1000 : timeElapsed;
      setTimeElapsed(finalTime);
      setIsTyping(false);
      setIsComplete(true);
      // Track typing completion
      const wpm = calculateWPM();
      const accuracy = calculateAccuracy();
      trackTypingComplete(
        language,
        wpm,
        accuracy,
        finalTime,
        targetGraphemes.length,
        false
      );
    } else {
      setIsComplete(false);
    }
  };

  // Handle keydown for keyboard highlighting
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const code = event.code;
    setHighlightedKey(code);
    
    // Clear highlight after 100ms
    setTimeout(() => {
      setHighlightedKey(null);
    }, 100);
  }, []);

  // Reset function
  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setTimeElapsed(0);
    setIsTyping(false);
    setHighlightedKey(null);
    setIsComplete(false);
    // Track reset
    trackTypingReset(language, 'user_action', false);
  };

  // Load new text
  const handleNewText = () => {
    const currentIndex = malayalamSamples.indexOf(targetText);
    const nextIndex = (currentIndex + 1) % malayalamSamples.length;
    const newText = malayalamSamples[nextIndex];
    setTargetText(newText);
    handleReset();
    // Track new text loaded
    trackNewText(language, getGraphemes(newText).length, false);
    trackButtonClick('new_text', 'practice_page');
  };

  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
    trackFocusInput('practice_page', 'click');
    trackButtonClick('focus_input', 'practice_page');
  };
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();
  const suggestedKeys = useMemo(() => {
    if (targetGraphemes.length === 0) return null;

    // Check if the last typed grapheme is a partial match of the target grapheme
    const lastIndex = userGraphemes.length - 1;
    if (lastIndex >= 0) {
      const userPrev = userGraphemes[lastIndex];
      const targetPrev = targetGraphemes[lastIndex];
      if (targetPrev && userPrev && targetPrev.startsWith(userPrev) && userPrev !== targetPrev) {
        const pending = targetPrev.slice(userPrev.length);
        const nextGlyph = Array.from(pending)[0];
        const mappedPending = nextGlyph ? glyphToKey[nextGlyph] : null;
        if (mappedPending) {
          const extras =
            mappedPending.shift && mappedPending.code !== 'ShiftLeft' && mappedPending.code !== 'ShiftRight'
              ? [
                  mappedPending,
                  { code: 'ShiftLeft', shift: true },
                  { code: 'ShiftRight', shift: true },
                ]
              : [mappedPending];
          return extras;
        }
      }
    }

    // Otherwise suggest the next grapheme
    const nextGrapheme = targetGraphemes[userGraphemes.length];
    if (!nextGrapheme) return null;
    const firstGlyph = Array.from(nextGrapheme)[0];
    const mapped = firstGlyph ? glyphToKey[firstGlyph] : null;
    if (!mapped) return null;
    if (mapped.shift && mapped.code !== 'ShiftLeft' && mapped.code !== 'ShiftRight') {
      return [
        mapped,
        { code: 'ShiftLeft', shift: true },
        { code: 'ShiftRight', shift: true },
      ];
    }
    return [mapped];
  }, [glyphToKey, targetGraphemes, userGraphemes]);

  return (
    <div className="h-full flex flex-col bg-[#121212] text-[#FFFFFF] overflow-hidden">
      {/* Top bar - Full width */}
      <div className="flex-shrink-0 w-full border-b border-[#424242] bg-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-medium text-[#FFFFFF] tracking-tight">IndicTyping</h1>
              <Link 
                href="/tutorial" 
                className="text-sm text-[#BB86FC] hover:text-[#E1BEE7] transition-colors font-medium"
                onClick={() => trackLinkClick('Tutorial', '/tutorial', 'practice_page_header')}
              >
                Tutorial
              </Link>
              <Link 
                href="/about" 
                className="text-sm text-[#BB86FC] hover:text-[#E1BEE7] transition-colors font-medium"
                onClick={() => trackLinkClick('About', '/about', 'practice_page_header')}
              >
                About
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[#E0E0E0]">
                Language
                <select
                  value={language}
                  onChange={(e) => {
                    const newLanguage = e.target.value;
                    trackLanguageChange(language, newLanguage);
                    trackSelectChange('language', newLanguage, 'practice_page_header');
                    setLanguage(newLanguage);
                    handleReset();
                  }}
                  className="ml-2 rounded-xl border border-[#424242] bg-[#2C2C2C] px-4 py-2 text-[#FFFFFF] text-sm focus:border-[#BB86FC] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]/20 transition-all"
                >
                  <option value="malayalam" className="bg-[#2C2C2C]">Malayalam</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Content area - Flex to fill remaining space */}
      <div className="flex-1 min-h-0 w-full px-6 py-5 overflow-hidden">
        <div className="h-full flex flex-col min-h-0 overflow-hidden max-w-7xl mx-auto">
          <div className="flex-shrink-0 flex items-center justify-between mb-4 gap-4 flex-wrap">
            {/* Stats inline */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#9E9E9E] font-medium">WPM</span>
                  <div className="text-2xl font-medium text-[#BB86FC]">{Math.round(wpm)}</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#9E9E9E] font-medium">Accuracy</span>
                  <div className="text-2xl font-medium text-[#03DAC6]">{Math.round(accuracy)}%</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#9E9E9E] font-medium">Time</span>
                  <div className="text-xl font-medium text-[#E0E0E0]">
                    {Math.floor(timeElapsed / 60)}:{(Math.floor(timeElapsed % 60)).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleReset();
                  trackButtonClick('reset', 'practice_page', { wpm: Math.round(wpm), accuracy: Math.round(accuracy) });
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#BB86FC] px-4 py-2 text-sm font-medium text-[#000000] hover:bg-[#E1BEE7] transition-all shadow-lg shadow-[#BB86FC]/30"
              >
                Reset
              </button>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={focusHiddenInput}
                className="rounded-full border border-[#424242] bg-[#2C2C2C] px-4 py-2 text-[#E0E0E0] text-sm font-medium hover:bg-[#363636] hover:border-[#BB86FC]/50 transition-all"
              >
                Click to focus
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[#9E9E9E] text-xs">or press Tab then Enter</span>
                <button
                  onClick={handleNewText}
                  className="inline-flex items-center gap-2 rounded-full bg-[#BB86FC] px-4 py-2 text-sm font-medium text-[#000000] hover:bg-[#E1BEE7] transition-all shadow-lg shadow-[#BB86FC]/30"
                >
                  New Text
                </button>
              </div>
            </div>
          </div>

          {/* Completion message */}
          {isComplete && (
            <div className="flex-shrink-0 mb-4 rounded-3xl border border-[#4CAF50]/30 bg-[#1B5E20]/20 backdrop-blur-sm p-5 shadow-lg text-sm">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="font-medium mb-1 text-[#4CAF50] text-base">Completed!</p>
                  <p className="text-[#81C784]">WPM: {Math.round(wpm)} · Accuracy: {Math.round(accuracy)}% · Time: {Math.floor(timeElapsed)}s</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleReset();
                      trackButtonClick('retry_completed', 'practice_page_completion', { wpm: Math.round(wpm), accuracy: Math.round(accuracy) });
                    }}
                    className="rounded-full bg-[#4CAF50] px-4 py-2 text-white text-sm font-medium hover:bg-[#66BB6A] transition-all shadow-lg shadow-[#4CAF50]/30"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => {
                      handleNewText();
                      trackButtonClick('next_text_completed', 'practice_page_completion', { wpm: Math.round(wpm), accuracy: Math.round(accuracy) });
                    }}
                    className="rounded-full border border-[#4CAF50]/50 bg-transparent px-4 py-2 text-[#4CAF50] text-sm font-medium hover:bg-[#4CAF50]/10 transition-all"
                  >
                    Next text
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto">
            <TypingPracticeArea
              targetText={targetText}
              userInput={userInput}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              layout={malayalamInScriptLayout}
              highlightedKey={highlightedKey}
              suggestedKeys={suggestedKeys}
              wpm={wpm}
              accuracy={accuracy}
              timeElapsed={timeElapsed}
              onReset={handleReset}
              isFocused={isFocused}
              onFocusClick={focusHiddenInput}
              inputRef={hiddenInputRef}
              showKeyboard={true}
              showStats={false}
              showInput={true}
            />
          </div>

          {/* Ad Banner at bottom */}
          <div className="flex-shrink-0 mt-4">
            <AdBanner
              adClient={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
              adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
