import { memo, forwardRef, ForwardedRef, ReactNode } from "react";
import { useBEM } from "../hooks";
import { menuClass, menuHeaderClass } from "../utils";
import { BaseProps } from "../types";

export const MenuHeaderFr = (
  // STRANGE baseprops excludes children, so I had to add it back here
  { className, ...restProps }: BaseProps & { children?: JSX.Element },
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
