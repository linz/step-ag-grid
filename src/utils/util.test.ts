import { describe, expect, test } from 'vitest';

import { isFloat, sanitiseFileName } from './util';
describe('sanitiseFileName', () => {
  test('isFloat', () => {
    expect(isFloat('')).toBe(false);
    expect(isFloat('x')).toBe(false);
    expect(isFloat('1e10')).toBe(false);
    expect(isFloat('1x')).toBe(false);
    expect(isFloat('1.x')).toBe(false);
    expect(isFloat('x.1')).toBe(false);
    expect(isFloat('1')).toBe(true);
    expect(isFloat('1.')).toBe(true);
    expect(isFloat('.1')).toBe(true);
  });
  test('sanitiseFileName', () => {
    expect(sanitiseFileName(' LT 1235/543 &%//*$.csv ')).toBe('LT_1235-543_-.csv');
    expect(sanitiseFileName(' @filename here!!!.csv ')).toBe('filename_here.csv');
    // Trim to 64 char max for non extension part
    expect(sanitiseFileName('long_long_long_long_long_long_long_long_long_long_long_long_long_long_.csv')).toBe(
      'long_long_long_long_long_long_long_long_long_long_long_long_long.csv',
    );
    // Test with no extension
    expect(sanitiseFileName('long_long_long_long_long_long_long_long_long_long_long_long_long_long_')).toBe(
      'long_long_long_long_long_long_long_long_long_long_long_long_long',
    );
    // Test with no name
    expect(sanitiseFileName('.csv')).toBe('.csv');
  });
});
