import { memo, forwardRef, LegacyRef } from "react";
import { useBEM } from "../hooks";
import { menuClass, menuDividerClass } from "../utils";
import { BaseProps } from "../types";

const MenuDividerFr = ({ className, ...restProps }: BaseProps, externalRef: LegacyRef<HTMLLIElement>) => {
  return (
    <li
      role="separator"
      {...restProps}
      ref={externalRef}
      className={useBEM({ block: menuClass, element: menuDividerClass, className })}
    />
  );
};

export const MenuDivider = memo(forwardRef(MenuDividerFr)) as any as typeof MenuDividerFr;
