import { Ref, useContext, useMemo } from "react";
import { useBEM, useItemState, useCombinedRef } from "../hooks";
import {
  mergeProps,
  commonProps,
  safeCall,
  menuClass,
  menuItemClass,
  withHovering,
  EventHandlersContext,
  RadioGroupContext,
  Keys,
  RMEvent,
} from "../utils";
import { BaseProps, ClickEvent, EventHandler, Hoverable, MenuItemTypeProp, RenderProp } from "../index";
import { withHoveringResultProps } from "../utils/withHovering";

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

export interface MenuItemProps extends Omit<BaseProps<MenuItemModifiers>, "onClick">, Hoverable {
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
  const isRadio = type === "radio";
  const isCheckBox = type === "checkbox";
  const isAnchor = !!href && !isDisabled && !isRadio && !isCheckBox;
  const isChecked = isRadio ? radioGroup.value === value : isCheckBox ? !!checked : false;

  // FIXME handle click seems to be a combination of multiple event types
  const handleClick = (e: any) => {
    if (isDisabled) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    const event: RMEvent = {
      value,
      syntheticEvent: e,
    };
    if (e.key !== undefined) event.key = e.key;
    if (isCheckBox) event.checked = !isChecked;
    if (isRadio) event.name = radioGroup.name;
    safeCall(onClick, event);
    if (isRadio) safeCall(radioGroup.onRadioChange, event);
    eventHandlers.handleClick(event, isCheckBox || isRadio);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isHovering) return;

    switch (e.key) {
      case Keys.ENTER:
      case Keys.SPACE:
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
      onClick: handleClick,
    },
    restProps,
  );

  // Order of props overriding (same in all components):
  // 1. Preset props adhering to WAI-ARIA Authoring Practices.
  // 2. Merged outer and local props
  // 3. ref, className
  const menuItemProps = {
    role: isRadio ? "menuitemradio" : isCheckBox ? "menuitemcheckbox" : "menuitem",
    "aria-checked": isRadio || isCheckBox ? isChecked : undefined,
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

// FIXME matt as any
export const MenuItem = withHovering("MenuItem", MenuItemFr) as any as typeof MenuItemFr;
