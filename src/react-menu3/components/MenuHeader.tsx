import { memo, forwardRef, ForwardedRef } from "react";
import { useBEM } from "../hooks";
import { menuClass, menuHeaderClass } from "../utils";
import { BaseProps } from "../types";

export const MenuHeaderFr = ({ className, ...restProps }: BaseProps, externalRef: ForwardedRef<HTMLLIElement>) => {
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
