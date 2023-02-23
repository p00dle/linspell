import { describe, test, expect } from 'vitest';
import { has, indexOf, insert } from './sorted-array';

describe('indexOf', () => {
  test('finds element in an even length array', () => {
    expect(indexOf([0, 1, 2, 3], 0)).toBe(0);
    expect(indexOf([0, 1, 2, 3], 1)).toBe(1);
    expect(indexOf([0, 1, 2, 3], 2)).toBe(2);
    expect(indexOf([0, 1, 2, 3], 3)).toBe(3);
  });
  test('finds element in an odd length array', () => {
    expect(indexOf([0, 1, 2], 0)).toBe(0);
    expect(indexOf([0, 1, 2], 1)).toBe(1);
    expect(indexOf([0, 1, 2], 2)).toBe(2);
  });
  test('works with strings', () => {
    expect(indexOf(['a', 'b', 'c', 'd'], 'a')).toBe(0);
    expect(indexOf(['a', 'b', 'c', 'd'], 'd')).toBe(3);
  });
  test('returns -1 if element is not found', () => {
    expect(indexOf(['b', 'd'], 'a')).toBe(-1);
    expect(indexOf(['b', 'd'], 'c')).toBe(-1);
    expect(indexOf(['b', 'd'], 'e')).toBe(-1);
  });
});

describe('has', () => {
  test('works with numbers', () => {
    expect(has([0, 1, 2], 1)).toBe(true);
    expect(has([0, 1, 2], 4)).toBe(false);
  });
  test('works with strings', () => {
    expect(has(['a', 'b', 'c'], 'b')).toBe(true);
    expect(has(['a', 'b', 'c'], 'd')).toBe(false);
  });
});

describe('insert', () => {
  test('works with empty array', () => {
    const array: string[] = [];
    insert(array, 'a');
    expect(array).toEqual(['a']);
  });
  test('inserts element at the beginning', () => {
    const array: string[] = ['b', 'd'];
    insert(array, 'a');
    expect(array).toEqual(['a', 'b', 'd']);
  });
  test('inserts element in the middle', () => {
    const array: string[] = ['b', 'd'];
    insert(array, 'c');
    expect(array).toEqual(['b', 'c', 'd']);
  });
  test('inserts element at the end', () => {
    const array: string[] = ['b', 'd'];
    insert(array, 'e');
    expect(array).toEqual(['b', 'd', 'e']);
  });
  test('returns correct index of inserted element', () => {
    expect(insert(['b', 'd'], 'a')).toBe(0);
    expect(insert(['b', 'd'], 'c')).toBe(1);
    expect(insert(['b', 'd'], 'e')).toBe(2);
    expect(insert(['b', 'c', 'd'], 'e')).toBe(3);
  });
});
