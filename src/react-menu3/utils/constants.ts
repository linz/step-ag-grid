import { MenuState } from '../types';

export const menuContainerClass = 'szh-menu-container';
export const menuClass = 'szh-menu';
export const menuButtonClass = 'szh-menu-button';
export const menuArrowClass = 'arrow';
export const menuItemClass = 'item';
export const menuDividerClass = 'divider';
export const menuHeaderClass = 'header';
export const menuGroupClass = 'group';
export const subMenuClass = 'submenu';
export const radioGroupClass = 'radio-group';

export interface RMEvent {
  value: any;
  syntheticEvent: any;
  checked?: boolean;
  name?: string;
  key?: string;
  shiftKey?: boolean;
}

export const Keys = Object.freeze({
  ENTER: 'Enter',
  TAB: 'Tab',
  ESC: 'Escape',
  SPACE: ' ',
  HOME: 'Home',
  END: 'End',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
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
  CLICK: 'click',
  CANCEL: 'cancel',
  BLUR: 'blur',
  SCROLL: 'scroll',
  TAB_FORWARD: 'tab_forward',
  TAB_BACKWARD: 'tab_backward',
});

export const FocusPositions = Object.freeze({
  FIRST: 'first',
  LAST: 'last',
});

export const MenuStateMap: Record<string, MenuState> = Object.freeze({
  entering: 'opening',
  entered: 'open',
  exiting: 'closing',
  exited: 'closed',
});
