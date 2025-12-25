'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TypingPracticeArea from './TypingPracticeArea';
import { malayalamInScriptLayout } from '@/layouts/malayalam_inscript';
import { getGraphemes } from '@/utils/graphemes';
import { initAnalytics } from '@/utils/firebase';
import {
  getLevelById,
  getNextLevel,
  getPreviousLevel,
  getAllLevels,
  getLayoutForLanguage,
  Difficulty,
  Level,
} from '@/data/levels';

export default function TutorialPage() {
  const searchParams = useSearchParams();
  const levelId = searchParams.get('level') || 'mal-basic-1';
  const languageParam = searchParams.get('lang') || 'malayalam';
  const language = languageParam; // Can be made dynamic in the future

  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [levelPassed, setLevelPassed] = useState(false);
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);

  // Load level when levelId changes
  useEffect(() => {
    const level = getLevelById(language, levelId);
    setCurrentLevel(level);
    setUserInput('');
    setStartTime(null);
    setTimeElapsed(0);
    setIsTyping(false);
    setHighlightedKey(null);
    setIsComplete(false);
    setLevelPassed(false);
  }, [levelId, language]);

  const targetGraphemes = useMemo(
    () => (currentLevel ? getGraphemes(currentLevel.targetText) : []),
    [currentLevel]
  );
  const userGraphemes = useMemo(() => getGraphemes(userInput), [userInput]);

  const layout = useMemo(() => {
    const langLayout = getLayoutForLanguage(language);
    return langLayout || malayalamInScriptLayout; // Fallback to Malayalam
  }, [language]);

  const glyphToKey = useMemo(() => {
    const map: Record<string, { code: string; shift?: boolean }> = {};
    layout.forEach((row: any) => {
      row.keys.forEach((key: any) => {
        if (key.primary) {
          map[key.primary] = { code: key.code, shift: false };
        }
        if (key.shift) {
          map[key.shift] = { code: key.code, shift: true };
        }
      });
    });
    return map;
  }, [layout]);

  // Calculate WPM
  const calculateWPM = useCallback((): number => {
    if (!startTime || userGraphemes.length === 0) return 0;
    const minutes = timeElapsed / 60;
    if (minutes === 0) return 0;
    const words = userGraphemes.length / 5;
    return words / minutes;
  }, [startTime, userGraphemes.length, timeElapsed]);

  // Calculate accuracy
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

      // Check if level passed
      const wpm = calculateWPM();
      const accuracy = calculateAccuracy();
      const passed =
        (!currentLevel?.minAccuracy || accuracy >= currentLevel.minAccuracy) &&
        (!currentLevel?.minWPM || wpm >= currentLevel.minWPM);
      setLevelPassed(passed);
    } else {
      setIsComplete(false);
    }
  };

  // Handle keydown for keyboard highlighting
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const code = event.code;
    setHighlightedKey(code);
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
    setLevelPassed(false);
  };

  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
  };

  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();

  const suggestedKeys = useMemo(() => {
    if (targetGraphemes.length === 0) return null;

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

  const allLevels = getAllLevels(language);
  const nextLevel = currentLevel ? getNextLevel(language, currentLevel.id) : null;
  const previousLevel = currentLevel ? getPreviousLevel(language, currentLevel.id) : null;

  if (!currentLevel) {
    return (
      <div className="h-full flex items-center justify-center bg-[#121212] text-[#FFFFFF]">
        <div className="text-center">
          <p className="text-xl mb-4">Level not found</p>
          <Link href="/tutorial" className="text-[#BB86FC] hover:text-[#E1BEE7]">
            Go to Tutorial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#121212] text-[#FFFFFF] overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 w-full border-b border-[#424242] bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-medium text-[#FFFFFF] tracking-tight hover:text-[#BB86FC] transition-colors">
                IndicTyping
              </Link>
              <Link href="/tutorial" className="text-sm text-[#BB86FC] hover:text-[#E1BEE7] transition-colors font-medium">
                Tutorial
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#9E9E9E]">
                Level {allLevels.findIndex(l => l.id === currentLevel.id) + 1} of {allLevels.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 w-full px-6 py-5 overflow-hidden">
        <div className="h-full flex flex-col min-h-0 overflow-hidden max-w-7xl mx-auto">
          {/* Level info */}
          <div className="flex-shrink-0 mb-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentLevel.difficulty === Difficulty.BEGINNER
                      ? 'bg-[#4CAF50]/20 text-[#81C784]'
                      : currentLevel.difficulty === Difficulty.INTERMEDIATE
                      ? 'bg-[#FF9800]/20 text-[#FFB74D]'
                      : 'bg-[#CF6679]/20 text-[#EF5350]'
                  }`}>
                    {currentLevel.difficulty}
                  </span>
                  <span className="text-xs text-[#9E9E9E] uppercase tracking-wider">
                    {currentLevel.type.replace('_', ' ')}
                  </span>
                </div>
                <h1 className="text-2xl font-medium text-[#FFFFFF] mb-2">{currentLevel.title}</h1>
                <p className="text-sm text-[#9E9E9E]">{currentLevel.description}</p>
              </div>
              <div className="flex items-center gap-3">
                {previousLevel && (
                  <Link
                    href={`/tutorial/level?level=${previousLevel.id}&lang=${language}`}
                    className="rounded-full border border-[#424242] bg-[#2C2C2C] px-4 py-2 text-[#E0E0E0] text-sm font-medium hover:bg-[#363636] transition-all"
                  >
                    ← Previous
                  </Link>
                )}
                {nextLevel && (
                  <Link
                    href={`/tutorial/level?level=${nextLevel.id}&lang=${language}`}
                    className="rounded-full bg-[#BB86FC] px-4 py-2 text-[#000000] text-sm font-medium hover:bg-[#E1BEE7] transition-all shadow-lg shadow-[#BB86FC]/30"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="flex items-center gap-4 text-xs text-[#9E9E9E]">
              {currentLevel.minAccuracy && (
                <span>Min Accuracy: {currentLevel.minAccuracy}%</span>
              )}
              {currentLevel.minWPM && (
                <span>Min WPM: {currentLevel.minWPM}</span>
              )}
            </div>

            {/* Hints */}
            {currentLevel.hints && currentLevel.hints.length > 0 && (
              <div className="mt-3 p-3 rounded-2xl bg-[#1E1E1E] border border-[#424242]">
                <p className="text-xs font-medium text-[#BB86FC] mb-2">💡 Hints:</p>
                <ul className="list-disc list-inside text-xs text-[#9E9E9E] space-y-1">
                  {currentLevel.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Stats and actions */}
          <div className="flex-shrink-0 flex items-center justify-between mb-4 gap-4 flex-wrap">
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
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-full bg-[#BB86FC] px-4 py-2 text-sm font-medium text-[#000000] hover:bg-[#E1BEE7] transition-all shadow-lg shadow-[#BB86FC]/30"
              >
                Reset
              </button>
            </div>
            <button
              onClick={focusHiddenInput}
              className="rounded-full border border-[#424242] bg-[#2C2C2C] px-4 py-2 text-[#E0E0E0] text-sm font-medium hover:bg-[#363636] hover:border-[#BB86FC]/50 transition-all"
            >
              Click to focus
            </button>
          </div>

          {/* Completion message */}
          {isComplete && (
            <div className={`flex-shrink-0 mb-4 rounded-3xl border p-5 shadow-lg ${
              levelPassed
                ? 'border-[#4CAF50]/30 bg-[#1B5E20]/20'
                : 'border-[#FF9800]/30 bg-[#E65100]/20'
            }`}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className={`font-medium mb-1 text-base ${
                    levelPassed ? 'text-[#4CAF50]' : 'text-[#FF9800]'
                  }`}>
                    {levelPassed ? '🎉 Level Passed!' : '⚠️ Level Not Passed'}
                  </p>
                  <p className={`text-sm ${
                    levelPassed ? 'text-[#81C784]' : 'text-[#FFB74D]'
                  }`}>
                    WPM: {Math.round(wpm)} · Accuracy: {Math.round(accuracy)}%
                    {!levelPassed && currentLevel.minAccuracy && accuracy < currentLevel.minAccuracy && (
                      <span className="block mt-1">Need {currentLevel.minAccuracy}% accuracy</span>
                    )}
                    {!levelPassed && currentLevel.minWPM && wpm < currentLevel.minWPM && (
                      <span className="block mt-1">Need {currentLevel.minWPM} WPM</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      levelPassed
                        ? 'bg-[#4CAF50] text-white hover:bg-[#66BB6A] shadow-lg shadow-[#4CAF50]/30'
                        : 'bg-[#FF9800] text-white hover:bg-[#FFB74D] shadow-lg shadow-[#FF9800]/30'
                    }`}
                  >
                    Retry
                  </button>
                  {levelPassed && nextLevel && (
                    <Link
                      href={`/tutorial/level?level=${nextLevel.id}&lang=${language}`}
                      className="rounded-full border border-[#4CAF50]/50 bg-transparent px-4 py-2 text-[#4CAF50] text-sm font-medium hover:bg-[#4CAF50]/10 transition-all"
                    >
                      Next Level
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Typing practice area */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <TypingPracticeArea
              targetText={currentLevel.targetText}
              userInput={userInput}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              layout={layout}
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
        </div>
      </div>
    </div>
  );
}

