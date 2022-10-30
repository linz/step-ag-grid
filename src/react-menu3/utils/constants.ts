import { createContext, MutableRefObject } from "react";
import { EventHandler, MenuDirection, MenuOverflow, MenuState } from "../index";
import { RadioChangeEvent } from "../components/MenuRadioGroup";
import { ControlledMenuProps } from "../components/MenuList";

export const menuContainerClass = "szh-menu-container";
export const menuClass = "szh-menu";
export const menuButtonClass = "szh-menu-button";
export const menuArrowClass = "arrow";
export const menuItemClass = "item";
export const menuDividerClass = "divider";
export const menuHeaderClass = "header";
export const menuGroupClass = "group";
export const subMenuClass = "submenu";
export const radioGroupClass = "radio-group";

export const HoverItemContext = createContext(undefined);
export const MenuListItemContext = createContext<{
  isParentOpen?: boolean;
  isSubmenuOpen?: boolean;
  dispatch: (a: number, ref: any) => void;
  updateItems: (item: any, isMounted?: boolean) => void;
  setOpenSubmenuCount: (fn: (count: number) => number) => void;
}>({ dispatch: () => {}, updateItems: () => {}, setOpenSubmenuCount: () => 0 });
export const MenuListContext = createContext<{
  overflow?: MenuOverflow;
  overflowAmt?: number;
  parentMenuRef?: MutableRefObject<any>;
  parentDir?: MenuDirection;
  reposSubmenu?: boolean;
}>({});
export interface RMEvent {
  value: any;
  syntheticEvent: any;
  checked?: boolean;
  name?: string;
  key?: string;
}
export const EventHandlersContext = createContext<{
  handleClose?: () => void;
  handleClick: (event: RMEvent, checked: boolean) => void;
}>({
  handleClick: () => {},
});
export const RadioGroupContext = createContext<{
  value?: any;
  name?: string;
  onRadioChange?: EventHandler<RadioChangeEvent>;
}>({});
export const SettingsContext = createContext<
  ControlledMenuProps & {
    rootMenuRef?: MutableRefObject<any>;
    rootAnchorRef?: MutableRefObject<any>;
    scrollNodesRef: MutableRefObject<{ anchors?: Element[]; menu: any }>;
  }
>({});
export const ItemSettingsContext = createContext<{ submenuCloseDelay: number; submenuOpenDelay: number }>({
  submenuOpenDelay: 0,
  submenuCloseDelay: 0,
});

export const Keys = Object.freeze({
  ENTER: "Enter",
  ESC: "Escape",
  SPACE: " ",
  HOME: "Home",
  END: "End",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
});

export const HoverActionTypes = Object.freeze({
  RESET: 0,
  SET: 1,
  UNSET: 2,
  INCREASE: 3,
  DECREASE: 4,
  FIRST: 5,
  LAST: 6,
  SET_INDEX: 7,
});

export const CloseReason = Object.freeze({
  CLICK: "click",
  CANCEL: "cancel",
  BLUR: "blur",
  SCROLL: "scroll",
});

export const FocusPositions = Object.freeze({
  FIRST: "first",
  LAST: "last",
});

export const MenuStateMap: Record<string, MenuState> = Object.freeze({
  entering: "opening",
  entered: "open",
  exiting: "closing",
  exited: "closed",
});
