import { isEmpty, negate } from "lodash-es";
import sanitize from "sanitize-filename";

export const isNotEmpty = negate(isEmpty);

export const wait = (timeoutMs: number) =>
  new Promise<(string | null)[]>((resolve) => {
    setTimeout(resolve, timeoutMs);
  });

const isFloatRegExp = /^-?\d*\.?\d*$/;
export const isFloat = (value: string) => {
  try {
    if (Number.isNaN(parseFloat(value))) {
      return false;
    }
    // Just checking it's not scientific notation here.
    // Also parse float will parse up to the first invalid character,
    // so we need to check there's no remaining invalids e.g. "1.2xyz" would parse as 1.2
    return isFloatRegExp.test(value);
  } catch {
    return false;
  }
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
