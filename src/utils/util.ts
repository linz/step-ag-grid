import { isEmpty, negate } from 'lodash-es';
import natsort from 'natsort';

export type MaybePromise<T> = T | Promise<T>;

export const isNotEmpty = negate(isEmpty);

export const wait = (timeoutMs: number) =>
  new Promise<(string | null)[]>((resolve) => {
    setTimeout(resolve, timeoutMs);
  });

// This regexp only works if you parseFloat first, it won't validate a float on its own
// It prevents scientific 1e10, or trailing decimal 1.2.3, or trailing garbage 1.2xyz
const isFloatRegExp = /^-?\d*\.?\d*$/;
export const isFloat = (value: string) => {
  try {
    // Just checking it's not scientific notation or "NaN" here.
    // Also parse float will parse up to the first invalid character,
    // so we need to check there's no remaining invalids e.g. "1.2xyz" would parse as 1.2
    return !Number.isNaN(parseFloat(value)) && isFloatRegExp.test(value);
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

export const fnOrVar = (fn: any, param?: any) => (typeof fn === 'function' ? fn(param) : fn);

export const sanitiseFileName = (filename: string): string => {
  const valid = filename
    .trim()
    .replaceAll(/(\/|\\)+/g, '-')
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\w\-āēīōūĀĒĪŌŪ.]/g, '');
  const parts = valid.split('.');
  const fileExt = parts.length > 1 ? parts.pop() : undefined;
  // Arbitrary max filename length of 64 chars + extension
  if (!fileExt) return valid.slice().slice(0, 64);
  return valid.slice(0, -fileExt.length - 1).slice(0, 64) + '.' + fileExt;
};

const naturalSortInsensitive = natsort({ insensitive: true });
const santitizeNaturalValue = (v: string | number | null | undefined): string => {
  if (v === '–' || v === '-' || v == null) {
    return '';
  }
  return String(v);
};
export const compareNaturalInsensitive = (
  a?: object | string | number | null,
  b?: object | string | number | null,
): number => {
  if ((a !== null && typeof a === 'object') || (b !== null && typeof b === 'object')) {
    // We can't compare objects
    return 0;
  }
  return naturalSortInsensitive(santitizeNaturalValue(a), santitizeNaturalValue(b));
};
