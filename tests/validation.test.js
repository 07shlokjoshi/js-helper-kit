import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../src/validation.js';

describe('isValidEmail', () => {
  // Valid emails
  it('accepts standard email formats', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user.name@example.com')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
    expect(isValidEmail('user-name@example.com')).toBe(true);
    expect(isValidEmail('user_name@example.com')).toBe(true);
    expect(isValidEmail('user123@example.com')).toBe(true);
    expect(isValidEmail('123user@example.com')).toBe(true);
  });

  it('accepts subdomains', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true);
    expect(isValidEmail('user@sub.domain.co.uk')).toBe(true);
    expect(isValidEmail('name+tag@sub.domain.org')).toBe(true);
  });

  it('accepts various TLDs', () => {
    expect(isValidEmail('user@example.io')).toBe(true);
    expect(isValidEmail('user@example.co')).toBe(true);
    expect(isValidEmail('user@example.museum')).toBe(true);
  });

  // Invalid emails
  it('rejects missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
    expect(isValidEmail('noatsign')).toBe(false);
  });

  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('rejects missing TLD', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });

  it('rejects multiple @ symbols', () => {
    expect(isValidEmail('user@@example.com')).toBe(false);
    expect(isValidEmail('u@ser@example.com')).toBe(false);
  });

  it('rejects leading whitespace', () => {
    expect(isValidEmail(' user@example.com')).toBe(false);
  });

  it('rejects trailing whitespace', () => {
    expect(isValidEmail('user@example.com ')).toBe(false);
  });

  it('rejects internal whitespace', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
    expect(isValidEmail('user@ example.com')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  // Non-string inputs
  it('returns false for null', () => {
    expect(isValidEmail(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isValidEmail(undefined)).toBe(false);
  });

  it('returns false for numbers', () => {
    expect(isValidEmail(42)).toBe(false);
    expect(isValidEmail(0)).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isValidEmail(['user@example.com'])).toBe(false);
  });

  it('returns false for objects', () => {
    expect(isValidEmail({})).toBe(false);
    expect(isValidEmail({ email: 'user@example.com' })).toBe(false);
  });

  it('returns false for booleans', () => {
    expect(isValidEmail(true)).toBe(false);
    expect(isValidEmail(false)).toBe(false);
  });

  // Boundary conditions
  it('rejects email exceeding 254 characters', () => {
    const longLocal = 'a'.repeat(245);
    const email = `${longLocal}@example.com`; // > 254 chars
    expect(isValidEmail(email)).toBe(false);
  });

  it('rejects TLD shorter than 2 chars', () => {
    expect(isValidEmail('user@example.c')).toBe(false);
  });
});
