import { ForwardedRef, forwardRef, ReactNode, useContext, useRef, useState } from "react";
import { useBEM, useLayoutEffect, useCombinedRef } from "../hooks";
import { menuClass, menuGroupClass } from "../utils";
import { BaseProps, MenuOverflow } from "../types";
import { MenuListContext } from "../contexts/MenuListContext";

export interface MenuGroupProps extends BaseProps {
  children?: ReactNode;
  /**
   * Set `true` to apply overflow of the parent menu to the group.
   * Only one `MenuGroup` in a menu should set this prop as `true`.
   */
  takeOverflow?: boolean;
}

export const MenuGroupFr = (
  { className, style, takeOverflow, ...restProps }: MenuGroupProps,
  externalRef: ForwardedRef<HTMLDivElement>,
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowStyle, setOverflowStyle] = useState<{ maxHeight?: number; overflow?: MenuOverflow }>();
  const { overflow, overflowAmt } = useContext(MenuListContext);

  useLayoutEffect(() => {
    let maxHeight;
    if (takeOverflow && overflowAmt != null && overflowAmt >= 0 && ref.current) {
      // FIXME Matt added && ref.current
      maxHeight = ref.current.getBoundingClientRect().height - overflowAmt;
      if (maxHeight < 0) maxHeight = 0;
    }
    setOverflowStyle(maxHeight != null && maxHeight >= 0 ? { maxHeight, overflow } : undefined);
  }, [takeOverflow, overflow, overflowAmt]);

  useLayoutEffect(() => {
    if (overflowStyle && ref.current) ref.current.scrollTop = 0;
  }, [overflowStyle]);

  return (
    <div
      {...restProps}
      ref={useCombinedRef(externalRef, ref)} // TODO wierd refs
      className={useBEM({ block: menuClass, element: menuGroupClass, className })}
      style={{ ...style, ...overflowStyle }}
    />
  );
};

export const MenuGroup = forwardRef(MenuGroupFr);
