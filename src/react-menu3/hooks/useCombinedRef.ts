import { ForwardedRef, LegacyRef, useMemo } from "react";

// Adapted from material-ui
// https://github.com/mui-org/material-ui/blob/f996027d00e7e4bff3fc040786c1706f9c6c3f82/packages/material-ui-utils/src/useForkRef.ts

const setRef = <T>(ref: ForwardedRef<T> | undefined, instance: T | null) => {
  if (typeof ref === "function") {
    ref(instance);
  } else if (ref) {
    ref.current = instance;
  }
};

export const useCombinedRef = <Instance>(
  refA: ForwardedRef<Instance> | undefined,
  refB: ForwardedRef<Instance> | undefined,
): LegacyRef<Instance> => {
  return useMemo(() => {
    return (instance: any) => {
      setRef(refA, instance);
      setRef(refB, instance);
    };
  }, [refA, refB]);
};
