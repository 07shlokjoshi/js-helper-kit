# js-helper-kit

[![npm version](https://img.shields.io/npm/v/js-helper-kit.svg)](https://www.npmjs.com/package/js-helper-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/YOUR_USERNAME/js-helper-kit/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_USERNAME/js-helper-kit/actions/workflows/test.yml)

> A lightweight collection of reusable JavaScript utilities that simplify common development tasks.

---

## Features

- ⏱ **Timing** — `debounce` and `throttle` with full option support and `cancel()`
- 🔤 **Strings** — `capitalize`, `capitalizeWords`, `camelCase`, `reverseString` (Unicode-aware)
- 🧬 **Objects** — `deepClone` with circular reference detection, Date, RegExp, Map, Set support
- ✅ **Validation** — `isValidEmail` — practical, whitespace-aware email checker
- 📅 **Dates** — `formatDate` with token-based format strings
- 📦 **Arrays & General** — `isEmpty`, `uniqueArray`, `chunkArray`, `clamp`
- 🚫 **Zero runtime dependencies**
- 🧪 **156 unit tests, ~94% coverage**
- 📖 **Full JSDoc documentation**

---

## Requirements

- Node.js **≥ 18.0.0**
- ES Modules (`"type": "module"` in your `package.json`, or `.mjs` extension)

---

## Installation

```bash
npm install js-helper-kit
```

---

## Usage

### Import everything from the main entry

```js
import {
  debounce, throttle,
  capitalize, capitalizeWords, camelCase, reverseString,
  deepClone,
  isValidEmail,
  formatDate,
  isEmpty, uniqueArray, chunkArray, clamp
} from 'js-helper-kit';
```

### Import only what you need (tree-shakable subpath exports)

```js
import { debounce, throttle } from 'js-helper-kit/timing';
import { capitalize, camelCase } from 'js-helper-kit/strings';
import { deepClone } from 'js-helper-kit/objects';
import { isValidEmail } from 'js-helper-kit/validation';
import { formatDate } from 'js-helper-kit/dates';
import { isEmpty, chunkArray, clamp } from 'js-helper-kit/arrays';
```

---

## API Reference

### Timing Utilities

#### `debounce(fn, delay, [options])`

Creates a debounced version of `fn` that delays invocation until `delay` ms have elapsed since the last call.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `fn` | `Function` | — | The function to debounce. |
| `delay` | `number` | — | Milliseconds to wait. Must be a non-negative finite number. |
| `options.leading` | `boolean` | `false` | Fire on the leading edge of the delay. |
| `options.trailing` | `boolean` | `true` | Fire on the trailing edge of the delay. |

**Returns:** `Function` — The debounced function with a `.cancel()` method.

**Throws:** `TypeError` if `fn` is not a function or `delay` is invalid.

```js
const debouncedSearch = debounce(fetchResults, 300);
input.addEventListener('input', (e) => debouncedSearch(e.target.value));

// Cancel before it fires
debouncedSearch.cancel();

// Leading edge: fire immediately, not at end
const leadingDebounce = debounce(save, 500, { leading: true, trailing: false });
```

---

#### `throttle(fn, delay, [options])`

Creates a throttled version of `fn` that fires at most once per `delay` ms.

**Default behavior:** fires on the **leading** edge (first call), then allows one **trailing** call after the delay if additional calls occurred.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `fn` | `Function` | — | The function to throttle. |
| `delay` | `number` | — | Minimum ms between invocations. |
| `options.leading` | `boolean` | `true` | Fire immediately on first call. |
| `options.trailing` | `boolean` | `true` | Allow one trailing call after window. |

**Returns:** `Function` — The throttled function with a `.cancel()` method.

**Throws:** `TypeError` if `fn` is not a function or `delay` is invalid.

```js
const throttledScroll = throttle(updatePosition, 100);
window.addEventListener('scroll', throttledScroll);

// Cleanup
throttledScroll.cancel();
```

---

### String Utilities

#### `capitalize(str)`

Capitalizes the first character and lowercases the rest.

```js
capitalize('hello world')  // => 'Hello world'
capitalize('HELLO')        // => 'Hello'
capitalize('')             // => ''
```

**Throws:** `TypeError` if `str` is not a string.

---

#### `capitalizeWords(str)`

Capitalizes the first character of each whitespace-separated word.

```js
capitalizeWords('the quick brown fox')  // => 'The Quick Brown Fox'
capitalizeWords('')                     // => ''
```

**Throws:** `TypeError` if `str` is not a string.

---

#### `camelCase(str)`

Converts a string to camelCase. Splits on whitespace, hyphens, underscores, and other non-alphanumeric characters.

```js
camelCase('hello world')   // => 'helloWorld'
camelCase('foo-bar-baz')   // => 'fooBarBaz'
camelCase('__foo_bar__')   // => 'fooBar'
camelCase('')              // => ''
```

**Throws:** `TypeError` if `str` is not a string.

---

#### `reverseString(str)`

Reverses a string. Uses `Intl.Segmenter` (Node ≥ 16) for correct Unicode grapheme cluster handling.

```js
reverseString('hello')    // => 'olleh'
reverseString('abc def')  // => 'fed cba'
reverseString('')         // => ''
```

**Throws:** `TypeError` if `str` is not a string.

---

### Object Utilities

#### `deepClone(value)`

Performs a deep clone of the provided value.

**Supported types:** primitives, plain objects, arrays, `Date`, `RegExp`, `Map`, `Set`, circular references, Symbol-keyed properties.

**Limitations:**
- Functions are returned by reference (cannot be meaningfully cloned).
- `WeakMap`, `WeakSet`, `WeakRef` are returned by reference (entries are not enumerable by design).
- Class instances beyond the listed types have their own enumerable properties copied onto a new instance of the same prototype.

```js
const original = {
  name: 'Alice',
  scores: [10, 20, 30],
  meta: { createdAt: new Date() },
};
const clone = deepClone(original);

clone.scores.push(40);
console.log(original.scores);  // [10, 20, 30] — unchanged

// Circular references are handled safely
const obj = { a: 1 };
obj.self = obj;
const safeClone = deepClone(obj);
console.log(safeClone.self === safeClone); // true
```

---

### Validation Utilities

#### `isValidEmail(email)`

Checks whether a value looks like a valid email address.

**Returns:** `boolean`

**Not a full RFC 5321/5322 implementation** — covers standard real-world formats. Does not verify domain existence.

```js
isValidEmail('user@example.com')         // => true
isValidEmail('name+tag@sub.domain.org')  // => true
isValidEmail('bad@')                     // => false
isValidEmail(null)                       // => false
isValidEmail('  user@example.com ')      // => false  (whitespace)
```

---

### Date Utilities

#### `formatDate(date, format)`

Formats a date using a token-based format string.

> **⚠️ Timezone:** All formatting uses the **local timezone** of the runtime environment. Use UTC-converted dates or a dedicated library for timezone-aware formatting.

| Token | Description | Example |
|---|---|---|
| `YYYY` | 4-digit year | `2024` |
| `MM` | 2-digit month (01–12) | `03` |
| `DD` | 2-digit day (01–31) | `07` |
| `HH` | 2-digit hour, 24h (00–23) | `14` |
| `mm` | 2-digit minutes (00–59) | `05` |
| `ss` | 2-digit seconds (00–59) | `09` |

| Parameter | Type | Description |
|---|---|---|
| `date` | `Date \| number \| string` | A Date instance, timestamp (ms), or parseable date string. |
| `format` | `string` | Format string with tokens. |

**Returns:** `string`

**Throws:** `TypeError` for invalid arguments, `RangeError` for invalid dates.

```js
const d = new Date(2024, 2, 7, 14, 5, 9);  // 7 Mar 2024 14:05:09 local

formatDate(d, 'YYYY-MM-DD')           // => '2024-03-07'
formatDate(d, 'DD/MM/YYYY')           // => '07/03/2024'
formatDate(d, 'HH:mm:ss')             // => '14:05:09'
formatDate(d, 'YYYY-MM-DD HH:mm:ss') // => '2024-03-07 14:05:09'

// Accepts timestamps
formatDate(Date.now(), 'YYYY-MM-DD')
```

---

### Array & General Utilities

#### `isEmpty(value)`

Returns `true` for: `null`, `undefined`, empty/whitespace-only strings, empty arrays, empty plain objects, empty Maps, and empty Sets.

Returns `false` for numbers (including `0`), booleans, functions, and non-empty collections.

```js
isEmpty(null)        // => true
isEmpty('')          // => true
isEmpty('  ')        // => true
isEmpty([])          // => true
isEmpty({})          // => true
isEmpty(new Map())   // => true

isEmpty(0)           // => false
isEmpty(false)       // => false
isEmpty([0])         // => false
```

---

#### `uniqueArray(array)`

Returns a new array with duplicate elements removed. Preserves insertion order. Uses strict equality (`===`).

```js
uniqueArray([1, 2, 2, 3, 1])  // => [1, 2, 3]
uniqueArray(['a', 'b', 'a'])  // => ['a', 'b']
uniqueArray([])               // => []
```

**Throws:** `TypeError` if argument is not an array.

---

#### `chunkArray(array, size)`

Splits an array into chunks of the specified size. The last chunk may be smaller.

```js
chunkArray([1, 2, 3, 4, 5], 2)  // => [[1, 2], [3, 4], [5]]
chunkArray([1, 2, 3], 3)        // => [[1, 2, 3]]
chunkArray([], 2)               // => []
```

**Throws:** `TypeError` if `array` is not an array, or `size` is not a positive integer.

---

#### `clamp(value, min, max)`

Clamps `value` between `min` and `max` (inclusive).

```js
clamp(5, 0, 10)   // => 5
clamp(-5, 0, 10)  // => 0
clamp(15, 0, 10)  // => 10
clamp(5, 5, 5)    // => 5
```

**Throws:** `TypeError` if any argument is not a finite number, `RangeError` if `min > max`.

---

## Error Handling

All functions throw typed errors for invalid inputs:

- **`TypeError`** — wrong argument type or invalid value format.
- **`RangeError`** — value out of acceptable range (e.g., invalid date, `min > max`).
- Functions that return `boolean` (like `isValidEmail`) **never throw** — they return `false` for invalid inputs.

---

## Testing

```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Tests use [Vitest](https://vitest.dev/) with fake timers for timing utilities.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository and create a feature branch.
2. **Write tests** for any new functionality.
3. **Ensure all tests pass** (`npm test`) and coverage stays ≥ 90%.
4. **Follow existing code style** — clean ES Modules, JSDoc comments, named exports.
5. **Update the CHANGELOG** under `[Unreleased]`.
6. Submit a **pull request** with a clear description of your changes.

Please open an issue before implementing large changes to discuss the approach.

---

## License

[MIT](LICENSE) © 2024 js-helper-kit contributors
