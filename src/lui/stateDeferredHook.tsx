import { useCallback, useRef, useState } from "react";
import { useTimeoutHook } from "./timeoutHook";

/**
 * Defers state change up to a minimum time since last state change.
 */
export const useStateDeferred = <T extends unknown>(
  initialValue: T,
): [T, (v: T) => void, (v: T, w: number) => void] => {
  const startTime = useRef<number>(0);
  const timeoutHook = useTimeoutHook();

  const [value, _setValue] = useState(initialValue);

  const setValue = useCallback((newValue: T) => {
    startTime.current = Date.now();
    _setValue(newValue);
  }, []);

  const setValueDeferred = useCallback(
    (newValue: T, minimumWaitTimeMs: number) => {
      const waitTimeMs = Math.max(minimumWaitTimeMs - (Date.now() - startTime.current), 0);
      timeoutHook(() => _setValue(newValue), waitTimeMs);
    },
    [timeoutHook],
  );

  return [value, setValue, setValueDeferred];
};
