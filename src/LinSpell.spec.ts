import { describe, test, expect } from 'vitest';
import { LinSpell } from './LinSpell';

describe('LinSpell', () => {
  test('constructor can take no parameters and words can be added later', () => {
    const checker = new LinSpell();
    checker.provideWords(['bar', 'foo']);
    expect(checker.lookup('foo')).toEqual([true, ['foo']]);
  });
  test('if max distance and suggestion type are not provided in lookup use defaults provided in constructor', () => {
    const checker = new LinSpell({
      words: ['bar', 'foo', '0123456'],
      maxEditDistance: 5,
      suggestionType: 'in-max-distance',
    });
    expect(checker.lookup('foo')).toEqual([true, ['foo', 'bar']]);
  });
  test('returns true if a string is found for non "in-max-distance" suggestion types and all max distances', () => {
    const checker = new LinSpell({ words: ['bar', 'foo'] });
    const matchFound = [true, []];
    expect(checker.lookup('foo', 1, 'top')).toEqual(matchFound);
    expect(checker.lookup('foo', 10, 'top')).toEqual(matchFound);
    expect(checker.lookup('foo', 1, 'smallest-distance')).toEqual(matchFound);
    expect(checker.lookup('foo', 10, 'smallest-distance')).toEqual(matchFound);
  });
  test('returns true as well as all matches for "in-max-distance"', () => {
    const checker = new LinSpell({ words: ['bar', 'foo'] });
    expect(checker.lookup('foo', 1, 'in-max-distance')).toEqual([true, ['foo']]);
    expect(checker.lookup('foo', 10, 'in-max-distance')).toEqual([true, ['foo', 'bar']]);
  });
  test('skip checking distance for strings where delta of lengths exceeds max distance', () => {
    const checker = new LinSpell({ words: ['bar', 'foo', 'averylongstring'] });
    expect(checker.lookup('foob', 2, 'top')).toEqual([false, ['foo']]);
    expect(checker.lookup('foob', 2, 'smallest-distance')).toEqual([false, ['foo']]);
    expect(checker.lookup('foob', 2, 'in-max-distance')).toEqual([false, ['foo']]);
  });
  test('when suggestion type is "top" skip checking distance for subsequent strings when a suggestion with distance of 1 was already found', () => {
    const checker = new LinSpell({ words: ['bar', 'foo', 'baz'] });
    expect(checker.lookup('foob', 2, 'top')).toEqual([false, ['foo']]);
  });
  test('when suggestion type is "top" return empty array when no matches within max distance are found', () => {
    const checker = new LinSpell({ words: ['bar', 'foo', 'baz'] });
    expect(checker.lookup('omg', 1, 'top')).toEqual([false, []]);
  });
  test('when suggestion type is "in-max-distance" return false when there are no suggestions', () => {
    const checker = new LinSpell({ words: ['bar', 'foo', 'baz'] });
    expect(checker.lookup('abc', 1, 'in-max-distance')).toEqual([false, []]);
  });
  test('when suggestion type is not "in-max-distance" replace suggestions if a match with smaller distance is found', () => {
    const checker = new LinSpell({ words: ['bar', 'foo', 'baz'] });
    expect(checker.lookup('foob', 5, 'top')).toEqual([false, ['foo']]);
    expect(checker.lookup('foob', 5, 'smallest-distance')).toEqual([false, ['foo']]);
  });
});
