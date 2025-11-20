import { isEmpty, negate } from 'lodash-es';
import natsort from 'natsort';

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

export const genericLocaleCompare = (value1: unknown, value2: unknown): number | null => {
  if (value1 == null && value2 == null) {
    return 0;
  }
  if (value1 != null && value2 == null) {
    return 1;
  }
  if (value1 == null && value2 != null) {
    return -1;
  }

  if (typeof value1 === 'number' && typeof value2 === 'number') {
    return value1 - value2;
  }
  if (typeof value1 === 'string' && typeof value2 === 'string') {
    return compareNaturalInsensitive(value1, value2);
  }

  return null;
};

const naturalSortInsensitive = natsort({ insensitive: true });
export const compareNaturalInsensitive = (a?: string | null, b?: string | null): number =>
  naturalSortInsensitive(a ?? '', b ?? '');
