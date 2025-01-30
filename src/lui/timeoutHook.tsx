import { useCallback, useEffect, useRef } from 'react';

/**
 * Cancels timeouts on scope being destroyed.
 *
 * This could almost be a debounce, but debounce tracks by function reference, this tracks by hook reference.
 * This could have been implemented using debounce if the callers function was wrapped in useCallback,
 * but there's no way to enforce that, so  it would lead to bugs.
 */
export const useTimeoutHook = () => {
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  /**
   * Clear any pending timeouts.
   */
  const clearTimeouts = () => {
    if (timeout.current) {
      const tc = timeout.current;
      timeout.current = undefined;
      clearTimeout(tc);
    }
  };

  /**
   * Call this when your action has completed.
   */
  const invoke = useCallback((fn: () => void, waitTimeMs: number) => {
    clearTimeouts();
    timeout.current = setTimeout(fn, waitTimeMs);
  }, []);

  /**
   * Clear timeout on loss of scope.
   */
  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  return invoke;
};

interface IntervalHookProps {
  timeoutMs: number;
  callback: () => void;
}

export const useIntervalHook = ({ callback, timeoutMs }: IntervalHookProps) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const interval = setInterval(() => {
      callbackRef.current && callbackRef.current();
    }, timeoutMs);
    return () => {
      clearInterval(interval);
    };
  }, [timeoutMs]);
};
