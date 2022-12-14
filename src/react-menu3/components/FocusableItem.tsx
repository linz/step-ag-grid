import { LegacyRef, useContext, useMemo, useRef } from "react";
import { useBEM, useCombinedRef, useItemState } from "../hooks";
import { mergeProps, commonProps, safeCall, menuClass, menuItemClass, withHovering } from "../utils";
import { BaseProps } from "../types";
import { withHoveringResultProps } from "../utils/withHovering";
import { EventHandlersContext } from "../contexts/EventHandlersContext";

export interface FocusableItemProps extends BaseProps, withHoveringResultProps {
  disabled?: boolean;
  children: (ref: LegacyRef<any>) => JSX.Element;
}

export const FocusableItemFr = ({
  className,
  disabled,
  children,
  isHovering,
  menuItemRef,
  externalRef,
  ...restProps
}: FocusableItemProps) => {
  const isDisabled = !!disabled;
  const ref = useRef(null);
  const { setHover, onPointerLeave, ...restStateProps } = useItemState(menuItemRef, ref, isHovering, isDisabled);
  const { handleClose } = useContext(EventHandlersContext);

  const modifiers = useMemo(
    () => ({
      disabled: isDisabled,
      hover: isHovering,
      focusable: true,
    }),
    [isDisabled, isHovering],
  );

  const renderChildren = useMemo(
    () =>
      safeCall(children, {
        ...modifiers,
        ref,
        closeMenu: handleClose,
      }),
    [children, modifiers, handleClose],
  );

  const mergedProps = mergeProps(
    {
      ...restStateProps,
      onPointerLeave: (e: PointerEvent) => onPointerLeave(e, true),
      onFocus: setHover,
    },
    restProps,
  );

  return (
    <li
      role="menuitem"
      {...mergedProps}
      {...commonProps(isDisabled)}
      ref={useCombinedRef(externalRef, menuItemRef)}
      className={useBEM({ block: menuClass, element: menuItemClass, modifiers, className })}
    >
      {renderChildren}
    </li>
  );
};

export const FocusableItem = withHovering("FocusableItem", FocusableItemFr);
