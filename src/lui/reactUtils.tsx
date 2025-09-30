import { useEffect, useRef } from 'react';

/**
 * Track previous values of states.
 *
 * @param value Value to track.
 */
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * Dump prop differences for components between renders.
 */
export const usePropMonitor = (what: string, props: NonNullable<unknown>) => {
  const prev = usePrevious(props);
  useEffect(() => {
    if (prev) {
      let first = true;
      Object.keys(props).forEach((p) => {
        // @ts-expect-error any type
        if (props[p] !== prev[p]) {
          if (first) {
            // eslint-disable-next-line no-console
            console.log('--- props changed -----');
            first = false;
          }
          // eslint-disable-next-line no-console
          console.log(`${what} key: ${p} changed`);
        }
      });
    }
  }, [prev, props, what]);
};
