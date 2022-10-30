import { useState } from "react";
import { useMenuState } from "./useMenuState";
import { ControlledMenuProps, FocusPosition, MenuStateOptions } from "../types";

export const useMenuStateAndFocus = (
  options: MenuStateOptions,
): [any, (open?: boolean) => void, (position?: FocusPosition, alwaysUpdate?: boolean) => void] => {
  const [menuProps, toggleMenu] = useMenuState(options);
  const [menuItemFocus, setMenuItemFocus] = useState<ControlledMenuProps["menuItemFocus"]>();

  const openMenu = (position?: FocusPosition, alwaysUpdate?: boolean) => {
    setMenuItemFocus({ position, alwaysUpdate });
    toggleMenu(true);
  };

  return [{ menuItemFocus, ...menuProps }, toggleMenu, openMenu];
};
