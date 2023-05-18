import { isEmpty, negate } from "lodash-es";
import sanitize from "sanitize-filename";

export const isNotEmpty = negate(isEmpty);

export const wait = (timeoutMs: number) =>
  new Promise<(string | null)[]>((resolve) => {
    setTimeout(resolve, timeoutMs);
  });

export const isFloat = (value: string) => {
  const regexp = /^-?\d*(\.\d+)?$/;
  return regexp.test(value);
};

export const findParentWithClass = function (className: string, child: Node): HTMLElement | null {
  for (let node: Node | null = child; node; node = node.parentNode) {
    // When nodes are in portals they aren't type node anymore hence treating it as any here
    if ((node as any).classList && (node as any).classList.contains(className)) {
      return node as HTMLElement;
    }
  }
  return null;
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

export const fnOrVar = (fn: any, param: any) => (typeof fn === "function" ? fn(param) : fn);

/**
 * Trim filename and replaces troublesome characters.
 *
 * e.g. " LT 1235/543 &%//*$ " => "LT_1235-543_&%-$"
 * e.g. " @filename here!!!" => "@filename_here!!!"
 */
export const sanitiseFileName = (filename: string): string =>
  sanitize(filename.trim().replaceAll(/(\/|\\)+/g, "-")).replaceAll(/\s+/g, "_");
