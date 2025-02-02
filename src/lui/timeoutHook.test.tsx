import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { useTimeoutHook } from './timeoutHook';

describe('useTimeoutHook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const TestComponent = (props: { callback: () => void; repeat?: number }) => {
    const timeoutHook = useTimeoutHook();
    for (let i = 0; i < (props.repeat ?? 1); i++) {
      timeoutHook(() => props.callback(), 1000);
    }
    return <div />;
  };

  test('invokes on timeout', () => {
    const callback = vi.fn();

    render(<TestComponent callback={callback} />);
    expect(callback).toHaveBeenCalledTimes(0);
    vi.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('invokes once on double invocation', () => {
    const callback = vi.fn();

    render(<TestComponent callback={callback} repeat={2} />);
    expect(callback).toHaveBeenCalledTimes(0);
    vi.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
