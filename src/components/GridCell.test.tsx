import { describe, expect, test } from 'vitest';

import { defaultValueFormatter, generateFilterGetter } from './GridCell';

describe('GridCell', () => {
  test('defaultValueFormatter', () => {
    expect(defaultValueFormatter({ value: null } as any)).toBe('–');
    expect(defaultValueFormatter({ value: undefined } as any)).toBe('–');
    expect(defaultValueFormatter({ value: 'a' } as any)).toBe('a');
    expect(defaultValueFormatter({ value: 1 } as any)).toBe('1');
    expect(defaultValueFormatter({ value: false } as any)).toBe('false');
    expect(defaultValueFormatter({ value: { x: 1 } } as any)).toBe('{"x":1}');
  });

  test('generateFilterGetter', () => {
    expect(generateFilterGetter(undefined)).toBeUndefined();
    expect(generateFilterGetter('x')).toBeUndefined();
    const fn = generateFilterGetter((props) => {
      return String(props.value);
    });
    expect(fn).toBeTypeOf('function');
    if (typeof fn !== 'function') {
      return;
    }
    expect(
      fn({
        value: 'x',
        colDef: { colId: 'col1' },
        node: undefined!,
        data: undefined!,
        column: undefined!,
        api: undefined!,
        context: undefined,
      }),
    ).toBe('x');
  });
});
