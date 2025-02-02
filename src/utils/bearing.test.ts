import { describe, expect, test, vi } from 'vitest';

import {
  bearingCorrectionRangeValidator,
  bearingRangeValidator,
  bearingStringValidator,
  convertDDToDMS,
} from './bearing';

describe('bearing', () => {
  test('convertDDToDMS converts decimal-ish degrees to DMS', () => {
    expect(convertDDToDMS(-0.001, false)).toBe('-0° 00\' 10"');
    expect(convertDDToDMS(-10.001, false)).toBe('-10° 00\' 10"');
    expect(convertDDToDMS(-370.001, false)).toBe('-10° 00\' 10"');
    expect(convertDDToDMS(359.595999, false, 2)).toBe("0° 00'");
    expect(convertDDToDMS(359.595999, false, 4)).toBe('0° 00\' 00"');
    expect(convertDDToDMS(359.595999, false, 5)).toBe('0° 00\' 00.0"');
    expect(convertDDToDMS(369.696999, false)).toBe('10° 10\' 10"');
    expect(convertDDToDMS(369.696999, false, 4)).toBe('10° 10\' 10"');
    expect(convertDDToDMS(221.555999, false, 2)).toBe("221° 56'");
    expect(convertDDToDMS(221.555999, false, 5)).toBe('221° 56\' 00.0"');
    expect(convertDDToDMS(5, true, 5)).toBe('+5° 00\' 00.0"');
    expect(convertDDToDMS(5.0, true, 5)).toBe('+5° 00\' 00.0"');
    expect(convertDDToDMS(5.00001, true, 5)).toBe('+5° 00\' 00.1"');
    expect(convertDDToDMS(5.1, true, 5)).toBe('+5° 10\' 00.0"');
    expect(convertDDToDMS(5.12345)).toBe('+5° 12\' 34.5"');
    expect(convertDDToDMS(5.12345, false)).toBe('5° 12\' 34.5"');
    expect(convertDDToDMS(5.12345, false, 2)).toBe('5° 12\' 34.5"');
    expect(convertDDToDMS(300, true, 5)).toBe('+300° 00\' 00.0"');
    expect(convertDDToDMS(300.0, true, 5)).toBe('+300° 00\' 00.0"');
    expect(convertDDToDMS(300.00001)).toBe('+300° 00\' 00.1"');
    expect(convertDDToDMS(300.1, true, 5)).toBe('+300° 10\' 00.0"');
    expect(convertDDToDMS(300.12345)).toBe('+300° 12\' 34.5"');
    expect(convertDDToDMS(300.12345, false)).toBe('300° 12\' 34.5"');
    expect(convertDDToDMS(300, false, 2)).toBe("300° 00'");
    expect(convertDDToDMS(300.1, false, 2)).toBe("300° 10'");
    expect(convertDDToDMS(0, false, 2)).toBe("0° 00'");
    expect(convertDDToDMS(0.0, false)).toBe("0° 00'");
    expect(convertDDToDMS(0.0, false, 4)).toBe('0° 00\' 00"');
    expect(convertDDToDMS(0.0, false, 5)).toBe('0° 00\' 00.0"');
  });

  test('bearingStringValidator', () => {
    const tests: [string, string | null][] = [
      ['', null],
      ['1', null],
      ['1.2345', null],
      ['-1.2345', null],
      ['360.2345', null],
      ['-360.2345', null],
      ['1.2e6', 'Bearing must be a number in D.MMSSS format'],
      ['0.60000', 'Bearing must be a number in D.MMSSS format'],
      ['0.00600', 'Bearing must be a number in D.MMSSS format'],
      ['0.123456', 'Bearing has a maximum of 5 decimal places'],
    ];

    tests.forEach((test, i) => {
      expect(bearingStringValidator(test[0]), `Test ${i}: "${test[0]}" should return "${test[1]}"`).toBe(test[1]);
    });

    // calls custom invalid
    const fn = vi.fn();
    bearingStringValidator('1.2', fn);
    expect(fn).toHaveBeenCalledWith(1.2);
  });

  test('bearingRangeValidator', () => {
    expect(bearingRangeValidator(0)).toBeNull();
    expect(bearingRangeValidator(359.595999)).toBeNull();
    expect(bearingRangeValidator(-0.00001)).toBe('Bearing must not be negative');
    expect(bearingRangeValidator(360)).toBe('Bearing must be less than 360 degrees');
  });

  test('bearingCorrectionRangeValidator', () => {
    expect(bearingCorrectionRangeValidator(-179.59999)).toBeNull();
    expect(bearingCorrectionRangeValidator(359.59999)).toBeNull();
    expect(bearingCorrectionRangeValidator(-180)).toBe('Bearing correction must be greater then -180 degrees');
    expect(bearingCorrectionRangeValidator(360)).toBe('Bearing correction must be less than 360 degrees');
  });
});
