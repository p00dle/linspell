import { describe, test, expect } from 'vitest';
import { damerauLevenshteinDistance } from './damerauLevenshteinDistance';

describe('damerauLevenshteinDistance', () => {
  test('returns correct distance', () => {
    // tests copied from https://github.com/olegskl/levenshtein/
    const tests = [
      { a: '', b: '', expected: 0 }, // empty strings, no operations
      { a: 'abc', b: 'abc', expected: 0 }, // equal strings, no operations
      { a: 'a', b: 'b', expected: 1 }, // one substitution
      { a: 'a', b: '', expected: 1 }, // one deletion
      { a: 'aabc', b: 'abc', expected: 1 }, // one deletion
      { a: 'abcc', b: 'abc', expected: 1 }, // one deletion
      { a: '', b: 'a', expected: 1 }, // one insertion
      { a: 'abc', b: 'abcc', expected: 1 }, // one insertion
      { a: 'abc', b: 'aabc', expected: 1 }, // one insertion
      { a: 'teh', b: 'the', expected: 1 }, // 1 transposition
      { a: 'tets', b: 'test', expected: 1 }, // 1 transposition
      { a: 'fuor', b: 'four', expected: 1 }, // 1 transposition
      { a: 'kitten', b: 'sitting', expected: 3 }, // 2 substitutions, 1 insertion
      { a: 'Saturday', b: 'Sunday', expected: 3 }, // 2 deletions, 1 substitution
      { a: 'rosettacode', b: 'raisethysword', expected: 8 }, // 8 operations
    ];
    const errors: { a: string; b: string; expected: number; result: number }[] = [];
    for (const { a, b, expected } of tests) {
      const result = damerauLevenshteinDistance(a, b, 20);
      if (result !== expected) {
        errors.push({ a, b, expected, result });
      }
      const resultReversed = damerauLevenshteinDistance(b, a, 20);
      if (resultReversed !== expected) {
        errors.push({ a: b, b: a, expected, result: resultReversed });
      }
    }
    if (errors.length > 0) {
      console.warn(
        '\n' +
          errors.map((err) => `Expected "${err.a}", "${err.b}" to be ${err.expected} but got ${err.result} `).join('\n')
      );
    }
    expect(errors).toHaveLength(0);
  });
  test('returns length of the non-empty string if the other one is empty', () => {
    expect(damerauLevenshteinDistance('', '1234567890', Infinity)).toBe(10);
    expect(damerauLevenshteinDistance('1234567', '', Infinity)).toBe(7);
  });
  test('optimizes compare by removing matching suffixes and prefixes', () => {
    expect(damerauLevenshteinDistance('barfoo', 'foo', Infinity)).toBe(3);
    expect(damerauLevenshteinDistance('foo', 'barfoo', Infinity)).toBe(3);
    expect(damerauLevenshteinDistance('barfoo', 'bar', Infinity)).toBe(3);
    expect(damerauLevenshteinDistance('bar', 'barfoo', Infinity)).toBe(3);
  });
  test('if maxEditDistance is set to -1 there is no limit', () => {
    expect(damerauLevenshteinDistance('abc', '1234567890', -1)).toBe(10);
  });
  test('returns -1 when max distance is exceeded', () => {
    expect(damerauLevenshteinDistance('foo', 'abc', 1)).toBe(-1);
  });
  test('returns -1 when length difference between strings exceeds max distance', () => {
    expect(damerauLevenshteinDistance('foo', 'abcdef', 1)).toBe(-1);
  });
});
