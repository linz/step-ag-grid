
import { unstable_batchedUpdates } from "react-dom";

export const isMenuOpen = (state: string | undefined) => !!state && state[0] === "o";
export const batchedUpdates = unstable_batchedUpdates || ((callback: () => any) => callback());
export const values = Object.values || ((obj: { [x: string]: any; }) => Object.keys(obj).map((key) => obj[key]));
export const floatEqual = (a: number, b: number, diff = 0.0001) => Math.abs(a - b) < diff;
export const getTransition = (transition: boolean | Record<string, string>, name: string) =>
  transition === true || !!(transition && transition[name]);
export const safeCall = <T, R>(fn: (arg: T) => R, arg: T): (T | R) => (typeof fn === "function" ? fn(arg) : fn);

const internalKey = "_szhsinMenu";
export const getName = (component: Record<string, any | undefined>) => component[internalKey];
export const defineName = (name: string, component: Record<string, any | undefined>) => Object.defineProperty(component, internalKey, { value: name });

export const mergeProps = (target: Record<string, any>, source: Record<string, any>) => {
  source &&
    Object.keys(source).forEach((key) => {
      const targetProp = target[key];
      const sourceProp = source[key];
      if (typeof sourceProp === "function" && targetProp) {
        target[key] = (...arg: any[]) => {
          sourceProp(...arg);
          targetProp(...arg);
        };
      } else {
        target[key] = sourceProp;
      }
    });

  return target;
};

export const parsePadding = (paddingStr: any) => {
  if (typeof paddingStr !== "string") return { top: 0, right: 0, bottom: 0, left: 0 };

  const padding = paddingStr.trim().split(/\s+/, 4).map(parseFloat);
  const top = !isNaN(padding[0]) ? padding[0] : 0;
  const right = !isNaN(padding[1]) ? padding[1] : top;
  return {
    top,
    right,
    bottom: !isNaN(padding[2]) ? padding[2] : top,
    left: !isNaN(padding[3]) ? padding[3] : right,
  };
};

// Adapted from https://github.com/popperjs/popper-core/tree/v2.9.1/src/dom-utils
export const getScrollAncestor = (node: Node | null): Element | null => {
  const thisWindow = (node?.ownerDocument ?? document).defaultView ?? window;
  while (node) {
    node = node.parentNode;
    if (!node || node === thisWindow?.document?.body) return null;
    if (node instanceof Element) {
      const {overflow, overflowX, overflowY} = thisWindow.getComputedStyle(node);
      if (/auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)) return node;
    }
  }
  return null;
};

export function commonProps(isDisabled: boolean, isHovering: boolean) {
  return {
    "aria-disabled": isDisabled || undefined,
    tabIndex: isHovering ? 0 : -1,
  };
}

export function indexOfNode(nodeList: Node[], node: Node) {
  return nodeList.indexOf(node);
}
