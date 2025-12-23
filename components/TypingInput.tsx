'use client';

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { malayalamInScriptLayout } from '@/layouts/malayalam_inscript';
import { dropLastGrapheme, getGraphemes, isPrefixMatch } from '@/utils/graphemes';

interface TypingInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  targetText: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
}

/**
 * Text input component for typing practice
 * Hidden input that only accepts correct characters
 * Tracks keydown events for keyboard highlighting
 * Handles IME composition for Indic languages
 */
export default function TypingInput({
  value,
  onChange,
  onKeyDown,
  targetText,
  inputRef,
  disabled,
}: TypingInputProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? internalRef;
  const targetGraphemes = useMemo(() => getGraphemes(targetText), [targetText]);
  const isAscii = useCallback((text: string | undefined) => {
    if (!text) return false;
    return [...text].every((ch) => ch.charCodeAt(0) < 128);
  }, []);
  const keyMap = useMemo(() => {
    const skipCodes = new Set([
      'Backspace',
      'Enter',
      'Tab',
      'ShiftLeft',
      'ShiftRight',
      'CapsLock',
      'Space',
    ]);
    const map: Record<string, { primary: string; shift?: string }> = {};
    malayalamInScriptLayout.forEach((row) => {
      row.keys.forEach((key) => {
        if (skipCodes.has(key.code)) return;
        map[key.code] = { primary: key.primary, shift: key.shift };
      });
    });
    return map;
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown(e);
      console.log('[key]', { key: e.key, code: e.code, shift: e.shiftKey });
      // Handle Backspace - allow it to remove last grapheme
      if (e.code === 'Backspace') {
        e.preventDefault();
        if (value.length > 0) {
          const updatedValue = dropLastGrapheme(value);
          onChange(updatedValue);
          textarea.value = updatedValue;
        }
        return;
      }

      // Prevent navigation keys from moving the caret inside the hidden input
      const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (navKeys.includes(e.key)) {
        e.preventDefault();
        return;
      }

      // Keep focus inside the textarea
      if (e.key === 'Tab') {
        e.preventDefault();
        return;
      }

      // Handle space explicitly
      if (e.code === 'Space') {
        e.preventDefault();
        const nextValue = `${value} `;
        const nextGraphemes = getGraphemes(nextValue);
        if (
          nextGraphemes.length <= targetGraphemes.length &&
          isPrefixMatch(nextValue, targetText)
        ) {
          onChange(nextValue);
          textarea.value = nextValue;
        }
        return;
      }

      // If the next expected target grapheme is ASCII and the user typed ASCII, let it through without mapping
      const currentGraphemeIndex = getGraphemes(value).length;
      const expectedGrapheme = targetGraphemes[currentGraphemeIndex];
      // if (e.key.length === 1 && isAscii(e.key) && isAscii(expectedGrapheme)) {
      //   return;
      // }

      // Map physical key to Malayalam output
      const mapped = keyMap[e.code];
      console.log('mapped', mapped, e.code, keyMap);
      if (mapped && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const output = e.shiftKey && mapped.shift ? mapped.shift : mapped.primary;
        const nextValue = value + output;
        const nextGraphemes = getGraphemes(nextValue);
        const isValid =
          nextGraphemes.length <= targetGraphemes.length &&
          isPrefixMatch(nextValue, targetText);
        console.log('[mapped]', {
          code: e.code,
          shift: e.shiftKey,
          output,
          nextValue,
          isValid,
        });

        if (isValid) {
          onChange(nextValue);
          textarea.value = nextValue;
        }
        return;
      }

    };

    const handleInput = (e: Event) => {
      const input = e.target as HTMLTextAreaElement;
      const newValue = input.value;
      // Only allow input that matches the target text by grapheme cluster
      const newGraphemes = getGraphemes(newValue);
      const isValid =
        newGraphemes.length <= targetGraphemes.length &&
        isPrefixMatch(newValue, targetText);

      if (isValid) {
        onChange(newValue);
      } else {
        // Reset to previous value if invalid
        input.value = value;
      }
    };

    textarea.addEventListener('keydown', handleKeyDown);
    textarea.addEventListener('input', handleInput);
    
    return () => {
      textarea.removeEventListener('keydown', handleKeyDown);
      textarea.removeEventListener('input', handleInput);
    };
  }, [onKeyDown, onChange, value, targetText, targetGraphemes, keyMap]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        // This is handled by the input event listener
      }}
      disabled={disabled}
      className="sr-only"
      aria-label="Hidden typing input"
      autoFocus
      tabIndex={0}
    />
  );
}
