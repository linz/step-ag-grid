import { MutableRefObject } from "react";
import { useLayoutEffect } from "./useIsomorphicLayoutEffect";

export const useItemEffect = (
  isDisabled: boolean | undefined,
  itemRef: MutableRefObject<any>,
  updateItems: (item: any, isMounted?: boolean) => void,
) => {
  useLayoutEffect(() => {
    if (process.env.NODE_ENV !== "production" && !updateItems) {
      throw new Error(
        `[React-Menu] This menu item or submenu should be rendered under a menu: ${itemRef.current.outerHTML}`,
      );
    }
    if (isDisabled) return;
    const item = itemRef.current;
    updateItems(item, true);
    return () => {
      updateItems(item);
    };
  }, [isDisabled, itemRef, updateItems]);
};
