// Malayalam InScript keyboard layout (visual representation)
// Structured to mirror the standard InScript placement so the on-screen
// keyboard matches what users see with the OS IME.

export interface KeyLayout {
  primary: string; // Primary label (normal state)
  shift?: string; // Shift label (when shift is pressed)
  code: string; // Physical key code (e.g., 'KeyQ', 'Space', 'Backspace')
  width?: number; // Relative width multiplier (default: 1)
}

export interface KeyboardRow {
  keys: KeyLayout[];
}

export const malayalamInScriptLayout: KeyboardRow[] = [
  // Row 1: Numbers and Backspace
  {
    keys: [
      { code: 'Backquote', primary: '`', shift: '~' },
      { code: 'Digit1', primary: '1', shift: '!' },
      { code: 'Digit2', primary: '2', shift: '@' },
      { code: 'Digit3', primary: '3', shift: '#' },
      { code: 'Digit4', primary: '4', shift: '$' },
      { code: 'Digit5', primary: '5', shift: '%' },
      { code: 'Digit6', primary: '6', shift: '^' },
      { code: 'Digit7', primary: '7', shift: '&' },
      { code: 'Digit8', primary: '8', shift: '*' },
      { code: 'Digit9', primary: '9', shift: '(' },
      { code: 'Digit0', primary: '0', shift: ')' },
      { code: 'Minus', primary: '-', shift: '_' },
      { code: 'Equal', primary: '=', shift: '+' },
      { code: 'Backspace', primary: 'Backspace', width: 2 },
    ],
  },
  // Row 2: Top letter row (QWERTY: Q-P)
  {
    keys: [
      { code: 'Tab', primary: 'Tab', width: 1.5 },
      { code: 'KeyQ', primary: 'ൗ', shift: 'ഔ' },
      { code: 'KeyW', primary: 'ൈ', shift: 'ഐ' },
      { code: 'KeyE', primary: 'ാ', shift: 'ആ' },
      { code: 'KeyR', primary: 'ീ', shift: 'ഈ' },
      { code: 'KeyT', primary: 'ൂ', shift: 'ഊ' },
      { code: 'KeyY', primary: 'ബ', shift: 'ഭ' },
      { code: 'KeyU', primary: 'ഹ', shift: 'ങ' },
      { code: 'KeyI', primary: 'ഗ', shift: 'ഘ' },
      { code: 'KeyO', primary: 'ദ', shift: 'ധ' },
      { code: 'KeyP', primary: 'ജ', shift: 'ഝ' },
      { code: 'BracketLeft', primary: 'ഡ', shift: 'ഢ' },
      { code: 'BracketRight', primary: 'ഞ', shift: 'ണ' },
      { code: 'Backslash', primary: 'ർ', shift: 'റ്' },
    ],
  },
  // Row 3: Middle letter row (QWERTY: A-')
  {
    keys: [
      { code: 'CapsLock', primary: 'CapsLock', width: 1.8 },
      { code: 'KeyA', primary: 'ൊ', shift: 'ഓ' },
      { code: 'KeyS', primary: 'േ', shift: 'ഏ' },
      { code: 'KeyD', primary: '്', shift: 'അ' },
      { code: 'KeyF', primary: 'ി', shift: 'ഇ' },
      { code: 'KeyG', primary: 'ു', shift: 'ഉ' },
      { code: 'KeyH', primary: 'പ', shift: 'ഫ' },
      { code: 'KeyJ', primary: 'ര', shift: 'റ' },
      { code: 'KeyK', primary: 'ക', shift: 'ഖ' },
      { code: 'KeyL', primary: 'ത', shift: 'ഥ' },
      { code: 'Semicolon', primary: 'ച', shift: 'ഛ' },
      { code: 'Quote', primary: 'ട', shift: 'ഠ' },
      { code: 'Enter', primary: 'Enter', width: 1.8 },
    ],
  },
  // Row 4: Bottom letter row (QWERTY: Z-/)
  {
    keys: [
      { code: 'ShiftLeft', primary: 'Shift', width: 2 },
      { code: 'KeyZ', primary: 'െ', shift: 'എ' },
      { code: 'KeyX', primary: 'ം', shift: 'ൺ' },
      { code: 'KeyC', primary: 'മ', shift: 'ണ' },
      { code: 'KeyV', primary: 'ന', shift: 'ൻ' },
      { code: 'KeyB', primary: 'വ', shift: 'ഴ' },
      { code: 'KeyN', primary: 'ല', shift: 'ള' },
      { code: 'KeyM', primary: 'സ', shift: 'ശ' },
      { code: 'Comma', primary: ',', shift: 'ഷ' },
      { code: 'Period', primary: '.', shift: '।' },
      { code: 'Slash', primary: 'യ', shift: 'ൽ' },
      { code: 'ShiftRight', primary: 'Shift', width: 2 },
    ],
  },
  // Row 5: Space bar row
  {
    keys: [
      { primary: 'Shift', code: 'ShiftLeft', width: 2 },
      { primary: 'Space', code: 'Space', width: 6 },
      { primary: 'Shift', code: 'ShiftRight', width: 2 },
    ],
  },
];

// Special keys that don't output characters but should be shown
export const specialKeys: Record<string, string> = {
  Backspace: '⌫',
  Enter: '↵',
  Shift: '⇧',
  ShiftLeft: '⇧',
  ShiftRight: '⇧',
  Space: 'Space',
  Tab: '⇥',
  CapsLock: '⇪',
  Control: 'Ctrl',
  Alt: 'Alt',
  Meta: '⌘',
  Backquote: '`',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/',
};
