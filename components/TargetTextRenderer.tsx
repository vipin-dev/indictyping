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
      
      // Determine styling for this character (Material Design 3 colors)
      let className = 'inline';
      if (isTyped) {
        if (isCorrect) {
          className += ' bg-[#4CAF50]/30 text-[#81C784]';
        } else if (isPartial) {
          className += ' bg-[#FF9800]/30 text-[#FFB74D]';
        } else {
          className += ' bg-[#CF6679]/30 text-[#EF5350]';
        }
      } else {
        className += ' text-[#616161]';
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
          <span key={`caret-${i}`} className="inline w-0.5 h-5 bg-[#BB86FC] animate-pulse ml-0.5 align-middle rounded-full" />
        );
      }
    }
    
    // If caret is at the end, add it
    if (currentPosition >= targetGraphemes.length) {
      elements.push(
        <span key="caret-end" className="inline w-0.5 h-5 bg-[#BB86FC] animate-pulse ml-0.5 align-middle rounded-full" />
      );
    }
    
    return elements;
  };

  return (
    <div className="w-full p-4 bg-[#1E1E1E] border border-[#424242] rounded-3xl min-h-[100px] max-h-[120px] text-base leading-relaxed whitespace-pre-wrap break-words shadow-lg overflow-y-auto">
      {renderText()}
    </div>
  );
}
