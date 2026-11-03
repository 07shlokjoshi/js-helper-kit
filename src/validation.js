/**
 * @module validation
 * Input validation utilities.
 */

/**
 * A practical email address validator.
 *
 * Uses a regex that covers the vast majority of real-world email addresses.
 * This is intentionally not a full RFC 5321/5322 implementation — full RFC
 * compliance would accept unusual forms like `"spaces in quotes"@example.com`
 * that most systems reject. This validator covers standard business and
 * personal email formats.
 *
 * **What it checks:**
 * - Non-empty local part (before `@`): alphanumeric, dots, hyphens, plus, underscore.
 * - Exactly one `@` character.
 * - Domain with at least one dot.
 * - TLD of 2–63 characters.
 * - Leading/trailing whitespace is rejected (use `.trim()` before calling if needed).
 *
 * **What it does NOT check:**
 * - Whether the domain actually exists.
 * - Full RFC 5321 quoted strings, IP-address literals, etc.
 *
 * @param {*} email - The value to test.
 * @returns {boolean} `true` if `email` looks like a valid email address, `false` otherwise.
 *
 * @example
 * isValidEmail('user@example.com')        // => true
 * isValidEmail('name+tag@sub.domain.org') // => true
 * isValidEmail('bad@')                    // => false
 * isValidEmail(null)                      // => false
 * isValidEmail('  user@example.com ')     // => false (has whitespace)
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length === 0) return false;
  // Reject leading/trailing whitespace explicitly
  if (email !== email.trim()) return false;

  // Max length per RFC (practical limit)
  if (email.length > 254) return false;

  const emailRegex =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+\-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,63}$/u;

  return emailRegex.test(email);
}
