import { describe, it, expect } from 'vitest';
import { deepClone } from '../src/objects.js';

// ─────────────────────────────────────────────────────────────────────────────
// deepClone
// ─────────────────────────────────────────────────────────────────────────────
describe('deepClone', () => {
  // Primitives
  it('returns primitives as-is', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(false)).toBe(false);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('clones a flat object', () => {
    const obj = { a: 1, b: 'two', c: true };
    const clone = deepClone(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj); // different reference
  });

  it('clones a nested object deeply', () => {
    const obj = { a: { b: { c: 3 } } };
    const clone = deepClone(obj);
    expect(clone).toEqual(obj);
    clone.a.b.c = 99;
    expect(obj.a.b.c).toBe(3); // original unchanged
  });

  it('clones a flat array', () => {
    const arr = [1, 2, 3, 'four'];
    const clone = deepClone(arr);
    expect(clone).toEqual(arr);
    expect(clone).not.toBe(arr);
  });

  it('clones nested arrays deeply', () => {
    const arr = [[1, 2], [3, [4, 5]]];
    const clone = deepClone(arr);
    expect(clone).toEqual(arr);
    clone[1][1].push(99);
    expect(arr[1][1]).toEqual([4, 5]);
  });

  it('clones mixed arrays and objects', () => {
    const obj = { items: [{ id: 1 }, { id: 2 }] };
    const clone = deepClone(obj);
    clone.items[0].id = 99;
    expect(obj.items[0].id).toBe(1);
  });

  // Date
  it('clones Date objects', () => {
    const date = new Date('2024-03-07T14:05:09.000Z');
    const clone = deepClone(date);
    expect(clone).not.toBe(date);
    expect(clone.getTime()).toBe(date.getTime());
    expect(clone instanceof Date).toBe(true);
  });

  it('cloning a Date does not affect the original', () => {
    const date = new Date('2024-03-07');
    const clone = deepClone(date);
    clone.setFullYear(2000);
    expect(date.getFullYear()).toBe(2024);
  });

  // RegExp
  it('clones RegExp objects', () => {
    const re = /hello/gi;
    const clone = deepClone(re);
    expect(clone).not.toBe(re);
    expect(clone.source).toBe(re.source);
    expect(clone.flags).toBe(re.flags);
    expect(clone instanceof RegExp).toBe(true);
  });

  // Map
  it('clones Map objects', () => {
    const map = new Map([['key1', { val: 1 }], ['key2', [2, 3]]]);
    const clone = deepClone(map);
    expect(clone).not.toBe(map);
    expect(clone instanceof Map).toBe(true);
    expect(clone.get('key1')).toEqual({ val: 1 });
    clone.get('key1').val = 99;
    expect(map.get('key1').val).toBe(1); // original unchanged
  });

  it('clones Map keys deeply', () => {
    const keyObj = { id: 1 };
    const map = new Map([[keyObj, 'value']]);
    const clone = deepClone(map);
    // Cloned key is a different object
    const clonedKey = [...clone.keys()][0];
    expect(clonedKey).not.toBe(keyObj);
    expect(clonedKey).toEqual(keyObj);
  });

  // Set
  it('clones Set objects', () => {
    const set = new Set([1, { a: 2 }, [3, 4]]);
    const clone = deepClone(set);
    expect(clone).not.toBe(set);
    expect(clone instanceof Set).toBe(true);
    expect(clone.size).toBe(set.size);
  });

  // Circular references
  it('handles circular references without throwing', () => {
    const obj = { a: 1 };
    obj.self = obj;
    expect(() => deepClone(obj)).not.toThrow();
  });

  it('preserves circular reference structure in clone', () => {
    const obj = { a: 1 };
    obj.self = obj;
    const clone = deepClone(obj);
    expect(clone).not.toBe(obj);
    expect(clone.self).toBe(clone); // clone.self points to clone, not obj
  });

  it('handles mutual circular references', () => {
    const a = { name: 'a' };
    const b = { name: 'b', ref: a };
    a.ref = b;
    expect(() => deepClone(a)).not.toThrow();
    const clone = deepClone(a);
    expect(clone.name).toBe('a');
    expect(clone.ref.name).toBe('b');
    expect(clone.ref.ref).toBe(clone);
  });

  // Symbol keys
  it('clones symbol-keyed enumerable properties', () => {
    const sym = Symbol('test');
    const obj = { a: 1, [sym]: 'symbol-value' };
    const clone = deepClone(obj);
    expect(clone[sym]).toBe('symbol-value');
    expect(clone.a).toBe(1);
  });

  // Functions
  it('returns functions by reference (documented behavior)', () => {
    const fn = () => 42;
    expect(deepClone(fn)).toBe(fn);
  });

  // Objects nested inside arrays
  it('deeply clones objects nested inside arrays', () => {
    const original = [{ a: { b: 1 } }];
    const clone = deepClone(original);
    clone[0].a.b = 99;
    expect(original[0].a.b).toBe(1);
  });

  // Empty structures
  it('handles empty objects', () => {
    const obj = {};
    const clone = deepClone(obj);
    expect(clone).toEqual({});
    expect(clone).not.toBe(obj);
  });

  it('handles empty arrays', () => {
    const arr = [];
    const clone = deepClone(arr);
    expect(clone).toEqual([]);
    expect(clone).not.toBe(arr);
  });
});
