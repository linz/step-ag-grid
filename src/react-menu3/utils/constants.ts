import { createContext, MutableRefObject, RefObject } from "react";
import {
  ControlledMenuProps,
  EventHandler,
  FocusPosition,
  MenuDirection,
  MenuOverflow,
  MenuReposition,
  MenuState,
  MenuViewScroll,
  RectElement,
  TransitionFieldType,
} from "../types";
import { RadioChangeEvent } from "../components/MenuRadioGroup";

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

interface MenuListItemContextType {
  isParentOpen?: boolean;
  isSubmenuOpen?: boolean;
  dispatch: (actionType: number, item: any, nextIndex: FocusPosition) => void;
  updateItems: (item: any, isMounted?: boolean) => void;
  setOpenSubmenuCount: (fn: (count: number) => number) => void;
}

export const MenuListItemContext = createContext<MenuListItemContextType>({
  dispatch: () => {},
  updateItems: () => {},
  setOpenSubmenuCount: () => 0,
});

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

interface SettingsContextType extends ControlledMenuProps {
  rootMenuRef?: MutableRefObject<any>;
  rootAnchorRef?: MutableRefObject<any>;
  scrollNodesRef: MutableRefObject<{ anchors?: Element[]; menu?: any }>;

  initialMounted?: boolean;
  unmountOnClose?: boolean;
  transition?: TransitionFieldType;
  transitionTimeout?: number;
  boundingBoxRef?: RefObject<Element | RectElement>;
  boundingBoxPadding?: string;
  reposition?: MenuReposition;
  viewScroll?: MenuViewScroll;
}

// FIXME hacking a default context in here is probably bad
export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

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
