import { useRef, useContext, useEffect, useMemo, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { useBEM, useCombinedRef, useMenuChange, useMenuStateAndFocus, useItemEffect } from "../hooks";
import { MenuList } from "./MenuList";
import {
  mergeProps,
  batchedUpdates,
  commonProps,
  safeCall,
  menuClass,
  subMenuClass,
  menuItemClass,
  isMenuOpen,
  withHovering,
  SettingsContext,
  ItemSettingsContext,
  MenuListContext,
  MenuListItemContext,
  Keys,
  HoverActionTypes,
  FocusPositions,
} from "../utils";
import {
  BaseProps,
  ClassNameProp,
  Hoverable,
  MenuAlign,
  MenuArrowModifiers,
  MenuDirection,
  MenuModifiers,
  MenuOverflow,
  MenuPosition,
  RenderProp,
  UncontrolledMenuProps,
} from "../types";
import { withHoveringResultProps } from "../utils/withHovering";

//
// SubMenu
// ----------------------------------------------------------------------
export type SubMenuItemModifiers = Readonly<{
  /**
   * Indicates if the submenu is open.
   */
  open: boolean;
  /**
   * Indicates if the submenu item is being hovered and has focus.
   */
  hover: boolean;
  /**
   * Indicates if the submenu and item are disabled.
   */
  disabled: boolean;
}>;

/**
 * Common props for `Menu`, `SubMenu` and `ControlledMenu`
 */
interface BaseMenuProps extends Omit<BaseProps, "style"> {
  /**
   * Can be a string or a function which receives a modifier object and returns a CSS `class` string.
   */
  menuClassName?: ClassNameProp<MenuModifiers>;
  /**
   * This prop is forwarded to the `style` prop of menu DOM element.
   */
  menuStyle?: React.CSSProperties;
  /**
   * Can be a string or a function which receives a modifier object and returns a CSS `class` string.
   */
  arrowClassName?: ClassNameProp<MenuArrowModifiers>;
  /**
   * This prop is forwarded to the `style` prop of menu arrow DOM element.
   */
  arrowStyle?: React.CSSProperties;
  /**
   * Set `true` to display an arrow pointing to its anchor element.
   */
  arrow?: boolean;
  /**
   * Set the horizontal distance (in pixels) between menu and its anchor element.
   * The value can be negative.
   * @default 0
   */
  offsetX?: number;
  /**
   * Set the vertical distance (in pixels) between menu and its anchor element.
   * The value can be negative.
   * @default 0
   */
  offsetY?: number;
  /**
   * Set alignment of menu with anchor element.
   * @default 'start'
   */
  align?: MenuAlign;
  /**
   * Set direction in which menu expands against anchor element.
   * @default 'bottom'
   */
  direction?: MenuDirection;
  /**
   * Set the position of menu related to its anchor element:
   *
   * - 'auto' menu position is adjusted to have it contained within the viewport,
   * even if it will be detached from the anchor element.
   * This option allows to display menu in the viewport as much as possible.
   *
   * - 'anchor' menu position is adjusted to have it contained within the viewport,
   * but it will be kept attached to the edges of anchor element.
   *
   * - 'initial' menu always stays at its initial position.
   * @default 'auto'
   */
  position?: MenuPosition;
  /**
   * Make the menu list scrollable or hidden when there is not enough viewport space to
   * display all menu items. The prop is similar to the CSS `overflow` property.
   * @default 'visible'
   */
  overflow?: MenuOverflow;
  /**
   * Set computed overflow amount down to a child `MenuGroup`.
   * The `MenuGroup` should have `takeOverflow` prop set as `true` accordingly.
   */
  setDownOverflow?: boolean;
  children?: React.ReactNode;
}

export interface SubMenuProps extends BaseMenuProps, Hoverable, UncontrolledMenuProps, withHoveringResultProps {
  /**
   * Properties of this object are spread to the submenu item DOM element.
   */
  itemProps?: BaseProps<SubMenuItemModifiers>;
  /**
   * The submenu `label` can be a `string` or JSX element, or a render function that returns one.
   */
  label?: RenderProp<SubMenuItemModifiers>;
  /**
   * - `undefined` submenu opens when the label item is hovered or clicked. This is the default behaviour.
   * - 'clickOnly' submenu opens when the label item is clicked.
   * - 'none' submenu doesn't open with mouse or keyboard events;
   * you can call the `openMenu` function on `instanceRef` to open submenu programmatically.
   */
  openTrigger?: "none" | "clickOnly";
}

export const SubMenuFr = ({
  "aria-label": ariaLabel,
  className,
  disabled,
  direction,
  label,
  openTrigger,
  onMenuChange,
  isHovering,
  instanceRef,
  menuItemRef,
  itemProps = {},
  ...restProps
}: SubMenuProps) => {
  const settings = useContext(SettingsContext);
  const { rootMenuRef } = settings;
  const { submenuOpenDelay, submenuCloseDelay } = useContext(ItemSettingsContext);
  const { parentMenuRef, parentDir, overflow: parentOverflow } = useContext(MenuListContext);
  const { isParentOpen, isSubmenuOpen, setOpenSubmenuCount, dispatch, updateItems } = useContext(MenuListItemContext);
  const isPortal = parentOverflow !== "visible";

  // FIXME Matt no idea what's going on here
  const [stateProps, toggleMenu, _openMenu] = useMenuStateAndFocus(settings);

  const { state } = stateProps;
  const isDisabled = !!disabled;
  const isOpen = isMenuOpen(state);
  const containerRef = useRef(null);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  const stopTimer = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = undefined;
    }
  };

  const openMenu = (...args: any[]) => {
    stopTimer();
    setHover();
    !isDisabled && _openMenu(...args);
  };

  const setHover = () => !isHovering && !isDisabled && dispatch(HoverActionTypes.SET, menuItemRef?.current, 0);

  const delayOpen = (delay: number) => {
    setHover();
    if (!openTrigger) timeoutId.current = setTimeout(() => batchedUpdates(openMenu), Math.max(delay, 0));
  };

  const handlePointerMove = () => {
    if (timeoutId.current || isOpen || isDisabled) return;

    if (isSubmenuOpen) {
      timeoutId.current = setTimeout(() => delayOpen(submenuOpenDelay - submenuCloseDelay), submenuCloseDelay);
    } else {
      delayOpen(submenuOpenDelay);
    }
  };

  const handlePointerLeave = () => {
    stopTimer();
    if (!isOpen) dispatch(HoverActionTypes.UNSET, menuItemRef?.current, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let handled = false;

    switch (e.key) {
      // LEFT key is bubbled up from submenu items
      case Keys.LEFT:
        if (isOpen) {
          menuItemRef?.current && menuItemRef.current.focus();
          toggleMenu(false);
          handled = true;
        }
        break;

      // prevent browser from scrolling page to the right
      case Keys.RIGHT:
        if (!isOpen) handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    if (!isHovering) return;

    switch (e.key) {
      case Keys.ENTER:
      case Keys.SPACE:
      case Keys.RIGHT:
        openTrigger !== "none" && openMenu(FocusPositions.FIRST);
        break;
    }
  };

  useItemEffect(isDisabled, menuItemRef, updateItems);
  useMenuChange(onMenuChange, isOpen);

  useEffect(() => () => clearTimeout(timeoutId.current), []);
  useEffect(() => {
    // Don't set focus when parent menu is closed, otherwise focus will be lost
    // and onBlur event will be fired with relatedTarget setting as null.
    if (isHovering && isParentOpen) {
      menuItemRef?.current && menuItemRef.current.focus();
    } else {
      toggleMenu(false);
    }
  }, [isHovering, isParentOpen, toggleMenu, menuItemRef]);

  useEffect(() => {
    setOpenSubmenuCount((count: number) => (isOpen ? count + 1 : Math.max(count - 1, 0)));
  }, [setOpenSubmenuCount, isOpen]);

  useImperativeHandle(instanceRef, () => ({
    openMenu: (...args) => {
      isParentOpen && openMenu(...args);
    },
    closeMenu: () => {
      if (isOpen) {
        menuItemRef?.current && menuItemRef.current.focus();
        toggleMenu(false);
      }
    },
  }));

  const modifiers = useMemo(
    () => ({
      open: isOpen,
      hover: isHovering,
      disabled: isDisabled,
      submenu: true,
    }),
    [isOpen, isHovering, isDisabled],
  );

  const { ref: externalItemRef, className: itemClassName, ...restItemProps } = itemProps;

  const mergedItemProps = mergeProps(
    {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onKeyDown: handleItemKeyDown,
      onClick: () => openTrigger !== "none" && openMenu(),
    },
    restItemProps,
  );

  const getMenuList = () => {
    const menuList = (
      <MenuList
        {...restProps}
        {...stateProps}
        ariaLabel={ariaLabel || (typeof label === "string" ? label : "Submenu")}
        anchorRef={menuItemRef}
        containerRef={isPortal ? rootMenuRef : containerRef}
        direction={direction || (parentDir === "right" || parentDir === "left" ? parentDir : "right")}
        parentScrollingRef={isPortal && parentMenuRef}
        isDisabled={isDisabled}
      />
    );
    const container = rootMenuRef?.current;
    return isPortal && container ? createPortal(menuList, container) : menuList;
  };

  return (
    <li
      className={useBEM({ block: menuClass, element: subMenuClass, className })}
      style={{ position: "relative" }}
      role="presentation"
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div
        role="menuitem"
        aria-haspopup
        aria-expanded={isOpen}
        {...mergedItemProps}
        {...commonProps(isDisabled, isHovering)}
        ref={useCombinedRef(externalItemRef, menuItemRef)}
        className={useBEM({
          block: menuClass,
          element: menuItemClass,
          modifiers,
          className: itemClassName,
        })}
      >
        {useMemo(() => safeCall(label, modifiers), [label, modifiers])}
      </div>

      {state && getMenuList()}
    </li>
  );
};

export const SubMenu = withHovering("SubMenu", SubMenuFr) as any as typeof SubMenuFr;
