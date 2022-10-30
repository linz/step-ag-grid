import { ForwardedRef, forwardRef, ReactNode, useMemo } from "react";
import { useBEM } from "../hooks";
import { menuClass, radioGroupClass, RadioGroupContext } from "../utils";
import { BaseProps, Event, EventHandler } from "../index";

export interface RadioChangeEvent extends Event {
  /**
   * The `name` prop passed to the `MenuRadioGroup` when the menu item is in a radio group.
   */
  name?: string;
  /**
   * Set this property on event object to control whether to keep menu open after menu item is activated.
   * Leaving it `undefined` will behave in accordance with WAI-ARIA Authoring Practices.
   */
  keepOpen?: boolean;
  /**
   * Setting this property on event object to `true` will skip `onItemClick` event on root menu component.
   */
  stopPropagation?: boolean;
  /**
   * DOM event object (React synthetic event)
   */
  syntheticEvent: MouseEvent | KeyboardEvent;
}

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
  { "aria-label": ariaLabel, className, name, value, onRadioChange, ...restProps }: MenuRadioGroupProps,
  externalRef: ForwardedRef<HTMLUListElement>,
) => {
  const contextValue = useMemo(() => ({ name, value, onRadioChange }), [name, value, onRadioChange]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <li role="presentation">
        <ul
          role="group"
          aria-label={ariaLabel || name || "Radio group"}
          {...restProps}
          ref={externalRef}
          className={useBEM({ block: menuClass, element: radioGroupClass, className })}
        />
      </li>
    </RadioGroupContext.Provider>
  );
};

export const MenuRadioGroup = forwardRef(MenuRadioGroupFr) as any as typeof MenuRadioGroupFr;
