/**
 * Language-agnostic level system for typing tutorials
 * Levels can be reused across different languages
 */

import { malayalamInScriptLayout } from '@/layouts/malayalam_inscript';

export enum LevelType {
  BASIC_KEYS = 'basic_keys',      // Learning individual keys
  WORDS = 'words',                 // Typing words
  SENTENCES = 'sentences',         // Typing sentences
  PARAGRAPHS = 'paragraphs',      // Typing paragraphs
  SPEED = 'speed',                 // Speed practice
  ACCURACY = 'accuracy',           // Accuracy practice
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface Level {
  id: string;
  title: string;
  description: string;
  type: LevelType;
  difficulty: Difficulty;
  order: number; // Order within the same difficulty
  targetText: string; // Language-specific text
  minAccuracy?: number; // Minimum accuracy to pass (0-100)
  minWPM?: number; // Minimum WPM to pass
  hints?: string[]; // Optional hints for the level
}

export interface LevelSet {
  language: string;
  difficulty: Difficulty;
  levels: Level[];
}

/**
 * Malayalam tutorial levels
 */
export const malayalamLevels: LevelSet[] = [
  {
    language: 'malayalam',
    difficulty: Difficulty.BEGINNER,
    levels: [
      {
        id: 'mal-basic-1',
        title: 'Basic Vowels - അ, ആ, ഇ',
        description: 'Learn to type the first three Malayalam vowels',
        type: LevelType.BASIC_KEYS,
        difficulty: Difficulty.BEGINNER,
        order: 1,
        targetText: 'അ ആ ഇ',
        minAccuracy: 80,
        hints: ['Use the first row of keys', 'Practice each vowel slowly'],
      },
      {
        id: 'mal-basic-2',
        title: 'More Vowels - ഈ, ഉ, ഊ',
        description: 'Continue learning Malayalam vowels',
        type: LevelType.BASIC_KEYS,
        difficulty: Difficulty.BEGINNER,
        order: 2,
        targetText: 'ഈ ഉ ഊ',
        minAccuracy: 80,
        hints: ['These are in the second row', 'Take your time'],
      },
      {
        id: 'mal-words-1',
        title: 'Simple Words',
        description: 'Practice typing simple Malayalam words',
        type: LevelType.WORDS,
        difficulty: Difficulty.BEGINNER,
        order: 3,
        targetText: 'മല കല പല',
        minAccuracy: 75,
        minWPM: 5,
        hints: ['Focus on accuracy first', 'Speed will come with practice'],
      },
      {
        id: 'mal-words-2',
        title: 'Common Words',
        description: 'Type commonly used Malayalam words',
        type: LevelType.WORDS,
        difficulty: Difficulty.BEGINNER,
        order: 4,
        targetText: 'നമസ്കാരം സ്വാഗതം ധന്യവാദം',
        minAccuracy: 70,
        minWPM: 8,
      },
    ],
  },
  {
    language: 'malayalam',
    difficulty: Difficulty.INTERMEDIATE,
    levels: [
      {
        id: 'mal-sentences-1',
        title: 'Simple Sentences',
        description: 'Practice typing complete sentences',
        type: LevelType.SENTENCES,
        difficulty: Difficulty.INTERMEDIATE,
        order: 1,
        targetText: 'മലയാളം ഒരു മനോഹരമായ ഭാഷയാണ്.',
        minAccuracy: 70,
        minWPM: 15,
        hints: ['Pay attention to spaces', 'Keep a steady rhythm'],
      },
      {
        id: 'mal-sentences-2',
        title: 'Longer Sentences',
        description: 'Type longer, more complex sentences',
        type: LevelType.SENTENCES,
        difficulty: Difficulty.INTERMEDIATE,
        order: 2,
        targetText: 'കേരളം ഇന്ത്യയുടെ തെക്കുപടിഞ്ഞാറൻ ഭാഗത്ത് സ്ഥിതി ചെയ്യുന്നു.',
        minAccuracy: 65,
        minWPM: 20,
      },
      {
        id: 'mal-paragraphs-1',
        title: 'Short Paragraphs',
        description: 'Practice typing short paragraphs',
        type: LevelType.PARAGRAPHS,
        difficulty: Difficulty.INTERMEDIATE,
        order: 3,
        targetText: 'മലയാളം ഭാഷയുടെ സൗന്ദര്യം അതിന്റെ സമ്പന്നമായ സാഹിത്യത്തിലും സംസ്കാരത്തിലും പ്രതിഫലിക്കുന്നു.',
        minAccuracy: 60,
        minWPM: 25,
      },
    ],
  },
  {
    language: 'malayalam',
    difficulty: Difficulty.ADVANCED,
    levels: [
      {
        id: 'mal-speed-1',
        title: 'Speed Challenge',
        description: 'Test your typing speed',
        type: LevelType.SPEED,
        difficulty: Difficulty.ADVANCED,
        order: 1,
        targetText: 'സാങ്കേതിക വിദ്യയുടെ വികാസം ആധുനിക ജീവിതത്തെ വളരെയധികം സ്വാധീനിച്ചിട്ടുണ്ട്.',
        minWPM: 30,
        minAccuracy: 85,
      },
      {
        id: 'mal-accuracy-1',
        title: 'Accuracy Master',
        description: 'Focus on perfect accuracy',
        type: LevelType.ACCURACY,
        difficulty: Difficulty.ADVANCED,
        order: 2,
        targetText: 'വായനയുടെ പ്രാധാന്യം ഒരിക്കലും കുറയരുത്. ഒരു നല്ല പുസ്തകം നമ്മുടെ മനസ്സിനെ വികസിപ്പിക്കുകയും പുതിയ ആശയങ്ങൾ നൽകുകയും ചെയ്യുന്നു.',
        minAccuracy: 95,
        minWPM: 20,
      },
    ],
  },
];

/**
 * Language configuration interface for extensibility
 */
export interface LanguageLevelConfig {
  language: string;
  layout: any; // Keyboard layout
  getLevels: () => LevelSet[]; // Function that returns levels for this language
}

/**
 * Registry of language configurations
 * Add new languages here by implementing their level sets
 */
const languageRegistry: Record<string, LanguageLevelConfig> = {
  malayalam: {
    language: 'malayalam',
    layout: malayalamInScriptLayout,
    getLevels: () => malayalamLevels,
  },
  // Add more languages here:
  // hindi: {
  //   language: 'hindi',
  //   layout: hindiInScriptLayout,
  //   getLevels: () => hindiLevels,
  // },
};

/**
 * Get all levels for a specific language
 * This function is language-agnostic and can work with any registered language
 */
export function getLevelsForLanguage(language: string): LevelSet[] {
  const config = languageRegistry[language];
  if (config) {
    return config.getLevels();
  }
  return [];
}

/**
 * Get keyboard layout for a language
 */
export function getLayoutForLanguage(language: string): any {
  const config = languageRegistry[language];
  return config?.layout || null;
}

/**
 * Register a new language configuration
 */
export function registerLanguage(config: LanguageLevelConfig): void {
  languageRegistry[config.language] = config;
}

/**
 * Get all registered languages
 */
export function getRegisteredLanguages(): string[] {
  return Object.keys(languageRegistry);
}

/**
 * Get all levels flattened (for easier navigation)
 */
export function getAllLevels(language: string): Level[] {
  const levelSets = getLevelsForLanguage(language);
  return levelSets.flatMap(set => set.levels);
}

/**
 * Get a specific level by ID
 */
export function getLevelById(language: string, levelId: string): Level | null {
  const allLevels = getAllLevels(language);
  return allLevels.find(level => level.id === levelId) || null;
}

/**
 * Get next level
 */
export function getNextLevel(language: string, currentLevelId: string): Level | null {
  const allLevels = getAllLevels(language);
  const currentIndex = allLevels.findIndex(level => level.id === currentLevelId);
  if (currentIndex === -1 || currentIndex === allLevels.length - 1) {
    return null;
  }
  return allLevels[currentIndex + 1];
}

/**
 * Get previous level
 */
export function getPreviousLevel(language: string, currentLevelId: string): Level | null {
  const allLevels = getAllLevels(language);
  const currentIndex = allLevels.findIndex(level => level.id === currentLevelId);
  if (currentIndex <= 0) {
    return null;
  }
  return allLevels[currentIndex - 1];
}

