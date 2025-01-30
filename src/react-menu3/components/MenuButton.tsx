import { forwardRef, LegacyRef, ReactNode, useMemo } from 'react';

import { useBEM } from '../hooks';
import { BaseProps, MenuButtonModifiers } from '../types';
import { menuButtonClass } from '../utils';

export interface MenuButtonProps extends BaseProps<MenuButtonModifiers> {
  disabled?: boolean;
  children?: ReactNode;

  // Seems to be an internal thing, wasn't in original code
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
