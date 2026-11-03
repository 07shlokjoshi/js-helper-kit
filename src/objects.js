/**
 * @module objects
 * Object utilities including deep cloning.
 */

/**
 * Performs a deep clone of the provided value.
 *
 * **Supported types:**
 * - Primitives (number, string, boolean, null, undefined, BigInt, Symbol)
 * - Plain objects and arrays (including nested)
 * - Date objects
 * - RegExp objects
 * - Map objects
 * - Set objects
 * - Circular references (safely handled via a WeakMap)
 *
 * **Known limitations:**
 * - Functions are not cloned; they are returned by reference.
 * - WeakMap, WeakSet, and WeakRef cannot be deeply cloned by design
 *   (their entries are not enumerable). They are returned by reference.
 * - Prototype chains and class instances beyond the listed types may not
 *   be fully reconstructed. Their own enumerable properties will be
 *   shallow-copied onto a plain object.
 * - Symbol-keyed properties are preserved.
 *
 * @param {*} value - The value to deep clone.
 * @param {WeakMap} [_seen] - Internal: tracks circular references. Do not pass this argument.
 * @returns {*} A deep clone of `value`.
 *
 * @example
 * const original = { a: 1, b: { c: [2, 3] }, d: new Date() };
 * const clone = deepClone(original);
 * clone.b.c.push(4);
 * console.log(original.b.c); // [2, 3] — unchanged
 */
export function deepClone(value, _seen = new WeakMap()) {
  // Primitives and functions
  if (value === null || typeof value !== 'object' && typeof value !== 'function') {
    return value;
  }

  // Functions: return by reference (cannot be deep-cloned meaningfully)
  if (typeof value === 'function') {
    return value;
  }

  // Handle circular references
  if (_seen.has(value)) {
    return _seen.get(value);
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // Map
  if (value instanceof Map) {
    const mapClone = new Map();
    _seen.set(value, mapClone);
    for (const [k, v] of value) {
      mapClone.set(deepClone(k, _seen), deepClone(v, _seen));
    }
    return mapClone;
  }

  // Set
  if (value instanceof Set) {
    const setClone = new Set();
    _seen.set(value, setClone);
    for (const v of value) {
      setClone.add(deepClone(v, _seen));
    }
    return setClone;
  }

  // Array
  if (Array.isArray(value)) {
    const arrayClone = [];
    _seen.set(value, arrayClone);
    for (let i = 0; i < value.length; i++) {
      arrayClone[i] = deepClone(value[i], _seen);
    }
    // Preserve non-index own properties (e.g., sparse array extras)
    for (const key of Object.getOwnPropertySymbols(value)) {
      arrayClone[key] = deepClone(value[key], _seen);
    }
    return arrayClone;
  }

  // Plain object (or object with unknown prototype — best-effort clone)
  const objClone = Object.create(Object.getPrototypeOf(value));
  _seen.set(value, objClone);

  // Clone string-keyed own enumerable properties
  for (const key of Object.keys(value)) {
    objClone[key] = deepClone(value[key], _seen);
  }

  // Clone symbol-keyed own properties
  for (const sym of Object.getOwnPropertySymbols(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, sym);
    if (descriptor.enumerable) {
      objClone[sym] = deepClone(value[sym], _seen);
    }
  }

  return objClone;
}
