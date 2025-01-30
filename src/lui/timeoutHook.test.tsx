import { render } from '@testing-library/react';

import { useTimeoutHook } from './timeoutHook';

describe('useTimeoutHook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const TestComponent = (props: { callback: () => void; repeat?: number }) => {
    const timeoutHook = useTimeoutHook();
    for (let i = 0; i < (props.repeat ?? 1); i++) {
      timeoutHook(() => props.callback(), 1000);
    }
    return <div />;
  };

  test('invokes on timeout', () => {
    const callback = jest.fn();

    render(<TestComponent callback={callback} />);
    expect(callback).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('invokes once on double invocation', () => {
    const callback = jest.fn();

    render(<TestComponent callback={callback} repeat={2} />);
    expect(callback).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
