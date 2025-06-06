import { KeyboardEvent, Ref, useContext, useMemo } from 'react';

import { EventHandlersContext } from '../contexts/EventHandlersContext';
import { RadioGroupContext } from '../contexts/RadioGroupContext';
import { useBEM, useCombinedRef, useItemState } from '../hooks';
import { BaseProps, ClickEvent, EventHandler, Hoverable, MenuItemTypeProp, RenderProp } from '../types';
import { commonProps, Keys, menuClass, menuItemClass, mergeProps, RMEvent, safeCall, withHovering } from '../utils';
import { withHoveringResultProps } from '../utils/withHovering';

//
// MenuItem
// ----------------------------------------------------------------------
export type MenuItemModifiers = Readonly<{
  /**
   * 'radio' for radio item, 'checkbox' for checkbox item, or `undefined` for other items.
   */
  type?: MenuItemTypeProp;
  /**
   * Indicates if the menu item is disabled.
   */
  disabled: boolean;
  /**
   * Indicates if the menu item is being hovered and has focus.
   */
  hover: boolean;
  /**
   * Indicates if the menu item is checked when it's a radio or checkbox item.
   */
  checked: boolean;
  /**
   * Indicates if the menu item has a URL link.
   */
  anchor: boolean;
}>;

export interface MenuItemProps extends Omit<BaseProps<MenuItemModifiers>, 'onClick'>, Hoverable {
  /**
   * Any value provided to this prop will be available in the event object of click events.
   *
   * It's useful for helping identify which menu item is clicked when you
   * listen on `onItemClick` event on root menu component.
   */
  value?: any;
  /**
   * If provided, menu item renders an HTML `<a>` element with this `href` attribute.
   */
  href?: string;
  rel?: string;
  target?: string;
  /**
   * Set this prop to make the item a checkbox or radio menu item.
   */
  type?: MenuItemTypeProp;
  /**
   * Set `true` if a checkbox menu item is checked.
   *
   * *Please note radio menu item doesn't use this prop.*
   */
  checked?: boolean;
  /**
   * Event fired when the menu item is clicked.
   */
  onClick?: EventHandler<ClickEvent>;
  /**
   * Any valid React node or a render function that returns one.
   */
  children?: RenderProp<MenuItemModifiers>;
}

const MenuItemFr = ({
  className,
  value,
  href,
  type,
  checked,
  disabled,
  children,
  onClick,
  isHovering,
  menuItemRef,
  externalRef,
  ...restProps
}: MenuItemProps & withHoveringResultProps) => {
  const isDisabled = !!disabled;
  const { setHover, ...restStateProps } = useItemState(menuItemRef, menuItemRef, isHovering, isDisabled);
  const eventHandlers = useContext(EventHandlersContext);
  const radioGroup = useContext(RadioGroupContext);
  const isRadio = type === 'radio';
  const isCheckBox = type === 'checkbox';
  const isAnchor = !!href && !isDisabled && !isRadio && !isCheckBox;
  const isChecked = isRadio ? radioGroup.value === value : isCheckBox ? !!checked : false;

  // handle click seems to be a combination of multiple event types, bad code.
  const handleClick = (e: any) => {
    if (isDisabled) {
      if (e.syntheticEvent) {
        e.syntheticEvent.stopPropagation();
        e.syntheticEvent.preventDefault();
      } else {
        e.stopPropagation();
        e.preventDefault();
      }
      return;
    }

    const event: RMEvent = {
      value,
      syntheticEvent: e,
    };

    if (e.key !== undefined) {
      const ke = e as KeyboardEvent;
      event.key = ke.key;
      event.shiftKey = ke.shiftKey;
    }
    if (isCheckBox) event.checked = !isChecked;
    if (isRadio) event.name = radioGroup.name;
    safeCall(onClick, event);
    if (isRadio) safeCall(radioGroup.onRadioChange, event);
    eventHandlers.handleClick(event, isCheckBox || isRadio);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // if tab is allowed the handleKeyUp event can't process the tab
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  /**
   * Keyboard events are triggered on up, otherwise subcomponents get spaces and enters typed in them
   */
  const handleKeyUp = (e: KeyboardEvent) => {
    if (!isHovering) return;

    switch (e.key) {
      case Keys.ENTER:
      case Keys.TAB:
      case Keys.SPACE:
        e.preventDefault();
        e.stopPropagation();
        if (isAnchor) {
          menuItemRef?.current && menuItemRef.current.click();
        } else {
          handleClick(e);
        }
        break;
    }
  };

  const modifiers = useMemo(
    () => ({
      type,
      disabled: isDisabled,
      hover: isHovering,
      checked: isChecked,
      anchor: isAnchor,
    }),
    [type, isDisabled, isHovering, isChecked, isAnchor],
  );

  const mergedProps = mergeProps(
    {
      ...restStateProps,
      onPointerDown: setHover,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onClick: handleClick,
    },
    restProps,
  );

  // Order of props overriding (same in all components):
  // 1. Preset props adhering to WAI-ARIA Authoring Practices.
  // 2. Merged outer and local props
  // 3. ref, className
  const menuItemProps = {
    role: isRadio ? 'menuitemradio' : isCheckBox ? 'menuitemcheckbox' : 'menuitem',
    'aria-checked': isRadio || isCheckBox ? isChecked : undefined,
    ...mergedProps,
    ...commonProps(isDisabled, isHovering),
    ref: useCombinedRef(externalRef as Ref<any>, menuItemRef),
    className: useBEM({ block: menuClass, element: menuItemClass, modifiers, className }),
    children: useMemo(() => safeCall(children, modifiers), [children, modifiers]),
  };

  if (isAnchor) {
    return (
      <li role="presentation">
        <a href={href} {...menuItemProps} />
      </li>
    );
  } else {
    return <li {...menuItemProps} />;
  }
};

export const MenuItem = withHovering('MenuItem', MenuItemFr);
