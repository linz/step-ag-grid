import { MutableRefObject } from "react";
import { useLayoutEffect } from "./useIsomorphicLayoutEffect";

export const useItemEffect = (
  isDisabled: boolean | undefined,
  menuItemRef: MutableRefObject<any> | undefined,
  updateItems: (item: any, isMounted?: boolean) => void,
) => {
  useLayoutEffect(() => {
    if (!menuItemRef) return;
    if (process.env.NODE_ENV !== "production" && !updateItems) {
      throw new Error(
        `[React-Menu] This menu item or submenu should be rendered under a menu: ${menuItemRef.current.outerHTML}`,
      );
    }
    if (isDisabled) return;
    const item = menuItemRef.current;
    updateItems(item, true);
    return () => {
      updateItems(item);
    };
  }, [isDisabled, menuItemRef, updateItems]);
};
