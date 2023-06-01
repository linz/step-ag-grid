import { findIndex } from "lodash-es";
import { unstable_batchedUpdates } from "react-dom";

import { MenuButtonProps } from "../components/MenuButton";
import { MenuState, MenuStateOptions } from "../types";

export const isMenuOpen = (state?: MenuState) => !!state && state[0] === "o";
export const batchedUpdates = unstable_batchedUpdates || ((callback: () => any) => callback());
export const values = Object.values || ((obj: { [x: string]: any }) => Object.keys(obj).map((key) => obj[key]));
export const floatEqual = (a: number, b: number, diff = 0.0001) => Math.abs(a - b) < diff;

export type TransitionMap = {
  open?: boolean;
  close?: boolean;
  item?: boolean;
};
export const getTransition = (transition: MenuStateOptions["transition"], name: keyof TransitionMap) =>
  transition === true || !!(transition && transition[name]);

export function safeCall<T, R>(fn: (arg?: T) => R, arg?: T): R;
export function safeCall<T, R>(fn: T, arg: R): T;
export function safeCall<T, R>(fn: (arg?: T) => R, arg?: T): T | R {
  return typeof fn === "function" ? fn(arg) : fn;
}

const internalKey = "_szhsinMenu";
export const getName = (component: Record<string, any | undefined>) => component[internalKey];
//export const defineName = <T extends any[]>(name: string, component: (...args: T) => JSX.Element) =>
//  Object.defineProperty(component, internalKey, { value: name });

export const defineName = (
  name: string,
  component: React.ForwardRefExoticComponent<React.PropsWithoutRef<MenuButtonProps> & React.RefAttributes<unknown>>,
) => Object.defineProperty(component, internalKey, { value: name });

export const mergeProps = (target: any, source: any) => {
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

export const parsePadding = (paddingStr: string | undefined) => {
  if (paddingStr == null) return { top: 0, right: 0, bottom: 0, left: 0 };

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
      const { overflow, overflowX, overflowY } = thisWindow.getComputedStyle(node);
      if (/auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)) return node;
    }
  }
  return null;
};

export function commonProps(isDisabled?: boolean, isHovering?: boolean) {
  return {
    "aria-disabled": isDisabled || undefined,
    tabIndex: isHovering ? 0 : -1,
  };
}

export const indexOfNode = (nodeList: NodeListOf<Node>, node: Node) => findIndex(nodeList, node);

export const focusFirstInput = (container: any) => {
  // We can't use instanceof Element in portals, so I use querySelectorAll as a proxy here
  if (!container || !("querySelectorAll" in container)) return false;
  const inputs = container.querySelectorAll("input[type='text'],input:not([type]),textarea");
  const input = inputs[0];
  // Using focus as proxy for HTMLElement
  if (!input || !("focus" in input)) return false;
  input.focus();
  // Text areas should start at end
  // this is a proxy for instanceof HTMLTextAreaElement
  if (["textarea", "text"].includes(input.type)) {
    input.setSelectionRange(0, input.value.length);
  }
  return true;
};
