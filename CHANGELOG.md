# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2024-11-03

### Added

#### Timing Utilities (`js-helper-kit/timing`)
- `debounce(fn, delay, options)` — Trailing/leading debounce with `cancel()` support.
- `throttle(fn, delay, options)` — Leading/trailing throttle with `cancel()` support.

#### String Utilities (`js-helper-kit/strings`)
- `capitalize(str)` — Capitalizes the first character, lowercases the rest.
- `capitalizeWords(str)` — Capitalizes the first character of each word.
- `camelCase(str)` — Converts hyphen/underscore/space-separated strings to camelCase.
- `reverseString(str)` — Unicode-aware string reversal using `Intl.Segmenter`.

#### Object Utilities (`js-helper-kit/objects`)
- `deepClone(value)` — Deep clones objects, arrays, Dates, RegExps, Maps, Sets, and handles circular references.

#### Validation Utilities (`js-helper-kit/validation`)
- `isValidEmail(email)` — Practical email address validator.

#### Date Utilities (`js-helper-kit/dates`)
- `formatDate(date, format)` — Token-based date formatter supporting `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss`.

#### Array & General Utilities (`js-helper-kit/arrays`)
- `isEmpty(value)` — Checks null, undefined, strings, arrays, objects, Maps, and Sets for emptiness.
- `uniqueArray(array)` — Returns a new array with duplicates removed, preserving order.
- `chunkArray(array, size)` — Splits an array into chunks of the given size.
- `clamp(value, min, max)` — Clamps a number between a min and max value.

### Technical
- 156 unit tests, all passing.
- ~94% statement coverage, ~96% branch coverage via Vitest + V8.
- ES Module format (`"type": "module"`).
- Node.js ≥ 18 required.
- No runtime dependencies.
- GitHub Actions CI configured.
