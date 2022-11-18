import { isEmpty, negate } from "lodash-es";

export const isNotEmpty = negate(isEmpty);

export const wait = (timeoutMs: number) =>
  new Promise<(string | null)[]>((resolve) => {
    setTimeout(resolve, timeoutMs);
  });

export const isFloat = (value: string) => {
  const regexp = /^-?\d+(\.\d+)?$/;
  return regexp.test(value);
};

export const hasParentClass = function (className: string, child: Node) {
  for (let node: Node | null = child; node; node = node.parentNode) {
    // When nodes are in portals they aren't type node anymore hence treating it as any here
    if ((node as any).classList && (node as any).classList.contains(className)) {
      return true;
    }
  }
  return false;
};

export const stringByteLengthIsInvalid = (str: string, maxBytes: number) =>
  new TextEncoder().encode(str).length > maxBytes;
