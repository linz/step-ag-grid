import { forwardRef, LegacyRef, ReactNode, useMemo } from "react";
import { useBEM } from "../hooks";
import { menuButtonClass } from "../utils";
import { BaseProps, MenuButtonModifiers } from "../types";

export interface MenuButtonProps extends BaseProps<MenuButtonModifiers> {
  disabled?: boolean;
  children?: ReactNode;

  // FIXME Matt added, seems to be an internal thing
  isOpen?: boolean;
}

export const MenuButton = forwardRef(function MenuButton(
  { className, isOpen, disabled, children, ...restProps }: MenuButtonProps,
  ref: LegacyRef<HTMLButtonElement>,
) {
  const modifiers = useMemo(() => ({ open: isOpen }), [isOpen]);

  return (
    <button
      aria-haspopup
      aria-expanded={isOpen}
      aria-disabled={disabled || undefined}
      type="button"
      disabled={disabled}
      {...restProps}
      ref={ref}
      className={useBEM({ block: menuButtonClass, modifiers, className })}
    >
      {children}
    </button>
  );
});
