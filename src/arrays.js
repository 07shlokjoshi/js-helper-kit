/**
 * @module arrays
 * Array and general value utilities.
 */

/**
 * Checks whether a value is "empty".
 *
 * Returns `true` for:
 * - `null` or `undefined`
 * - Empty string (`''`)
 * - String containing only whitespace (`'   '`)
 * - Array with zero elements
 * - Map or Set with zero entries
 * - Plain object with no own enumerable keys
 *
 * Returns `false` for:
 * - Numbers (including 0, NaN — these have a value)
 * - Booleans
 * - Functions
 * - Non-empty strings, arrays, objects, Maps, Sets
 *
 * @param {*} value - The value to check.
 * @returns {boolean} `true` if the value is considered empty.
 *
 * @example
 * isEmpty(null)        // => true
 * isEmpty('')          // => true
 * isEmpty('  ')        // => true
 * isEmpty([])          // => true
 * isEmpty({})          // => true
 * isEmpty(new Map())   // => true
 * isEmpty(0)           // => false
 * isEmpty([1])         // => false
 * isEmpty({ a: 1 })   // => false
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  // Numbers, booleans, functions, symbols — have a value, not empty
  return false;
}

/**
 * Returns a new array containing only the unique elements from the input array.
 * Uses strict equality (`===`) for primitives and reference equality for objects.
 * Order is preserved (first occurrence wins).
 *
 * @param {Array} array - The input array.
 * @returns {Array} A new array with duplicates removed.
 * @throws {TypeError} If `array` is not an array.
 *
 * @example
 * uniqueArray([1, 2, 2, 3, 1])           // => [1, 2, 3]
 * uniqueArray(['a', 'b', 'a'])           // => ['a', 'b']
 * uniqueArray([{ id: 1 }, { id: 1 }])   // => [{ id: 1 }, { id: 1 }] (different refs)
 */
export function uniqueArray(array) {
  if (!Array.isArray(array)) {
    throw new TypeError(`uniqueArray: expected an array, got ${typeof array}`);
  }
  return [...new Set(array)];
}

/**
 * Splits an array into chunks of the specified size.
 * The last chunk may contain fewer elements if the array length is not
 * evenly divisible by `size`.
 *
 * @param {Array} array - The array to split.
 * @param {number} size - The maximum number of elements per chunk. Must be a positive integer.
 * @returns {Array<Array>} An array of chunk arrays.
 * @throws {TypeError} If `array` is not an array.
 * @throws {TypeError} If `size` is not a positive integer.
 *
 * @example
 * chunkArray([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 * chunkArray([1, 2, 3], 3)       // => [[1, 2, 3]]
 * chunkArray([], 2)              // => []
 */
export function chunkArray(array, size) {
  if (!Array.isArray(array)) {
    throw new TypeError(`chunkArray: first argument must be an array, got ${typeof array}`);
  }
  if (typeof size !== 'number' || !Number.isInteger(size) || size < 1) {
    throw new TypeError('chunkArray: size must be a positive integer');
  }

  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Clamps a number between a minimum and maximum value (inclusive).
 *
 * @param {number} value - The number to clamp.
 * @param {number} min - The lower bound.
 * @param {number} max - The upper bound.
 * @returns {number} The clamped number.
 * @throws {TypeError} If any argument is not a finite number.
 * @throws {RangeError} If `min` is greater than `max`.
 *
 * @example
 * clamp(5, 0, 10)   // => 5
 * clamp(-5, 0, 10)  // => 0
 * clamp(15, 0, 10)  // => 10
 * clamp(5, 5, 5)    // => 5
 */
export function clamp(value, min, max) {
  if (
    typeof value !== 'number' || !isFinite(value) ||
    typeof min !== 'number' || !isFinite(min) ||
    typeof max !== 'number' || !isFinite(max)
  ) {
    throw new TypeError('clamp: all arguments must be finite numbers');
  }
  if (min > max) {
    throw new RangeError(`clamp: min (${min}) must not be greater than max (${max})`);
  }
  return Math.min(Math.max(value, min), max);
}
