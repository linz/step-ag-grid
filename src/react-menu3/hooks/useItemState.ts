import { useRef, useContext, useEffect, FocusEvent, MutableRefObject } from "react";
import { ItemSettingsContext, MenuListItemContext, HoverActionTypes } from "../utils";
import { useItemEffect } from "./useItemEffect";

// This hook includes some common stateful logic in MenuItem and FocusableItem
export const useItemState = (
  itemRef: MutableRefObject<any>,
  focusRef: MutableRefObject<any>,
  isHovering?: boolean,
  isDisabled?: boolean,
) => {
  const { submenuCloseDelay } = useContext(ItemSettingsContext);
  const { isParentOpen, isSubmenuOpen, dispatch, updateItems } = useContext(MenuListItemContext);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  const setHover = () => {
    !isHovering && !isDisabled && dispatch(HoverActionTypes.SET, itemRef.current);
  };

  const unsetHover = () => {
    !isDisabled && dispatch(HoverActionTypes.UNSET, itemRef.current);
  };

  const onBlur = (e: FocusEvent) => {
    // Focus has moved out of the entire item
    // It handles situation such as clicking on a sibling disabled menu item
    if (isHovering && !e.currentTarget.contains(e.relatedTarget)) unsetHover();
  };

  const onPointerMove = () => {
    if (isSubmenuOpen) {
      if (!timeoutId.current)
        timeoutId.current = setTimeout(() => {
          timeoutId.current = undefined;
          setHover();
        }, submenuCloseDelay);
    } else {
      setHover();
    }
  };

  const onPointerLeave = (_: PointerEvent, keepHover: boolean) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = undefined;
    }

    !keepHover && unsetHover();
  };

  useItemEffect(isDisabled, itemRef, updateItems);
  useEffect(() => () => clearTimeout(timeoutId.current), []);
  useEffect(() => {
    // Don't set focus when parent menu is closed, otherwise focus will be lost
    // and onBlur event will be fired with relatedTarget setting as null.
    if (isHovering && isParentOpen) {
      focusRef.current && focusRef.current.focus();
    }
  }, [focusRef, isHovering, isParentOpen]);

  return {
    setHover,
    onBlur,
    onPointerMove,
    onPointerLeave,
  };
};
