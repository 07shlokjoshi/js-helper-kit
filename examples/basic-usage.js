/**
 * basic-usage.js — js-helper-kit demonstration
 *
 * This file demonstrates all utilities exported by js-helper-kit.
 * Run with: node examples/basic-usage.js
 */

import {
  debounce,
  throttle,
  capitalize,
  capitalizeWords,
  camelCase,
  reverseString,
  deepClone,
  isValidEmail,
  formatDate,
  isEmpty,
  uniqueArray,
  chunkArray,
  clamp,
} from '../src/index.js';

const section = (name) => {
  console.log('\n' + '═'.repeat(50));
  console.log(`  ${name}`);
  console.log('═'.repeat(50));
};

// ─────────────────────────────────────────────────────
// TIMING
// ─────────────────────────────────────────────────────
section('Timing Utilities');

const debouncedLog = debounce((msg) => console.log(`  [debounce] Fired: ${msg}`), 200);
console.log('  Calling debounced function 3 times rapidly...');
debouncedLog('call 1');
debouncedLog('call 2');
debouncedLog('call 3');
// Only "call 3" will fire after 200ms

const throttledLog = throttle((n) => console.log(`  [throttle] Fired: ${n}`), 200);
console.log('  Calling throttled function 3 times rapidly...');
throttledLog(1); // fires immediately (leading)
throttledLog(2); // ignored
throttledLog(3); // trailing call scheduled

// ─────────────────────────────────────────────────────
// STRINGS
// ─────────────────────────────────────────────────────
section('String Utilities');

console.log('  capitalize("hello world")       =>', capitalize('hello world'));
console.log('  capitalize("UPPER CASE")        =>', capitalize('UPPER CASE'));

console.log('  capitalizeWords("the quick fox") =>', capitalizeWords('the quick brown fox'));

console.log('  camelCase("hello world")        =>', camelCase('hello world'));
console.log('  camelCase("foo-bar-baz")        =>', camelCase('foo-bar-baz'));
console.log('  camelCase("__snake_case__")     =>', camelCase('__snake_case__'));

console.log('  reverseString("hello")          =>', reverseString('hello'));
console.log('  reverseString("über")           =>', reverseString('über'));

// ─────────────────────────────────────────────────────
// OBJECTS
// ─────────────────────────────────────────────────────
section('Object Utilities — deepClone');

const original = {
  name: 'Alice',
  scores: [10, 20, 30],
  meta: { createdAt: new Date('2024-03-07') },
  tags: new Set(['js', 'node']),
  config: new Map([['debug', true]]),
};

const cloned = deepClone(original);
cloned.name = 'Bob';
cloned.scores.push(99);
cloned.config.set('debug', false);

console.log('  Original name    :', original.name);       // Alice
console.log('  Cloned name      :', cloned.name);         // Bob
console.log('  Original scores  :', original.scores);     // [10, 20, 30]
console.log('  Cloned scores    :', cloned.scores);       // [10, 20, 30, 99]
console.log('  Original debug   :', original.config.get('debug')); // true
console.log('  Cloned debug     :', cloned.config.get('debug'));   // false

// Circular reference
const circ = { a: 1 };
circ.self = circ;
const circClone = deepClone(circ);
console.log('  Circular clone self === clone:', circClone.self === circClone); // true

// ─────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────
section('Validation Utilities');

const emails = [
  'user@example.com',
  'name+tag@sub.domain.org',
  'bad@',
  'no-at-sign',
  null,
  '  leading@space.com',
];

emails.forEach((email) => {
  console.log(`  isValidEmail(${JSON.stringify(email)})`, '=>', isValidEmail(email));
});

// ─────────────────────────────────────────────────────
// DATES
// ─────────────────────────────────────────────────────
section('Date Utilities');

const d = new Date(2024, 2, 7, 14, 5, 9); // 7 Mar 2024 14:05:09 local

console.log('  formatDate(d, "YYYY-MM-DD")           =>', formatDate(d, 'YYYY-MM-DD'));
console.log('  formatDate(d, "DD/MM/YYYY")           =>', formatDate(d, 'DD/MM/YYYY'));
console.log('  formatDate(d, "HH:mm:ss")             =>', formatDate(d, 'HH:mm:ss'));
console.log('  formatDate(d, "YYYY-MM-DD HH:mm:ss") =>', formatDate(d, 'YYYY-MM-DD HH:mm:ss'));
console.log('  formatDate(Date.now(), "YYYY-MM-DD")  =>', formatDate(Date.now(), 'YYYY-MM-DD'));

// ─────────────────────────────────────────────────────
// ARRAYS & GENERAL
// ─────────────────────────────────────────────────────
section('Array & General Utilities');

// isEmpty
console.log('  isEmpty(null)       =>', isEmpty(null));
console.log('  isEmpty("")         =>', isEmpty(''));
console.log('  isEmpty([])         =>', isEmpty([]));
console.log('  isEmpty({})         =>', isEmpty({}));
console.log('  isEmpty(0)          =>', isEmpty(0));
console.log('  isEmpty([1, 2])     =>', isEmpty([1, 2]));

// uniqueArray
console.log('\n  uniqueArray([1, 2, 2, 3, 1])     =>', uniqueArray([1, 2, 2, 3, 1]));
console.log('  uniqueArray(["a","b","a","c"])    =>', uniqueArray(['a', 'b', 'a', 'c']));

// chunkArray
console.log('\n  chunkArray([1,2,3,4,5], 2)       =>', JSON.stringify(chunkArray([1, 2, 3, 4, 5], 2)));
console.log('  chunkArray([1,2,3,4,5,6], 3)     =>', JSON.stringify(chunkArray([1, 2, 3, 4, 5, 6], 3)));

// clamp
console.log('\n  clamp(5, 0, 10)   =>', clamp(5, 0, 10));
console.log('  clamp(-5, 0, 10)  =>', clamp(-5, 0, 10));
console.log('  clamp(15, 0, 10)  =>', clamp(15, 0, 10));

console.log('\n✅  All examples ran successfully!\n');
