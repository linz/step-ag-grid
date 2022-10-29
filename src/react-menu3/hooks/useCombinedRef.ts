import { Ref, MutableRefObject, useMemo } from "react";

// Adapted from material-ui
// https://github.com/mui-org/material-ui/blob/f996027d00e7e4bff3fc040786c1706f9c6c3f82/packages/material-ui-utils/src/useForkRef.ts

const setRef = <T>(
  ref: MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  instance: T | null,
) => {
  if (typeof ref === "function") {
    ref(instance);
  } else if (ref) {
    ref.current = instance;
  }
};

export const useCombinedRef = <Instance>(
  refA: Ref<Instance> | null | undefined,
  refB: Ref<Instance> | null | undefined,
): Ref<Instance> | null | undefined => {
  return useMemo(() => {
    if (!refA) return refB;
    if (!refB) return refA;

    return (instance) => {
      setRef(refA, instance);
      setRef(refB, instance);
    };
  }, [refA, refB]);
};
