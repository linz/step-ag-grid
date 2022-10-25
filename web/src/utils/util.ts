import { isEmpty as _isEmpty } from "lodash-es";

// Typed version of lodash !isEmpty
export const isNotEmpty = (obj: Set<any> | Map<any, any> | Record<any, any> | any[] | undefined): boolean =>
  !_isEmpty(obj);

export const wait = (timeoutMs: number) =>
  new Promise<(string | null)[]>((resolve) => {
    setTimeout(resolve, timeoutMs);
  });

export const isFloat = (value: string) => {
  const regexp = /^-?\d+(\.\d+)?$/;
  return regexp.test(value);
};

export const hasParentClass = function (className: string, child: Node) {
  let node: Node | null = child;
  while (node) {
    if (node instanceof Node && node instanceof HTMLElement && node.classList.contains(className)) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};
