import { describe, it, expect } from 'vitest';
import { formatDate } from '../src/dates.js';

describe('formatDate', () => {
  // Use a fixed date to avoid timezone ambiguity in tests
  // new Date(year, monthIndex, day, hours, minutes, seconds) — LOCAL time
  const testDate = new Date(2024, 2, 7, 14, 5, 9); // 2024-03-07 14:05:09

  it('formats YYYY-MM-DD correctly', () => {
    expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2024-03-07');
  });

  it('formats DD/MM/YYYY correctly', () => {
    expect(formatDate(testDate, 'DD/MM/YYYY')).toBe('07/03/2024');
  });

  it('formats HH:mm:ss correctly', () => {
    expect(formatDate(testDate, 'HH:mm:ss')).toBe('14:05:09');
  });

  it('formats full datetime string', () => {
    expect(formatDate(testDate, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-03-07 14:05:09');
  });

  it('pads single-digit month with zero', () => {
    const jan = new Date(2024, 0, 5, 0, 0, 0); // January
    expect(formatDate(jan, 'MM')).toBe('01');
  });

  it('pads single-digit day with zero', () => {
    const day3 = new Date(2024, 0, 3, 0, 0, 0);
    expect(formatDate(day3, 'DD')).toBe('03');
  });

  it('pads single-digit hours, minutes, seconds with zeros', () => {
    const d = new Date(2024, 0, 1, 1, 2, 3);
    expect(formatDate(d, 'HH:mm:ss')).toBe('01:02:03');
  });

  it('accepts a numeric timestamp', () => {
    const ts = testDate.getTime();
    expect(formatDate(ts, 'YYYY')).toBe('2024');
  });

  it('accepts a date string', () => {
    // Use ISO string to avoid timezone issues in string parsing
    const iso = '2024-07-15T00:00:00.000Z';
    const result = formatDate(iso, 'YYYY');
    expect(result).toMatch(/^\d{4}$/); // just check it's a 4-digit year
  });

  it('preserves non-token characters in format string', () => {
    expect(formatDate(testDate, '[Date: YYYY/MM/DD]')).toBe('[Date: 2024/03/07]');
  });

  it('handles format string with only literal characters', () => {
    expect(formatDate(testDate, 'hello')).toBe('hello');
  });

  it('formats December correctly (month 12)', () => {
    const dec = new Date(2024, 11, 31, 23, 59, 59);
    expect(formatDate(dec, 'MM-DD-YYYY')).toBe('12-31-2024');
  });

  // Error cases
  it('throws RangeError for an invalid date', () => {
    expect(() => formatDate(new Date('invalid'), 'YYYY-MM-DD')).toThrow(RangeError);
  });

  it('throws RangeError for an invalid date string', () => {
    expect(() => formatDate('not-a-date', 'YYYY')).toThrow(RangeError);
  });

  it('throws TypeError if format is not a string', () => {
    expect(() => formatDate(testDate, null)).toThrow(TypeError);
    expect(() => formatDate(testDate, 42)).toThrow(TypeError);
    expect(() => formatDate(testDate, undefined)).toThrow(TypeError);
  });

  it('throws TypeError for non-date, non-number, non-string date argument', () => {
    expect(() => formatDate(null, 'YYYY')).toThrow(TypeError);
    expect(() => formatDate({}, 'YYYY')).toThrow(TypeError);
    expect(() => formatDate([], 'YYYY')).toThrow(TypeError);
    expect(() => formatDate(true, 'YYYY')).toThrow(TypeError);
  });

  it('handles empty format string', () => {
    expect(formatDate(testDate, '')).toBe('');
  });
});
