import { ValueFormatterParams } from 'ag-grid-community';
import { describe, expect, test } from 'vitest';

import { downloadCsvUseValueFormattersProcessCellCallback as Dpcc } from './GridContextProvider';

describe('downloadCsvUseValueFormattersProcessCellCallback', () => {
  test('each type of value for conversion to string', () => {
    expect(Dpcc({ value: undefined } as any)).toBe('');
    expect(Dpcc({ value: '-' } as any)).toBe('');
    expect(Dpcc({ value: '–' } as any)).toBe('');
    expect(Dpcc({ value: null } as any)).toBe('');
    expect(Dpcc({ value: false } as any)).toBe('false');
    expect(Dpcc({ value: 'x' } as any)).toBe('x');
    expect(Dpcc({ value: 123 } as any)).toBe('123');
    expect(Dpcc({ value: { a: 2 } } as any)).toBe('{"a":2}');
    expect(Dpcc({ value: { a: 2 }, column: { getColDef: () => undefined } } as any)).toBe('{"a":2}');
    expect(Dpcc({ value: { a: 2 }, column: { getColDef: () => ({ valueFormatter: undefined }) } } as any)).toBe(
      '{"a":2}',
    );
    expect(
      Dpcc({
        value: { a: 2 },
        column: { getColDef: () => ({ valueFormatter: 'registeredValueFormatter' }) },
      } as any),
    ).toBe('{"a":2}');

    expect(
      Dpcc({
        value: { a: 2 },
        column: {
          getColDef: () => ({
            valueFormatter: (params: ValueFormatterParams) => {
              return 'xxx' + params.value.a;
            },
          }),
        },
      } as any),
    ).toBe('xxx2');
  });
});
