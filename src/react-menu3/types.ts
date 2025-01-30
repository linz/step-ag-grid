//
// base types
// ----------------------------------------------------------------------
import { ForwardedRef, MutableRefObject } from 'react';

export type MenuState = 'opening' | 'open' | 'closing' | 'closed';
export type MenuAlign = 'start' | 'center' | 'end';
export type MenuDirection = 'left' | 'right' | 'top' | 'bottom';
export type MenuPosition = 'auto' | 'anchor' | 'initial';
export type MenuOverflow = 'auto' | 'visible' | 'hidden';
export type MenuReposition = 'auto' | 'initial';
export type MenuViewScroll = 'auto' | 'close' | 'initial';
export type MenuItemTypeProp = 'checkbox' | 'radio';
export type CloseReason = 'click' | 'cancel' | 'blur' | 'scroll';
/**
 * - `'first'` focus the first item in the menu.
 * - `'last'` focus the last item in the menu.
 * - `number` focus item at the specific position (zero-based).
 */
export type FocusPosition = 'first' | 'last' | number;

export type ClassNameProp<M = undefined> = string | ((modifiers: M) => string);

export type RenderProp<M, R = React.ReactNode> = R | ((modifiers: M) => R);

export interface BaseProps<M = undefined> extends Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'> {
  ref?: React.Ref<any>;
  /**
   * Can be a string or a function which receives a modifier object and returns a CSS `class` string.
   */
  className?: ClassNameProp<M>;
}

export interface BasePropsWithChildren<M = undefined> extends Omit<React.HTMLAttributes<HTMLElement>, 'className'> {
  ref?: React.Ref<any>;
  /**
   * Can be a string or a function which receives a modifier object and returns a CSS `class` string.
   */
  className?: ClassNameProp<M>;
}

export interface Event {
  /**
   * The `value` prop passed to the `MenuItem` being clicked.
   * It's useful for identifying which menu item is clicked.
   */
  value?: any;
  /**
   *  Indicates the key if the event is triggered by keyboard. Can be 'Enter', ' '(Space) or 'Escape'.
   */
  key?: string;

  shiftKey?: boolean;
}

export interface MenuCloseEvent extends Event {
  /**
   * The reason that causes the close event.
   */
  reason: CloseReason;
}

export interface MenuChangeEvent {
  /**
   * Indicates if the menu is open or closed.
   */
  open: boolean;
}

export interface EventHandler<E> {
  (event: E): void;
}

export interface RectElement {
  getBoundingClientRect(): {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  };
}

//
// Menu common types
// ----------------------------------------------------------------------
export type MenuModifiers = Readonly<{
  /**
   * Indicates the state of menu.
   */
  state: MenuState;
  /**
   * Computed direction in which the menu expands.
   */
  dir: MenuDirection;
}>;

export type MenuArrowModifiers = Readonly<{
  /**
   * Computed direction in which the menu expands.
   *
   * *Please note arrow points to the opposite direction of this value.*
   */
  dir: MenuDirection;
}>;

export type TransitionFieldType =
  | boolean
  | {
      open?: boolean;
      close?: boolean;
      item?: boolean;
    };

export interface MenuStateOptions {
  /**
   * By default menu isn't mounted into DOM until it's opened for the first time.
   * Setting the prop to `true` will change this behaviour,
   * which also enables menu and its items to be server rendered.
   */
  initialMounted?: boolean;
  /**
   * By default menu remains in DOM when it's closed.
   * Setting the prop to `true` will change this behaviour.
   */
  unmountOnClose?: boolean;
  /**
   * Enable or disable transition effects in `Menu`, `MenuItem`, and any descendent `SubMenu`.
   *
   * You can set 'open', 'close' and 'item' at the same time with one boolean value or separately with an object.
   *
   * *If you enable transition on menu, make sure to add your own animation styles,
   * or import `'@szhsin/react-menu/dist/transitions/slide.css'`,
   * otherwise menu cannot be closed or have visible delay when closed.*
   *
   * @example [CodeSandbox Demo](https://codesandbox.io/s/react-menu-sass-i1wxo)
   */
  transition?: TransitionFieldType;

  /**
   * A fallback timeout in `ms` to stop transition if `onAnimationEnd` events are not fired.
   *
   * *Note: this value should be greater than or equal to the duration of
   * transition animation applied on menu.*
   *
   * @default 500
   */
  transitionTimeout?: number;
}

export interface Hoverable {
  disabled?: boolean;
  index?: number;
}

/**
 * Common props for `Menu`, `SubMenu` and `ControlledMenu`
 */
