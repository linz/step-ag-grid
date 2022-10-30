import { memo, forwardRef } from "react";
import { useBEM } from "../hooks";
import { menuClass, menuDividerClass } from "../utils";
import { BaseProps } from "../index";

const MenuDividerFr = ({ className, ...restProps }: BaseProps, externalRef) => {
  return (
    <li
      role="separator"
      {...restProps}
      ref={externalRef}
      className={useBEM({ block: menuClass, element: menuDividerClass, className })}
    />
  );
};

export const MenuDivider = memo(forwardRef(MenuDividerFr));
