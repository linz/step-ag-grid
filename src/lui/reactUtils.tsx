import { useEffect, useRef } from "react";

/**
 * Track previous values of states.
 *
 * @param value Value to track.
 */
export const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
