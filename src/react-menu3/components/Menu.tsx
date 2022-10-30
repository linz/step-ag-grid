import {
  cloneElement,
  Fragment,
  forwardRef,
  useRef,
  useCallback,
  useImperativeHandle,
  ReactElement,
  LegacyRef,
  MutableRefObject,
  ForwardedRef,
} from "react";
import { ControlledMenu } from "./ControlledMenu";
import { useMenuChange, useMenuStateAndFocus, useCombinedRef } from "../hooks";
import { getName, mergeProps, safeCall, isMenuOpen, Keys, FocusPositions } from "../utils";
import { MenuButtonModifiers, RenderProp, RootMenuProps, UncontrolledMenuProps } from "../index";

//
// Menu
// ----------------------------------------------------------------------
export interface MenuProps extends RootMenuProps, UncontrolledMenuProps {
  /**
   * Can be a `MenuButton`, a `button` element, or a React component.
   * It also can be a render function that returns one.
   *
   * If a React component is provided, it needs to implement the following contracts:
   * - Accepts a `ref` prop that is forwarded to an element to which menu will be positioned.
   * The element should be able to receive focus.
   * - Accepts `onClick` and `onKeyDown` event props.
   */
  menuButton: RenderProp<MenuButtonModifiers, ReactElement>;
}

export function MenuFr(
  { "aria-label": ariaLabel, menuButton, instanceRef, onMenuChange, ...restProps }: MenuProps,
  externalRef: ForwardedRef<any>, // FIXME Matt correct type?
) {
  const [stateProps, toggleMenu, openMenu] = useMenuStateAndFocus(restProps);
  const isOpen = isMenuOpen(stateProps.state);
  const skipOpen = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(
    (e) => {
      toggleMenu(false);
      if (e.key) buttonRef.current?.focus && buttonRef.current.focus();
    },
    [toggleMenu],
  );

  const onClick = (e: MouseEvent) => {
    if (skipOpen.current) return;
    // Focus (hover) the first menu item when onClick event is trigger by keyboard
    openMenu(e.detail === 0 ? FocusPositions.FIRST : undefined);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case Keys.UP:
        openMenu(FocusPositions.LAST);
        break;

      case Keys.DOWN:
        openMenu(FocusPositions.FIRST);
        break;

      default:
        return;
    }

    e.preventDefault();
  };

  const button = safeCall(menuButton, { open: isOpen });
  if (!button || !button.type) throw new Error("Menu requires a menuButton prop.");

  const buttonProps = {
    ref: useCombinedRef(button.ref, buttonRef),
    ...mergeProps({ onClick, onKeyDown }, button.props),
    isOpen: false,
  };
  if (getName(button.type) === "MenuButton") {
    buttonProps.isOpen = isOpen;
  }
  const renderButton = cloneElement(button, buttonProps);

  useMenuChange(onMenuChange, isOpen);

  useImperativeHandle(instanceRef, () => ({
    openMenu,
    closeMenu: () => toggleMenu(false),
  }));

  return (
    <Fragment>
      {renderButton}
      <ControlledMenu
        {...restProps}
        {...stateProps}
        aria-label={ariaLabel || (typeof button.props.children === "string" ? button.props.children : "Menu")}
        anchorRef={buttonRef}
        ref={externalRef}
        onClose={handleClose}
        skipOpen={skipOpen}
      />
    </Fragment>
  );
}
export const Menu = forwardRef(MenuFr);
/*
Menu.propTypes = {
  ...rootMenuPropTypes,
  ...uncontrolledMenuPropTypes,
  menuButton: oneOfType([element, func]).isRequired,
};
*/
