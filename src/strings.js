/**
 * @module strings
 * String manipulation utilities.
 */

/**
 * Capitalizes the first character of a string and lowercases the rest.
 *
 * @param {string} str - The input string.
 * @returns {string} The capitalized string.
 * @throws {TypeError} If `str` is not a string.
 *
 * @example
 * capitalize('hello world') // => 'Hello world'
 * capitalize('HELLO')       // => 'Hello'
 * capitalize('')            // => ''
 */
export function capitalize(str) {
  if (typeof str !== 'string') {
    throw new TypeError(`capitalize: expected a string, got ${typeof str}`);
  }
  if (str.length === 0) return '';
  // Use spread to correctly handle multi-byte Unicode characters
  const chars = [...str];
  return chars[0].toUpperCase() + chars.slice(1).join('').toLowerCase();
}

/**
 * Capitalizes the first character of each word in a string.
 * Words are separated by whitespace sequences.
 *
 * @param {string} str - The input string.
 * @returns {string} The string with each word capitalized.
 * @throws {TypeError} If `str` is not a string.
 *
 * @example
 * capitalizeWords('hello world')        // => 'Hello World'
 * capitalizeWords('the quick brown fox') // => 'The Quick Brown Fox'
 * capitalizeWords('')                   // => ''
 */
export function capitalizeWords(str) {
  if (typeof str !== 'string') {
    throw new TypeError(`capitalizeWords: expected a string, got ${typeof str}`);
  }
  if (str.trim().length === 0) return str;
  return str.replace(/\S+/gu, (word) => {
    const chars = [...word];
    return chars[0].toUpperCase() + chars.slice(1).join('');
  });
}

/**
 * Converts a string to camelCase.
 *
 * Splits on whitespace, hyphens, underscores, and other non-alphanumeric
 * separators. The first segment is lowercased; subsequent segments are
 * title-cased and concatenated.
 *
 * @param {string} str - The input string.
 * @returns {string} The camelCased string.
 * @throws {TypeError} If `str` is not a string.
 *
 * @example
 * camelCase('hello world')    // => 'helloWorld'
 * camelCase('foo-bar-baz')    // => 'fooBarBaz'
 * camelCase('__foo_bar__')    // => 'fooBar'
 * camelCase('Hello World')    // => 'helloWorld'
 */
export function camelCase(str) {
  if (typeof str !== 'string') {
    throw new TypeError(`camelCase: expected a string, got ${typeof str}`);
  }
  // Split on any sequence of non-alphanumeric characters
  const words = str
    .trim()
    .split(/[^a-zA-Z0-9\u00C0-\u024F]+/u)
    .filter(Boolean);

  if (words.length === 0) return '';

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower;
      const chars = [...lower];
      return chars[0].toUpperCase() + chars.slice(1).join('');
    })
    .join('');
}

/**
 * Reverses the characters of a string, correctly handling Unicode surrogate
 * pairs and multi-code-point graphemes via the Intl.Segmenter API (Node.js 16+).
 * Falls back to spread-based reversal if Intl.Segmenter is not available.
 *
 * @param {string} str - The input string.
 * @returns {string} The reversed string.
 * @throws {TypeError} If `str` is not a string.
 *
 * @example
 * reverseString('hello')    // => 'olleh'
 * reverseString('abc def')  // => 'fed cba'
 * reverseString('')         // => ''
 */
export function reverseString(str) {
  if (typeof str !== 'string') {
    throw new TypeError(`reverseString: expected a string, got ${typeof str}`);
  }
  if (str.length === 0) return '';

  // Use Intl.Segmenter for proper grapheme cluster reversal when available
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter();
    const graphemes = [...segmenter.segment(str)].map((s) => s.segment);
    return graphemes.reverse().join('');
  }

  // Fallback: spread handles most surrogate pairs correctly
  return [...str].reverse().join('');
}
