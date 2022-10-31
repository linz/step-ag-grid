import { memo, forwardRef, ForwardedRef } from "react";
import { useBEM } from "../hooks";
import { menuClass, menuHeaderClass } from "../utils";
import { BasePropsWithChildren } from "../types";

export const MenuHeaderFr = (
  { className, ...restProps }: BasePropsWithChildren,
  externalRef: ForwardedRef<HTMLLIElement>,
) => {
  return (
    <li
      role="presentation"
      {...restProps}
      ref={externalRef}
      className={useBEM({ block: menuClass, element: menuHeaderClass, className })}
    />
  );
};

export const MenuHeader = memo(forwardRef(MenuHeaderFr));
