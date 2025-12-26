// Use NFKC so chillu forms and compatibility sequences compare consistently.
// Also convert ZWJ sequences to precomposed chillaksharam forms
const normalize = (text: string): string => {
  if (!text) return '';
  // Convert ZWJ sequences to precomposed chillaksharam
  // These are the five chillaksharam as per m17n-db specification
  const chillaksharamMap: Record<string, string> = {
    'ന്\u200D': 'ൻ',  // ന + ് + ZWJ → ൻ
    'ല്\u200D': 'ൽ',  // ല + ് + ZWJ → ൽ
    'ര്\u200D': 'ർ',  // ര + ് + ZWJ → ർ
    'ണ്\u200D': 'ൺ',  // ണ + ് + ZWJ → ൺ
    'ള്\u200D': 'ൾ',  // ള + ് + ZWJ → ൾ
  };
  
  let normalized = text;
  // Replace ZWJ sequences with precomposed forms
  // Using split/join for safer replacement of multi-character sequences
  for (const [sequence, precomposed] of Object.entries(chillaksharamMap)) {
    normalized = normalized.split(sequence).join(precomposed);
  }
  
  return normalized.normalize('NFKC');
};

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter('ml', { granularity: 'grapheme' })
    : null;

/**
 * Splits a string into grapheme clusters so combined characters stay together.
 */
export function getGraphemes(text: string): string[] {
  const normalized = normalize(text);
  if (!normalized) return [];
  if (segmenter) {
    return Array.from(segmenter.segment(normalized), (item) => item.segment);
  }
  return Array.from(normalized);
}

export function isPrefixMatch(input: string, target: string): boolean {
  const inputNorm = normalize(input);
  const targetNorm = normalize(target);

  if (inputNorm.length > targetNorm.length) return false;
  return targetNorm.startsWith(inputNorm);
}

export function dropLastGrapheme(text: string): string {
  const graphemes = getGraphemes(normalize(text));
  graphemes.pop();
  return graphemes.join('');
}
