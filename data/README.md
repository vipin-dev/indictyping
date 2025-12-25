# Tutorial Level System Architecture

This tutorial system is designed to be **language-agnostic** and **reusable** across different Indic languages. The architecture allows you to easily add new languages and level types.

## Architecture Overview

### Core Components

1. **Level Types** (`LevelType` enum)
   - `BASIC_KEYS` - Learning individual keys/characters
   - `WORDS` - Typing words
   - `SENTENCES` - Typing sentences
   - `PARAGRAPHS` - Typing paragraphs
   - `SPEED` - Speed practice
   - `ACCURACY` - Accuracy practice

2. **Difficulty Levels** (`Difficulty` enum)
   - `BEGINNER` - Starting levels
   - `INTERMEDIATE` - Mid-level practice
   - `ADVANCED` - Advanced challenges

3. **Level Interface** (`Level`)
   - `id` - Unique identifier (e.g., 'mal-basic-1')
   - `title` - Display title
   - `description` - Level description
   - `type` - Level type from enum
   - `difficulty` - Difficulty level
   - `order` - Order within difficulty
   - `targetText` - Text to type (language-specific)
   - `minAccuracy` - Minimum accuracy to pass (optional)
   - `minWPM` - Minimum WPM to pass (optional)
   - `hints` - Optional hints array

4. **Level Sets** (`LevelSet`)
   - Groups levels by language and difficulty
   - Allows progressive learning paths

## Adding a New Language

To add support for a new language (e.g., Hindi):

### Step 1: Create Language Levels

```typescript
// In data/levels.ts

export const hindiLevels: LevelSet[] = [
  {
    language: 'hindi',
    difficulty: Difficulty.BEGINNER,
    levels: [
      {
        id: 'hin-basic-1',
        title: 'Basic Vowels - अ, आ, इ',
        description: 'Learn to type the first three Hindi vowels',
        type: LevelType.BASIC_KEYS,
        difficulty: Difficulty.BEGINNER,
        order: 1,
        targetText: 'अ आ इ',
        minAccuracy: 80,
        hints: ['Use the first row of keys', 'Practice each vowel slowly'],
      },
      // ... more levels
    ],
  },
  // ... more difficulty sets
];
```

### Step 2: Create Keyboard Layout

Create a layout file in `layouts/` directory (e.g., `hindi_inscript.ts`) following the same structure as `malayalam_inscript.ts`.

### Step 3: Register the Language

```typescript
// In data/levels.ts, update languageRegistry:

import { hindiInScriptLayout } from '@/layouts/hindi_inscript';

const languageRegistry: Record<string, LanguageLevelConfig> = {
  malayalam: {
    language: 'malayalam',
    layout: malayalamInScriptLayout,
    getLevels: () => malayalamLevels,
  },
  hindi: {
    language: 'hindi',
    layout: hindiInScriptLayout,
    getLevels: () => hindiLevels,
  },
};
```

### Step 4: Update Language Selection

Update the language selector in `PracticePage.tsx` and `TutorialPage.tsx` to include the new language.

## Creating Custom Level Types

You can extend the `LevelType` enum to add new types:

```typescript
export enum LevelType {
  // ... existing types
  CUSTOM_TYPE = 'custom_type', // Your new type
}
```

Then create levels with this type and handle them in the UI as needed.

## Level Progression

Levels are automatically ordered by:
1. Difficulty (Beginner → Intermediate → Advanced)
2. Order within difficulty

The system provides helper functions:
- `getNextLevel()` - Get the next level
- `getPreviousLevel()` - Get the previous level
- `getAllLevels()` - Get all levels flattened
- `getLevelsForLanguage()` - Get levels grouped by difficulty

## Reusability Features

1. **Language Registry** - Centralized language configuration
2. **Type System** - Reusable level types across languages
3. **Component Reuse** - `TypingPracticeArea` works with any language
4. **Extensible** - Easy to add new languages and level types

## Example: Adding Tamil

```typescript
// 1. Create tamilLevels array
export const tamilLevels: LevelSet[] = [ /* ... */ ];

// 2. Import layout
import { tamilInScriptLayout } from '@/layouts/tamil_inscript';

// 3. Register
tamil: {
  language: 'tamil',
  layout: tamilInScriptLayout,
  getLevels: () => tamilLevels,
},
```

That's it! The tutorial system will automatically support Tamil.

