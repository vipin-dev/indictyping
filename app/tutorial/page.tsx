'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getLevelsForLanguage, Difficulty, LevelType, LevelSet } from '@/data/levels';
import { trackTutorialFilter, trackLinkClick, trackButtonClick } from '@/utils/analytics';

export default function TutorialIndexPage() {
  const language = 'malayalam'; // Can be made dynamic in the future
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  
  const levelSets = getLevelsForLanguage(language);
  
  const filteredLevelSets = selectedDifficulty === 'all' 
    ? levelSets 
    : levelSets.filter(set => set.difficulty === selectedDifficulty);

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return 'bg-[#4CAF50]/20 text-[#81C784] border-[#4CAF50]/30';
      case Difficulty.INTERMEDIATE:
        return 'bg-[#FF9800]/20 text-[#FFB74D] border-[#FF9800]/30';
      case Difficulty.ADVANCED:
        return 'bg-[#CF6679]/20 text-[#EF5350] border-[#CF6679]/30';
      default:
        return 'bg-[#424242] text-[#9E9E9E] border-[#424242]';
    }
  };

  const getTypeIcon = (type: LevelType) => {
    switch (type) {
      case LevelType.BASIC_KEYS:
        return '🔤';
      case LevelType.WORDS:
        return '📝';
      case LevelType.SENTENCES:
        return '💬';
      case LevelType.PARAGRAPHS:
        return '📄';
      case LevelType.SPEED:
        return '⚡';
      case LevelType.ACCURACY:
        return '🎯';
      default:
        return '📚';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#121212] text-[#FFFFFF] overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 w-full border-b border-[#424242] bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-xl font-medium text-[#FFFFFF] tracking-tight hover:text-[#BB86FC] transition-colors"
                onClick={() => trackLinkClick('IndicTyping', '/', 'tutorial_index_header')}
              >
                IndicTyping
              </Link>
              <span className="text-sm text-[#BB86FC] font-medium">Tutorial</span>
            </div>
            <Link 
              href="/"
              className="text-sm text-[#9E9E9E] hover:text-[#E0E0E0] transition-colors"
              onClick={() => trackLinkClick('Back to Practice', '/', 'tutorial_index_header')}
            >
              Back to Practice
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 w-full px-6 py-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-[#FFFFFF] mb-3">Typing Tutorial</h1>
            <p className="text-[#9E9E9E] text-base">
              Learn to type {language === 'malayalam' ? 'Malayalam' : language} step by step. 
              Start with basic keys and progress through words, sentences, and paragraphs.
            </p>
          </div>

          {/* Difficulty Filter */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-[#9E9E9E]">Filter by difficulty:</span>
            <button
              onClick={() => {
                setSelectedDifficulty('all');
                trackTutorialFilter('all');
                trackButtonClick('tutorial_filter_all', 'tutorial_index');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedDifficulty === 'all'
                  ? 'bg-[#BB86FC] text-[#000000] shadow-lg shadow-[#BB86FC]/30'
                  : 'bg-[#2C2C2C] text-[#E0E0E0] border border-[#424242] hover:bg-[#363636]'
              }`}
            >
              All
            </button>
            {Object.values(Difficulty).map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => {
                  setSelectedDifficulty(difficulty);
                  trackTutorialFilter(difficulty);
                  trackButtonClick(`tutorial_filter_${difficulty}`, 'tutorial_index');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  selectedDifficulty === difficulty
                    ? `${getDifficultyColor(difficulty)} shadow-lg`
                    : 'bg-[#2C2C2C] text-[#9E9E9E] border-[#424242] hover:bg-[#363636]'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>

          {/* Level Sets */}
          <div className="space-y-8">
            {filteredLevelSets.map((levelSet, setIndex) => (
              <div key={`${levelSet.language}-${levelSet.difficulty}`} className="mb-8">
                {/* Difficulty Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getDifficultyColor(levelSet.difficulty)}`}>
                    {levelSet.difficulty.charAt(0).toUpperCase() + levelSet.difficulty.slice(1)}
                  </div>
                  <span className="text-sm text-[#9E9E9E]">
                    {levelSet.levels.length} {levelSet.levels.length === 1 ? 'level' : 'levels'}
                  </span>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelSet.levels.map((level, levelIndex) => (
                    <Link
                      key={level.id}
                      href={`/tutorial/level?level=${level.id}&lang=${language}`}
                      onClick={() => {
                        trackButtonClick('tutorial_level_card', 'tutorial_index', {
                          level_id: level.id,
                          level_title: level.title,
                          difficulty: level.difficulty,
                          level_type: level.type,
                        });
                      }}
                      className="group block p-5 rounded-3xl border border-[#424242] bg-[#1E1E1E] hover:border-[#BB86FC]/50 hover:bg-[#2C2C2C] transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getTypeIcon(level.type)}</span>
                          <span className="text-xs text-[#9E9E9E] uppercase tracking-wider">
                            {level.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-[#616161] font-medium">
                          #{level.order}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-[#FFFFFF] mb-2 group-hover:text-[#BB86FC] transition-colors">
                        {level.title}
                      </h3>
                      <p className="text-sm text-[#9E9E9E] mb-4 line-clamp-2">
                        {level.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#616161]">
                        {level.minAccuracy && (
                          <span>✓ {level.minAccuracy}% accuracy</span>
                        )}
                        {level.minWPM && (
                          <span>⚡ {level.minWPM} WPM</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredLevelSets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#9E9E9E]">No levels found for the selected difficulty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

