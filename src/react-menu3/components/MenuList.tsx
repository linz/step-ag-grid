import { debounce } from "lodash-es";
import { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { HoverItemContext } from "../contexts/HoverItemContext";
import { MenuListContext } from "../contexts/MenuListContext";
import { MenuListItemContext } from "../contexts/MenuListItemContext";
import { SettingsContext } from "../contexts/SettingsContext";
import { useBEM, useCombinedRef, useItems, useLayoutEffect } from "../hooks";
import { getPositionHelpers, positionContextMenu, positionMenu } from "../positionUtils";
import { ControlledMenuProps, MenuDirection } from "../types";
import {
  CloseReason,
  FocusPositions,
  HoverActionTypes,
  Keys,
  batchedUpdates,
  commonProps,
  floatEqual,
  focusFirstInput,
  getScrollAncestor,
  getTransition,
  isMenuOpen,
  menuArrowClass,
  menuClass,
  mergeProps,
  safeCall,
} from "../utils";

export const MenuList = ({
  ariaLabel,
  menuClassName,
  menuStyle,
  arrowClassName,
  arrowStyle,
  anchorPoint,
  anchorRef,
  containerRef,
  externalRef,
  parentScrollingRef,
  arrow,
  align = "start",
  direction = "bottom",
  position = "auto",
  overflow = "visible",
  setDownOverflow,
  repositionFlag,
  captureFocus = true,
  state,
  endTransition,
  isDisabled,
  menuItemFocus,
  dontShrinkIfDirectionIsTop,
  offsetX = 0,
  offsetY = 0,
  children,
  onClose,
  ...restProps
}: ControlledMenuProps) => {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });
  const [overflowData, setOverflowData] = useState<{ height: number; overflowAmt: number | undefined }>();
  const [expandedDirection, setExpandedDirection] = useState(direction);
  const [openSubmenuCount, setOpenSubmenuCount] = useState(0);
  const [reposSubmenu, forceReposSubmenu] = useReducer((c) => c + 1, 1);
  const {
    transition,
    boundingBoxRef,
    boundingBoxPadding,
    rootMenuRef,
    rootAnchorRef,
    scrollNodesRef,
    reposition,
    viewScroll,
  } = useContext(SettingsContext);
  const reposFlag = useContext(MenuListContext).reposSubmenu || repositionFlag;
  const menuRef = useRef<HTMLUListElement>({} as HTMLUListElement);
  const focusRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const prevOpen = useRef(false);
  const latestWindowSize = useRef({ width: 0, height: 0 });
  const latestMenuSize = useRef({ width: 0, height: 0 });
  const latestHandlePosition = useRef(() => {});
  const { hoverItem, dispatch, updateItems } = useItems(menuRef, focusRef);

  const isOpen = isMenuOpen(state);
  const openTransition = getTransition(transition, "open");
  const closeTransition = getTransition(transition, "close");
  const scrollNodes = scrollNodesRef.current;

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const elementTarget = e.target instanceof HTMLElement ? (e.target as HTMLElement) : null;
    const isTextInputTarget =
      elementTarget &&
      (elementTarget.nodeName === "TEXTAREA" ||
        (elementTarget.nodeName === "INPUT" && elementTarget.getAttribute("type") === "text"));
    switch (e.key) {
      case Keys.HOME:
        // Don't eat home/end events on inputs
        if (isTextInputTarget) return;
        dispatch(HoverActionTypes.FIRST, null, 0);
        break;

      case Keys.END:
        // Don't eat home/end events on inputs
        if (isTextInputTarget) return;
        dispatch(HoverActionTypes.LAST, null, 0);
        break;

      case Keys.UP:
        dispatch(HoverActionTypes.DECREASE, hoverItem, 0);
        break;

      case Keys.DOWN:
        dispatch(HoverActionTypes.INCREASE, hoverItem, 0);
        break;

      // prevent browser from scrolling the page when SPACE is pressed
      case Keys.SPACE:
        // Don't preventDefault on children of FocusableItem
        if (elementTarget && elementTarget.className.includes(menuClass)) {
          e.preventDefault();
        }
        return;

      default:
        return;
    }

    e.preventDefault();
    e.stopPropagation();
  };

  const onAnimationEnd = () => {
    if (state === "closing") {
      setOverflowData(undefined); // reset overflowData after closing
    }

    endTransition && safeCall(endTransition);
  };

  const handlePosition = useCallback(
    (noOverflowCheck?: boolean) => {
      if (!containerRef?.current) {
        if (process.env.NODE_ENV !== "production") {
          console.error(
            '[React-Menu] Menu cannot be positioned properly as container ref is null. If you need to initialise `state` prop to "open" for ControlledMenu, please see this solution: https://codesandbox.io/s/initial-open-sp10wn',
          );
        }
        return;
      }

      if (!scrollNodes.menu) {
        scrollNodes.menu =
          (boundingBoxRef
            ? boundingBoxRef.current // user explicitly sets boundingBoxRef
            : getScrollAncestor(rootMenuRef?.current)) || window; // try to discover bounding box automatically
      }

      const positionHelpers = getPositionHelpers(containerRef, menuRef, scrollNodes.menu, boundingBoxPadding);
      const { menuRect } = positionHelpers;
      let results: { computedDirection: MenuDirection; arrowX?: number; arrowY?: number; x: number; y: number } = {
        computedDirection: "bottom",
        x: 0,
        y: 0,
      };
      if (anchorPoint) {
        results = positionContextMenu({ positionHelpers, anchorPoint });
      } else if (anchorRef) {
        results = positionMenu({
          arrow,
          align,
          direction,
          offsetX,
          offsetY,
          position,
          anchorRef,
          arrowRef,
          positionHelpers,
        });
      }
      let { y } = results;
      const { x, arrowX, arrowY, computedDirection } = results;
      let menuHeight = menuRect.height;

      if (!noOverflowCheck && overflow !== "visible") {
        const { getTopOverflow, getBottomOverflow } = positionHelpers;

        let height: number | undefined, overflowAmt: number | undefined;
        const prevHeight = latestMenuSize.current.height;
        const bottomOverflow = getBottomOverflow(y);
        // When bottomOverflow is 0, menu is on the bottom edge of viewport
        // This might be the result of a previous maxHeight set on the menu.
        // In this situation, we need to still apply a new maxHeight.
        // Same reason for the top side
        if (bottomOverflow > 0 || (floatEqual(bottomOverflow, 0) && floatEqual(menuHeight, prevHeight))) {
          height = menuHeight - bottomOverflow;
          overflowAmt = bottomOverflow;
        } else {
          const topOverflow = getTopOverflow(y);
          if (topOverflow < 0 || (floatEqual(topOverflow, 0) && floatEqual(menuHeight, prevHeight))) {
            height = menuHeight + topOverflow;
            overflowAmt = 0 - topOverflow; // avoid getting -0
            if (height >= 0) y -= topOverflow;
          }
        }

        if (height != null && height >= 0) {
          // To avoid triggering reposition in the next ResizeObserver callback
          menuHeight = height;
          setOverflowData({ height, overflowAmt });
        } else {
          setOverflowData(undefined);
        }
      }

      if (arrow) setArrowPosition({ x: arrowX ?? 0, y: arrowY ?? 0 });
      setMenuPosition({ x, y });
      setExpandedDirection(computedDirection);
      latestMenuSize.current = { width: menuRect.width, height: menuHeight };
    },
    [
      arrow,
      align,
      boundingBoxPadding,
      direction,
      offsetX,
      offsetY,
      position,
      overflow,
      anchorPoint,
      anchorRef,
      containerRef,
      boundingBoxRef,
      rootMenuRef,
      scrollNodes,
    ],
  );

  useLayoutEffect(() => {
    if (isOpen) {
      handlePosition();
      // Reposition submenu whenever deps(except isOpen) have changed
      if (prevOpen.current) forceReposSubmenu();
    }
    prevOpen.current = isOpen;
    latestHandlePosition.current = handlePosition;
  }, [isOpen, handlePosition, /* effect dep */ reposFlag]);

  useLayoutEffect(() => {
    if (overflowData && !setDownOverflow) menuRef.current.scrollTop = 0;
  }, [overflowData, setDownOverflow]);

  useLayoutEffect(() => updateItems, [updateItems]);

  useEffect(() => {
    let { menu: menuScroll } = scrollNodes;
    if (!isOpen || !menuScroll) return;

    menuScroll = menuScroll.addEventListener ? menuScroll : window;
    if (!scrollNodes.anchors) {
      scrollNodes.anchors = [];
      let anchorScroll = getScrollAncestor(rootAnchorRef && rootAnchorRef.current);
      while (anchorScroll && anchorScroll !== menuScroll) {
        scrollNodes.anchors.push(anchorScroll);
        anchorScroll = getScrollAncestor(anchorScroll);
      }
    }

    let scroll = viewScroll;
    if (scrollNodes.anchors.length && scroll === "initial") scroll = "auto";
    if (scroll === "initial") return;

    const handleScroll = () => {
      if (scroll === "auto") {
        batchedUpdates(() => handlePosition(true));
      } else {
        safeCall(onClose, { reason: CloseReason.SCROLL });
      }
    };

    const scrollObservers = scrollNodes.anchors.concat(viewScroll !== "initial" ? menuScroll : []);
    scrollObservers.forEach((o: any) => o.addEventListener("scroll", handleScroll));
    return () => scrollObservers.forEach((o) => o.removeEventListener("scroll", handleScroll));
  }, [rootAnchorRef, scrollNodes, isOpen, onClose, viewScroll, handlePosition]);

  const hasOverflow = !!overflowData && overflowData.overflowAmt != null && overflowData.overflowAmt > 0;
  useEffect(() => {
    if (hasOverflow || !isOpen || !parentScrollingRef) return;

    const handleScroll = () => batchedUpdates(handlePosition);
    const parentScroll = parentScrollingRef.current;
    parentScroll.addEventListener("scroll", handleScroll);
    return () => parentScroll.removeEventListener("scroll", handleScroll);
  }, [isOpen, hasOverflow, parentScrollingRef, handlePosition]);

  useEffect(() => {
    if (typeof ResizeObserver !== "function" || reposition === "initial") return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { borderBoxSize, target } = entry;
      let width, height;
      if (borderBoxSize) {
        const { inlineSize, blockSize } = borderBoxSize[0] || borderBoxSize;
        width = inlineSize;
        height = blockSize;
      } else {
        const borderRect = target.getBoundingClientRect();
        width = borderRect.width;
        height = borderRect.height;
      }

      if (width === 0 || height === 0) return;
      if (floatEqual(width, latestMenuSize.current.width, 1) && floatEqual(height, latestMenuSize.current.height, 1))
        return;
      flushSync(() => {
        latestHandlePosition.current();
        forceReposSubmenu();
      });
    });

    const observeTarget = menuRef.current;
    resizeObserver.observe(observeTarget, { box: "border-box" });
    return () => resizeObserver.unobserve(observeTarget);
  }, [reposition]);

  // Matt added window resize observer
  useEffect(() => {
    if (typeof ResizeObserver !== "function" || reposition === "initial") return;

    const callback = debounce(() => {
      const { width, height } = menuRef.current.ownerDocument.body.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      if (
        floatEqual(width, latestWindowSize.current.width, 1) &&
        floatEqual(height, latestWindowSize.current.height, 1)
      ) {
        return;
      }
      latestWindowSize.current = { width, height };
      flushSync(() => {
        latestHandlePosition.current();
        forceReposSubmenu();
      });
    }, 250);

    const resizeObserver = new ResizeObserver(callback);

    const observeTarget = menuRef.current.ownerDocument.body;
    resizeObserver.observe(observeTarget, { box: "border-box" });
    return () => {
      callback.cancel();
      resizeObserver.unobserve(observeTarget);
    };
  }, [reposition]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(HoverActionTypes.RESET, undefined, 0);
      if (!closeTransition) setOverflowData(undefined);
      return () => {};
    }

    const { position, alwaysUpdate } = menuItemFocus || {};
    const setItemFocus = () => {
      if (position === FocusPositions.FIRST) {
        dispatch(HoverActionTypes.FIRST, undefined, 0);
      } else if (position === FocusPositions.LAST) {
        dispatch(HoverActionTypes.LAST, undefined, 0);
      } else if (typeof position === "number" && position >= -1) {
        dispatch(HoverActionTypes.SET_INDEX, undefined, position);
      }
    };

    if (alwaysUpdate) {
      setItemFocus();
    } else if (captureFocus) {
      // Use a timeout here because if set focus immediately, page might scroll unexpectedly.
      const id = setTimeout(
        () => {
          // If focus has already been set to a children element, don't set focus on menu or item
          if (!menuRef.current.contains(document.activeElement)) {
            // Handle popover portal focus
            const popupElement = focusRef.current?.nextSibling;
            if (!focusFirstInput(popupElement)) {
              focusRef.current?.focus();
            }
            setItemFocus();
          }
        },
        openTransition ? 170 : 100,
      );

      return () => clearTimeout(id);
    }
    return () => {};
  }, [isOpen, openTransition, closeTransition, captureFocus, menuItemFocus, dispatch]);

  const isSubmenuOpen = openSubmenuCount > 0;
  const itemContext = useMemo(
    () => ({
      isParentOpen: isOpen,
      isSubmenuOpen,
      setOpenSubmenuCount,
      dispatch,
      updateItems,
    }),
    [isOpen, isSubmenuOpen, dispatch, updateItems],
  );

  let maxHeight: number | undefined;
  let overflowAmt: number | undefined;
  if (overflowData) {
    setDownOverflow ? (overflowAmt = overflowData.overflowAmt) : (maxHeight = overflowData.height);
  }

  const listContext = useMemo(
    () => ({
      reposSubmenu,
      overflow,
      overflowAmt,
      parentMenuRef: menuRef,
      parentDir: expandedDirection,
    }),
    [reposSubmenu, overflow, overflowAmt, expandedDirection],
  );
  const overflowStyle = maxHeight != null && maxHeight >= 0 ? { maxHeight, overflow } : undefined;

  const modifiers = useMemo(
    () => ({
      state,
      dir: expandedDirection,
    }),
    [state, expandedDirection],
  );
  const arrowModifiers = useMemo(() => ({ dir: expandedDirection }), [expandedDirection]);
  const _arrowClass = useBEM({
    block: menuClass,
    element: menuArrowClass,
    modifiers: arrowModifiers,
    className: arrowClassName,
  });

  const minHeight = useRef(0);
  if (dontShrinkIfDirectionIsTop && menuRef.current?.getBoundingClientRect) {
    const h = menuRef.current?.getBoundingClientRect().height;
    if (minHeight.current < h) minHeight.current = h;
  }

  const dontShrinkOps = useMemo(
    () =>
      expandedDirection === "top" && dontShrinkIfDirectionIsTop
        ? {
            overflowY: isSubmenuOpen ? "" : "auto",
            minHeight: (isSubmenuOpen ? 0 : minHeight.current) + "px",
          }
        : undefined,
    [dontShrinkIfDirectionIsTop, expandedDirection, isSubmenuOpen],
  );

  return (
    <ul
      role="menu"
      aria-label={ariaLabel}
      {...mergeProps({ onKeyDown, onAnimationEnd }, restProps)}
      {...commonProps(isDisabled)}
      ref={useCombinedRef(externalRef, menuRef)}
      className={useBEM({ block: menuClass, modifiers, className: menuClassName })}
      style={{
        ...menuStyle,
        ...overflowStyle,
        ...dontShrinkOps,
        margin: 0,
        display: state === "closed" ? "none" : undefined,
        position: "absolute",
        left: menuPosition.x,
        top: menuPosition.y,
      }}
    >
      <div
        ref={focusRef}
        tabIndex={-1}
        style={{ position: "absolute", left: 0, top: 0 }}
        onKeyDown={(event) => {
          if (event.key == "Tab") {
            event.preventDefault();
            event.stopPropagation();
            safeCall(onClose, {
              key: event.key,
              shiftKey: event.shiftKey,
              reason:
                event.key === "Tab"
                  ? event.shiftKey
                    ? CloseReason.TAB_BACKWARD
                    : CloseReason.TAB_FORWARD
                  : CloseReason.CLICK,
            });
          }
        }}
      />
      {arrow && (
        <div
          className={_arrowClass}
          style={{
            ...arrowStyle,
            position: "absolute",
            left: arrowPosition.x,
            top: arrowPosition.y,
          }}
          ref={arrowRef}
        />
      )}

      <MenuListContext.Provider value={listContext}>
        <MenuListItemContext.Provider value={itemContext}>
          <HoverItemContext.Provider value={hoverItem}>{children}</HoverItemContext.Provider>
        </MenuListItemContext.Provider>
      </MenuListContext.Provider>
    </ul>
  );
};
