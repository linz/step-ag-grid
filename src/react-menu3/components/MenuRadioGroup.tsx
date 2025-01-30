import { ForwardedRef, forwardRef, ReactNode, useMemo } from 'react';

import { RadioGroupContext } from '../contexts/RadioGroupContext';
import { useBEM } from '../hooks';
import { BaseProps, EventHandler, RadioChangeEvent } from '../types';
import { menuClass, radioGroupClass } from '../utils';

//
// MenuRadioGroup
// ----------------------------------------------------------------------
export interface MenuRadioGroupProps extends BaseProps {
  /**
   * Optionally set the radio group name.
   *
   * The name will be passed to the `onRadioChange` event.
   * It's useful for identifying radio groups if you attach the same event handler to multiple groups.
   */
  name?: string;
  /**
   * Set value of the radio group.
   *
   * The child menu item which has the same value (strict equality ===) as the
   * radio group is marked as checked.
   */
  value?: any;
  children?: ReactNode;
  /**
   * Event fired when a child menu item is clicked (selected).
   */
  onRadioChange?: EventHandler<RadioChangeEvent>;
}

export const MenuRadioGroupFr = (
  { 'aria-label': ariaLabel, className, name, value, onRadioChange, ...restProps }: MenuRadioGroupProps,
  externalRef: ForwardedRef<HTMLUListElement>,
) => {
  const contextValue = useMemo(() => ({ name, value, onRadioChange }), [name, value, onRadioChange]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <li role="presentation">
        <ul
          role="group"
          aria-label={ariaLabel || name || 'Radio group'}
          {...restProps}
          ref={externalRef}
          className={useBEM({ block: menuClass, element: radioGroupClass, className })}
        />
      </li>
    </RadioGroupContext.Provider>
  );
};

export const MenuRadioGroup = forwardRef(MenuRadioGroupFr);
