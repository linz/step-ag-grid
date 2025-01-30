import { FocusEvent, MutableRefObject, useContext, useEffect, useRef } from 'react';

import { ItemSettingsContext } from '../contexts/ItemSettingsContext';
import { MenuListItemContext } from '../contexts/MenuListItemContext';
import { HoverActionTypes } from '../utils';
import { useItemEffect } from './useItemEffect';

// This hook includes some common stateful logic in MenuItem and FocusableItem
export const useItemState = (
  menuItemRef: MutableRefObject<any> | undefined,
  focusRef: MutableRefObject<any> | undefined,
  isHovering?: boolean,
  isDisabled?: boolean,
) => {
  const { submenuCloseDelay } = useContext(ItemSettingsContext);
  const { isParentOpen, isSubmenuOpen, dispatch, updateItems } = useContext(MenuListItemContext);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  const setHover = () => {
    !isHovering && !isDisabled && dispatch(HoverActionTypes.SET, menuItemRef?.current, 0);
  };

  const unsetHover = () => {
    !isDisabled && dispatch(HoverActionTypes.UNSET, menuItemRef?.current, 0);
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

  useItemEffect(isDisabled, menuItemRef, updateItems);
  useEffect(() => () => clearTimeout(timeoutId.current), []);
  useEffect(() => {
    // Don't set focus when parent menu is closed, otherwise focus will be lost
    // and onBlur event will be fired with relatedTarget setting as null.
    if (isHovering && isParentOpen) {
      focusRef?.current && focusRef.current.focus();
    }
  }, [focusRef, isHovering, isParentOpen]);

  return {
    setHover,
    onBlur,
    onPointerMove,
    onPointerLeave,
  };
};
