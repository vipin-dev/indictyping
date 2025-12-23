'use client';

import React, { useMemo } from 'react';
import { getGraphemes } from '@/utils/graphemes';

interface TargetTextRendererProps {
  targetText: string;
  userInput: string;
}

/**
 * Renders the target text with visual indicators for correct/incorrect characters
 * Shows character-by-character highlighting with a caret at current position
 */
export default function TargetTextRenderer({ targetText, userInput }: TargetTextRendererProps) {
  const targetGraphemes = useMemo(() => getGraphemes(targetText), [targetText]);
  const userGraphemes = useMemo(() => getGraphemes(userInput), [userInput]);

  const renderText = () => {
    const elements: React.ReactElement[] = [];
    const currentPosition = userGraphemes.length;
    
    for (let i = 0; i < targetGraphemes.length; i++) {
      const targetChar = targetGraphemes[i];
      const userChar = i < userGraphemes.length ? userGraphemes[i] : null;
      const isTyped = userChar !== null;
      const isCorrect = userChar === targetChar;
      const isPartial =
        isTyped &&
        userChar !== null &&
        userChar !== targetChar &&
        targetChar.startsWith(userChar);
      const isCurrentPosition = i === currentPosition;
      
      // Determine styling for this character
      let className = 'inline';
      if (isTyped) {
        if (isCorrect) {
          className += ' bg-green-200 text-green-900';
        } else if (isPartial) {
          className += ' bg-yellow-200 text-yellow-900';
        } else {
          className += ' bg-red-200 text-red-900';
        }
      } else {
        className += ' text-gray-400';
      }
      
      // Handle special characters
      if (targetChar === '\n') {
        elements.push(<br key={`br-${i}`} />);
      } else if (targetChar === ' ') {
        elements.push(
          <span key={i} className={className}>
            {' '}
          </span>
        );
      } else {
        elements.push(
          <span key={i} className={className}>
            {targetChar}
          </span>
        );
      }
      
      // Add caret after current position
      if (isCurrentPosition) {
        elements.push(
          <span key={`caret-${i}`} className="inline w-0.5 h-5 bg-blue-500 animate-pulse ml-0.5 align-middle" />
        );
      }
    }
    
    // If caret is at the end, add it
    if (currentPosition >= targetGraphemes.length) {
      elements.push(
        <span key="caret-end" className="inline w-0.5 h-5 bg-blue-500 animate-pulse ml-0.5 align-middle" />
      );
    }
    
    return elements;
  };

  return (
    <div className="w-full p-5 bg-white border border-slate-200 rounded-2xl min-h-[140px] text-lg leading-relaxed whitespace-pre-wrap break-words shadow-md">
      {renderText()}
    </div>
  );
}
