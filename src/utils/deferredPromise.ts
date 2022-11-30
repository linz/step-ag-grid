import { useRef } from "react";

export const useDeferredPromise = <T>() => {
  const promiseResolve = useRef<((value: T | PromiseLike<T>) => void) | undefined>();
  const promiseReject = useRef<() => void>();

  return {
    invoke: () =>
      new Promise<T>((resolve, reject) => {
        promiseResolve.current = resolve;
        promiseReject.current = reject;
      }),
    resolve: (value: T) => {
      if (!promiseResolve.current) {
        console.error("Promise not invoked so can't resolve");
        return;
      }
      const temp = promiseResolve.current;
      promiseResolve.current = undefined;
      promiseReject.current = undefined;
      temp(value);
    },
    reject: () => {
      if (!promiseResolve.current) {
        console.error("Promise not invoked so can't reject");
        return;
      }
      const reject = promiseReject.current;
      promiseResolve.current = undefined;
      promiseReject.current = undefined;
      if (reject) reject();
    },
  };
};
