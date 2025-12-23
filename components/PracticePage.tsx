'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import TargetTextRenderer from './TargetTextRenderer';
import TypingInput from './TypingInput';
import StatsBar from './StatsBar';
import OnScreenKeyboard from './OnScreenKeyboard';
import AdBanner from './AdBanner';
import { malayalamSamples } from '@/samples';
import { malayalamInScriptLayout } from '@/layouts/malayalam_inscript';
import { getGraphemes } from '@/utils/graphemes';
import { initAnalytics } from '@/utils/firebase';

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
    }

    // Detect completion
    if (nextGraphemes.length === targetGraphemes.length) {
      const finalTime = startTime ? (Date.now() - startTime) / 1000 : timeElapsed;
      setTimeElapsed(finalTime);
      setIsTyping(false);
      setIsComplete(true);
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
  };

  // Load new text
  const handleNewText = () => {
    const currentIndex = malayalamSamples.indexOf(targetText);
    const nextIndex = (currentIndex + 1) % malayalamSamples.length;
    setTargetText(malayalamSamples[nextIndex]);
    handleReset();
  };

  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">IndicTyping</h1>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-800">
              Language
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  handleReset();
                }}
                className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none"
              >
                <option value="malayalam">Malayalam</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Target text</h2>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <button
                  onClick={focusHiddenInput}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1 text-slate-900 shadow-sm hover:border-indigo-400 hover:text-indigo-700 transition-colors"
                >
                  Click to focus
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">or press Tab then Enter</span>
                  <button
                    onClick={handleNewText}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md"
                  >
                    New Text
                  </button>
                </div>
              </div>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={focusHiddenInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  focusHiddenInput();
                }
              }}
            >
              <div
                className={`rounded-2xl transition ring-2 ${
                  isFocused ? 'ring-indigo-300' : 'ring-transparent'
                }`}
              >
                <TargetTextRenderer targetText={targetText} userInput={userInput} />
              </div>
            </div>

            {/* Input - Hidden, user types directly on target text */}
            <TypingInput
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              targetText={targetText}
              inputRef={hiddenInputRef}
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md space-y-3">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Keyboard</h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-200 ring-1 ring-indigo-400" />
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-200 ring-1 ring-amber-400" />
                    Suggested
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <OnScreenKeyboard
                  layout={malayalamInScriptLayout}
                  highlightedKey={highlightedKey}
                  suggestedKeys={suggestedKeys}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <StatsBar
              wpm={wpm}
              accuracy={accuracy}
              timeElapsed={timeElapsed}
              onReset={handleReset}
            />
            {isComplete && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm text-sm text-emerald-900">
                <p className="font-semibold mb-1">Completed!</p>
                <p className="text-emerald-800">WPM: {Math.round(wpm)} · Accuracy: {Math.round(accuracy)}% · Time: {Math.floor(timeElapsed)}s</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleReset}
                    className="rounded-md bg-emerald-600 px-3 py-1 text-white text-xs font-semibold shadow-sm"
                  >
                    Retry
                  </button>
                  <button
                    onClick={handleNewText}
                    className="rounded-md border border-emerald-300 px-3 py-1 text-emerald-800 text-xs font-semibold"
                  >
                    Next text
                  </button>
                </div>
              </div>
            )}
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