interface BaseMenuProps extends Omit<BaseProps, 'style'> {
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

//
// MenuButton
// ----------------------------------------------------------------------
export type MenuButtonModifiers = Readonly<{
  /**
   * Indicates if the associated menu is open.
   */
  open: boolean;
}>;

export interface MenuInstance {
  /**
   * Open menu and optionally request which menu item will be hovered.
   */
  openMenu: (position?: FocusPosition, alwaysUpdate?: boolean) => void;
  /**
   * Close menu
   */
  closeMenu: () => void;
}

/**
 * Common props for `Menu` and `SubMenu`
 */
export interface UncontrolledMenuProps {
  /**
   * Menu component ref which can be used to programmatically open or close menu.
   */
  instanceRef?: React.Ref<MenuInstance>;
  /**
   * Event fired after menu is open or closed.
   */
  onMenuChange?: EventHandler<MenuChangeEvent>;
}

export interface RadioChangeEvent extends Event {
  /**
   * The `name` prop passed to the `MenuRadioGroup` when the menu item is in a radio group.
   */
  name?: string;
  /**
   * Set this property on event object to control whether to keep menu open after menu item is activated.
   * Leaving it `undefined` will behave in accordance with WAI-ARIA Authoring Practices.
   */
  keepOpen?: boolean;
  /**
   * Setting this property on event object to `true` will skip `onItemClick` event on root menu component.
   */
  stopPropagation?: boolean;
  /**
   * DOM event object (React synthetic event)
   */
  syntheticEvent: MouseEvent | KeyboardEvent;
}

export interface ClickEvent extends RadioChangeEvent {
  /**
   * Indicates if the menu item is checked, only for `MenuItem` type="checkbox".
   */
  checked?: boolean;
}

export type PortalFieldType =
  | boolean
  | {
      /**
       * A DOM node under which menu will be rendered.
       */
      target?: Element | null;
      /**
       * When `target` is null, setting this value `true` prevents menu from rendering into the DOM hierarchy of its parent component.
       */
      stablePosition?: boolean;
    };

/**
 * Common props for `Menu` and `ControlledMenu`
 */
export interface RootMenuProps extends BaseMenuProps, MenuStateOptions {
  /**
   * Properties of this object are spread to the root DOM element containing the menu.
   */
  containerProps?: Omit<React.HTMLAttributes<HTMLElement>, 'className'>;
  /**
   * A ref object attached to a DOM element within which menu will be positioned.
   * If not provided, the nearest ancestor which has CSS `overflow` set to a value
   * other than 'visible' or the browser viewport will serve as the bounding box.
   */
  boundingBoxRef?: React.RefObject<Element | RectElement>;
  /**
   * Specify bounding box padding in pixels. Use a syntax similar to the CSS
   * `padding` property but sizing units are discarded.
   * @example '10', '5 10', '1 2 4', or '2 5 3 1'
   */
  boundingBoxPadding?: string;
  /**
   * Set the behaviour of menu and any of its descendent submenus when window is scrolling:
   * - 'initial' The window scroll event is ignored and has no effect on menu.
   * - 'auto' Menu will reposition itself based on the value of `position` prop when window is scrolling.
   * - 'close' menu will be closed when window is scrolled.
   * @default 'initial'
   */
  viewScroll?: MenuViewScroll;
  /**
   * - If `true`, menu is rendered as a direct child of `document.body`,
   * - or you can specify a target element in the DOM as menu container.
   *
   * Portal allows menu to visually “break out” of its container. Typical use cases may include:
   * - An ancestor container is positioned and CSS `overflow` is set to a value other than `visible`.
   * - You have a DOM structure that creates a complex hierarchy of stacking contexts,
   * and menu is overlapped regardless of `z-index` value.
   */
  portal?: PortalFieldType;

  /**
   * Specify when menu is repositioned:
   * - 'initial' Don't automatically reposition menu. Set to this value when you want
   * to explicitly reposition menu using the `repositionFlag` prop.
   * - 'auto' Reposition menu whenever its size has changed, using the `ResizeObserver` API.
   * @default 'auto'
   */
  reposition?: MenuReposition;
  /**
   * Use this prop to explicitly reposition menu. Whenever the prop has a new value,
   * menu position will be recalculated and updated.
   * You might use a counter and increase it every time.
   *
   * *Warning: don't update this prop in rapid succession,
   * which is inefficient and might cause infinite rendering of component.
   * E.g., don't change the value of this prop in `window` scroll event.*
   */
  repositionFlag?: number | string;
  /**
   * Set a delay in `ms` before opening a submenu when mouse moves over it.
   * @default 300
   */
  submenuOpenDelay?: number;
  /**
   * Set a delay in `ms` before closing a submenu when it's open and mouse is
   * moving over other items in the parent menu list.
   * @default 150
   */
  submenuCloseDelay?: number;
  /**
   * Set a CSS `class` on the container element of menu for theming purpose.
   */
  theming?: string;
  /**
   * Event fired when descendent menu items are clicked.
   */
  onItemClick?: EventHandler<ClickEvent>;
  /**
   * NEW Don't shrink container if menu direction is "top"
   */
  dontShrinkIfDirectionIsTop?: boolean;
}

export interface ExtraMenuProps {
  isDisabled?: boolean;
  ariaLabel?: string;
  containerRef?: MutableRefObject<HTMLElement | undefined>;
  externalRef?: ForwardedRef<HTMLUListElement>;
  parentScrollingRef?: MutableRefObject<any>;
}

//
// ControlledMenu
// ----------------------------------------------------------------------
export interface ControlledMenuProps extends RootMenuProps, ExtraMenuProps {
  /**
   * Viewport coordinates to which context menu will be positioned.
   *
   * *Use this prop only for context menu*
   */
  anchorPoint?: {
    x: number;
    y: number;
  };
  /**
   * A ref object attached to a DOM element to which menu will be positioned.
   *
   * *Don't set this prop for context menu*
   */
  anchorRef?: React.RefObject<Element>;
  skipOpen?: React.MutableRefObject<boolean>;
  /**
   * If `true`, the menu list element will gain focus after menu is open.
   * @default true
   */
  captureFocus?: boolean;
  /**
   * Controls the state of menu. When the prop is `undefined`, menu will be unmounted from DOM.
   */
  state?: MenuState;
  /**
   * Sets which menu item receives focus (hover) when menu opens.
   * You will usually set this prop when the menu is opened by keyboard events.
   *
   * *Note: If you don't intend to update focus (hover) position,
   * it's important to keep this prop's identity stable when your component re-renders.*
   */
  menuItemFocus?: {
    position?: FocusPosition;
    alwaysUpdate?: boolean;
  };
  /**
   * Set the return value of `useMenuState` to this prop.
   */
  endTransition?: () => void;
  /**
   * Event fired when menu is about to close.
   */
  onClose?: EventHandler<MenuCloseEvent>;
}
