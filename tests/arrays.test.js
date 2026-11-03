import { describe, it, expect } from 'vitest';
import { isEmpty, uniqueArray, chunkArray, clamp } from '../src/arrays.js';

// ─────────────────────────────────────────────────────────────────────────────
// isEmpty
// ─────────────────────────────────────────────────────────────────────────────
describe('isEmpty', () => {
  it('returns true for null', () => expect(isEmpty(null)).toBe(true));
  it('returns true for undefined', () => expect(isEmpty(undefined)).toBe(true));

  it('returns true for empty string', () => expect(isEmpty('')).toBe(true));
  it('returns true for whitespace-only string', () => expect(isEmpty('   ')).toBe(true));
  it('returns false for non-empty string', () => expect(isEmpty('hello')).toBe(false));
  it('returns false for string with only one char', () => expect(isEmpty('a')).toBe(false));

  it('returns true for empty array', () => expect(isEmpty([])).toBe(true));
  it('returns false for non-empty array', () => expect(isEmpty([1])).toBe(false));
  it('returns false for array with falsy values', () => expect(isEmpty([0, null, false])).toBe(false));

  it('returns true for empty object', () => expect(isEmpty({})).toBe(true));
  it('returns false for non-empty object', () => expect(isEmpty({ a: 1 })).toBe(false));
  it('returns false for object with falsy value', () => expect(isEmpty({ a: false })).toBe(false));

  it('returns true for empty Map', () => expect(isEmpty(new Map())).toBe(true));
  it('returns false for non-empty Map', () => expect(isEmpty(new Map([['k', 'v']]))).toBe(false));

  it('returns true for empty Set', () => expect(isEmpty(new Set())).toBe(true));
  it('returns false for non-empty Set', () => expect(isEmpty(new Set([1]))).toBe(false));

  it('returns false for number 0', () => expect(isEmpty(0)).toBe(false));
  it('returns false for number 42', () => expect(isEmpty(42)).toBe(false));
  it('returns false for NaN', () => expect(isEmpty(NaN)).toBe(false));
  it('returns false for false boolean', () => expect(isEmpty(false)).toBe(false));
  it('returns false for true boolean', () => expect(isEmpty(true)).toBe(false));
});

// ─────────────────────────────────────────────────────────────────────────────
// uniqueArray
// ─────────────────────────────────────────────────────────────────────────────
describe('uniqueArray', () => {
  it('removes duplicate numbers', () => {
    expect(uniqueArray([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('removes duplicate strings', () => {
    expect(uniqueArray(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('preserves order (first occurrence wins)', () => {
    expect(uniqueArray([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });

  it('handles an empty array', () => {
    expect(uniqueArray([])).toEqual([]);
  });

  it('returns a new array (does not mutate input)', () => {
    const input = [1, 2, 3];
    const result = uniqueArray(input);
    result.push(99);
    expect(input).toEqual([1, 2, 3]);
  });

  it('handles arrays with no duplicates', () => {
    expect(uniqueArray([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('handles mixed types', () => {
    expect(uniqueArray([1, '1', 1, '1'])).toEqual([1, '1']);
  });

  it('uses reference equality for objects (different refs are kept)', () => {
    const obj = { id: 1 };
    const result = uniqueArray([obj, { id: 1 }, obj]);
    expect(result.length).toBe(2); // obj and { id: 1 } are different refs
  });

  it('handles arrays with null and undefined', () => {
    expect(uniqueArray([null, undefined, null, undefined])).toEqual([null, undefined]);
  });

  it('throws TypeError for non-array input', () => {
    expect(() => uniqueArray('hello')).toThrow(TypeError);
    expect(() => uniqueArray(42)).toThrow(TypeError);
    expect(() => uniqueArray(null)).toThrow(TypeError);
    expect(() => uniqueArray(undefined)).toThrow(TypeError);
    expect(() => uniqueArray({})).toThrow(TypeError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// chunkArray
// ─────────────────────────────────────────────────────────────────────────────
describe('chunkArray', () => {
  it('chunks an array into groups of specified size', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns a single chunk when size equals array length', () => {
    expect(chunkArray([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  it('returns individual elements when size is 1', () => {
    expect(chunkArray([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it('returns a single chunk when size is larger than array', () => {
    expect(chunkArray([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
  });

  it('returns empty array for empty input', () => {
    expect(chunkArray([], 3)).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4];
    chunkArray(input, 2);
    expect(input).toEqual([1, 2, 3, 4]);
  });

  it('handles arrays of objects', () => {
    const result = chunkArray([{ a: 1 }, { b: 2 }, { c: 3 }], 2);
    expect(result).toEqual([[{ a: 1 }, { b: 2 }], [{ c: 3 }]]);
  });

  it('throws TypeError if array argument is not an array', () => {
    expect(() => chunkArray('hello', 2)).toThrow(TypeError);
    expect(() => chunkArray(null, 2)).toThrow(TypeError);
    expect(() => chunkArray(undefined, 2)).toThrow(TypeError);
    expect(() => chunkArray({}, 2)).toThrow(TypeError);
  });

  it('throws TypeError if size is not a positive integer', () => {
    expect(() => chunkArray([1, 2, 3], 0)).toThrow(TypeError);
    expect(() => chunkArray([1, 2, 3], -1)).toThrow(TypeError);
    expect(() => chunkArray([1, 2, 3], 1.5)).toThrow(TypeError);
    expect(() => chunkArray([1, 2, 3], 'two')).toThrow(TypeError);
    expect(() => chunkArray([1, 2, 3], NaN)).toThrow(TypeError);
    expect(() => chunkArray([1, 2, 3], Infinity)).toThrow(TypeError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// clamp
// ─────────────────────────────────────────────────────────────────────────────
describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('returns min when value is below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(-100, -50, 50)).toBe(-50);
  });

  it('returns max when value is above max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(100, -50, 50)).toBe(50);
  });

  it('returns min === max when min equals max', () => {
    expect(clamp(5, 5, 5)).toBe(5);
    expect(clamp(0, 5, 5)).toBe(5);
    expect(clamp(10, 5, 5)).toBe(5);
  });

  it('works with negative ranges', () => {
    expect(clamp(-3, -10, -1)).toBe(-3);
    expect(clamp(5, -10, -1)).toBe(-1);
    expect(clamp(-15, -10, -1)).toBe(-10);
  });

  it('works with floating point numbers', () => {
    expect(clamp(0.5, 0, 1)).toBeCloseTo(0.5);
    expect(clamp(1.5, 0, 1)).toBeCloseTo(1);
    expect(clamp(-0.5, 0, 1)).toBeCloseTo(0);
  });

  it('throws TypeError for non-finite numbers', () => {
    expect(() => clamp(NaN, 0, 10)).toThrow(TypeError);
    expect(() => clamp(5, NaN, 10)).toThrow(TypeError);
    expect(() => clamp(5, 0, NaN)).toThrow(TypeError);
    expect(() => clamp(Infinity, 0, 10)).toThrow(TypeError);
    expect(() => clamp(5, -Infinity, 10)).toThrow(TypeError);
  });

  it('throws TypeError for non-number arguments', () => {
    expect(() => clamp('5', 0, 10)).toThrow(TypeError);
    expect(() => clamp(5, '0', 10)).toThrow(TypeError);
    expect(() => clamp(5, 0, '10')).toThrow(TypeError);
    expect(() => clamp(null, 0, 10)).toThrow(TypeError);
  });

  it('throws RangeError when min > max', () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
    expect(() => clamp(5, 1, -1)).toThrow(RangeError);
  });
});
