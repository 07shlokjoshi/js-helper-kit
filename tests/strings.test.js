import { describe, it, expect } from 'vitest';
import { capitalize, capitalizeWords, camelCase, reverseString } from '../src/strings.js';

// ─────────────────────────────────────────────────────────────────────────────
// capitalize
// ─────────────────────────────────────────────────────────────────────────────
describe('capitalize', () => {
  it('capitalizes the first letter and lowercases the rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
    expect(capitalize('hELLO')).toBe('Hello');
  });

  it('returns an empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles single character strings', () => {
    expect(capitalize('a')).toBe('A');
    expect(capitalize('A')).toBe('A');
    expect(capitalize('z')).toBe('Z');
  });

  it('handles strings with leading whitespace', () => {
    expect(capitalize(' hello')).toBe(' hello');
  });

  it('handles strings that start with numbers', () => {
    expect(capitalize('1hello')).toBe('1hello');
  });

  it('handles unicode characters', () => {
    expect(capitalize('über')).toBe('Über');
  });

  it('throws TypeError for non-string input', () => {
    expect(() => capitalize(null)).toThrow(TypeError);
    expect(() => capitalize(undefined)).toThrow(TypeError);
    expect(() => capitalize(42)).toThrow(TypeError);
    expect(() => capitalize([])).toThrow(TypeError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// capitalizeWords
// ─────────────────────────────────────────────────────────────────────────────
describe('capitalizeWords', () => {
  it('capitalizes the first letter of each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
    expect(capitalizeWords('the quick brown fox')).toBe('The Quick Brown Fox');
  });

  it('handles already-capitalized words', () => {
    expect(capitalizeWords('Hello World')).toBe('Hello World');
    expect(capitalizeWords('UPPER CASE')).toBe('UPPER CASE');
  });

  it('returns empty string for empty input', () => {
    expect(capitalizeWords('')).toBe('');
  });

  it('handles whitespace-only strings', () => {
    expect(capitalizeWords('   ')).toBe('   ');
  });

  it('handles single word', () => {
    expect(capitalizeWords('hello')).toBe('Hello');
  });

  it('handles multiple spaces between words', () => {
    const result = capitalizeWords('hello  world');
    expect(result).toBe('Hello  World');
  });

  it('throws TypeError for non-string input', () => {
    expect(() => capitalizeWords(null)).toThrow(TypeError);
    expect(() => capitalizeWords(undefined)).toThrow(TypeError);
    expect(() => capitalizeWords(123)).toThrow(TypeError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// camelCase
// ─────────────────────────────────────────────────────────────────────────────
describe('camelCase', () => {
  it('converts space-separated words to camelCase', () => {
    expect(camelCase('hello world')).toBe('helloWorld');
    expect(camelCase('the quick brown fox')).toBe('theQuickBrownFox');
  });

  it('converts hyphen-separated words', () => {
    expect(camelCase('foo-bar-baz')).toBe('fooBarBaz');
  });

  it('converts underscore-separated words', () => {
    expect(camelCase('foo_bar_baz')).toBe('fooBarBaz');
  });

  it('converts mixed separators', () => {
    expect(camelCase('hello-world_foo bar')).toBe('helloWorldFooBar');
  });

  it('lowercases a single word', () => {
    expect(camelCase('Hello')).toBe('hello');
    expect(camelCase('UPPER')).toBe('upper');
  });

  it('handles leading/trailing separators', () => {
    expect(camelCase('__foo_bar__')).toBe('fooBar');
    expect(camelCase('  hello world  ')).toBe('helloWorld');
  });

  it('returns empty string for empty input', () => {
    expect(camelCase('')).toBe('');
  });

  it('returns empty string for separator-only input', () => {
    expect(camelCase('___')).toBe('');
    expect(camelCase('   ')).toBe('');
  });

  it('throws TypeError for non-string input', () => {
    expect(() => camelCase(null)).toThrow(TypeError);
    expect(() => camelCase(undefined)).toThrow(TypeError);
    expect(() => camelCase(42)).toThrow(TypeError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// reverseString
// ─────────────────────────────────────────────────────────────────────────────
describe('reverseString', () => {
  it('reverses a simple ASCII string', () => {
    expect(reverseString('hello')).toBe('olleh');
    expect(reverseString('abcde')).toBe('edcba');
  });

  it('reverses a string with spaces', () => {
    expect(reverseString('abc def')).toBe('fed cba');
  });

  it('returns empty string for empty input', () => {
    expect(reverseString('')).toBe('');
  });

  it('returns single character unchanged', () => {
    expect(reverseString('a')).toBe('a');
    expect(reverseString('Z')).toBe('Z');
  });

  it('handles palindromes', () => {
    expect(reverseString('racecar')).toBe('racecar');
    expect(reverseString('madam')).toBe('madam');
  });

  it('handles numeric characters', () => {
    expect(reverseString('12345')).toBe('54321');
  });

  it('handles unicode characters', () => {
    expect(reverseString('über')).toBe('rebü');
  });

  it('handles strings with special characters', () => {
    expect(reverseString('a!b@c')).toBe('c@b!a');
  });

  it('throws TypeError for non-string input', () => {
    expect(() => reverseString(null)).toThrow(TypeError);
    expect(() => reverseString(undefined)).toThrow(TypeError);
    expect(() => reverseString(42)).toThrow(TypeError);
    expect(() => reverseString(['a', 'b'])).toThrow(TypeError);
  });
});
