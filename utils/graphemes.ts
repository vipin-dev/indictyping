// Use NFKC so chillu forms and compatibility sequences compare consistently.
const normalize = (text: string): string => (text ? text.normalize('NFKC') : '');

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
