/**
 * @module dates
 * Date formatting utilities.
 *
 * **Timezone note:** All formatting uses the LOCAL timezone of the runtime
 * environment (i.e., `date.getFullYear()`, `date.getMonth()`, etc.).
 * To work in UTC, convert your date first or use a dedicated library like
 * `date-fns` or `Temporal`.
 */

/**
 * Formats a Date object using a simple token-based format string.
 *
 * **Supported tokens:**
 * | Token | Description                         | Example  |
 * |-------|-------------------------------------|----------|
 * | YYYY  | 4-digit year                        | 2024     |
 * | MM    | 2-digit month (01–12)               | 03       |
 * | DD    | 2-digit day of month (01–31)        | 07       |
 * | HH    | 2-digit hour, 24-hour clock (00–23) | 14       |
 * | mm    | 2-digit minutes (00–59)             | 05       |
 * | ss    | 2-digit seconds (00–59)             | 09       |
 *
 * Tokens are replaced in the order listed above. Unrecognized characters in
 * the format string are preserved as-is.
 *
 * @param {Date|number|string} date - A `Date` instance, a numeric timestamp
 *   (milliseconds since epoch), or a date string parseable by `new Date()`.
 * @param {string} format - The format string, e.g. `'YYYY-MM-DD'` or
 *   `'DD/MM/YYYY HH:mm:ss'`.
 * @returns {string} The formatted date string.
 * @throws {TypeError} If `date` cannot be resolved to a valid Date.
 * @throws {TypeError} If `format` is not a string.
 * @throws {RangeError} If the date is invalid (e.g., `new Date('invalid')`).
 *
 * @example
 * const d = new Date(2024, 2, 7, 14, 5, 9); // 7 Mar 2024 14:05:09 local
 * formatDate(d, 'YYYY-MM-DD')           // => '2024-03-07'
 * formatDate(d, 'DD/MM/YYYY')           // => '07/03/2024'
 * formatDate(d, 'HH:mm:ss')             // => '14:05:09'
 * formatDate(d, 'YYYY-MM-DD HH:mm:ss') // => '2024-03-07 14:05:09'
 */
export function formatDate(date, format) {
  if (typeof format !== 'string') {
    throw new TypeError(`formatDate: format must be a string, got ${typeof format}`);
  }

  let dateObj;

  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number' || typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    throw new TypeError(
      `formatDate: date must be a Date instance, number, or date string, got ${typeof date}`
    );
  }

  if (isNaN(dateObj.getTime())) {
    throw new RangeError('formatDate: the provided date is invalid');
  }

  const pad = (n) => String(n).padStart(2, '0');

  const tokens = {
    YYYY: String(dateObj.getFullYear()),
    MM: pad(dateObj.getMonth() + 1),
    DD: pad(dateObj.getDate()),
    HH: pad(dateObj.getHours()),
    mm: pad(dateObj.getMinutes()),
    ss: pad(dateObj.getSeconds()),
  };

  // Replace tokens in a single pass using a regex alternation.
  // Order matters: longer tokens must precede shorter ones (YYYY before YY, etc.)
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (token) => tokens[token] ?? token);
}
