// @ts-nocheck
import { forwardRef, useRef, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { string, number, bool, func, object, oneOf, oneOfType, exact } from "prop-types";
import { MenuList } from "./MenuList";
import { useBEM } from "../hooks";
import {
  rootMenuPropTypes,
  menuContainerClass,
  mergeProps,
  safeCall,
  isMenuOpen,
  getTransition,
  values,
  CloseReason,
  Keys,
  MenuStateMap,
  EventHandlersContext,
  SettingsContext,
  ItemSettingsContext,
} from "../utils";
import { hasParentClass } from "@utils/util";

export const ControlledMenu = forwardRef(function ControlledMenu(
  {
    "aria-label": ariaLabel,
    className,
    containerProps,
    initialMounted,
    unmountOnClose,
    transition,
    transitionTimeout,
    boundingBoxRef,
    boundingBoxPadding,
    reposition = "auto",
    submenuOpenDelay = 300,
    submenuCloseDelay = 150,
    skipOpen,
    viewScroll = "initial",
    portal,
    theming,
    onItemClick,
    onClose,
    saveButtonRef,
    ...restProps
  }: any,
  externalRef,
) {
  const containerRef = useRef(null);
  const scrollNodesRef = useRef({});
  const { anchorRef, state } = restProps;

  const settings = useMemo(
    () => ({
      initialMounted,
      unmountOnClose,
      transition,
      transitionTimeout,
      boundingBoxRef,
      boundingBoxPadding,
      rootMenuRef: containerRef,
      rootAnchorRef: anchorRef,
      scrollNodesRef,
      reposition,
      viewScroll,
    }),
    [
      initialMounted,
      unmountOnClose,
      transition,
      transitionTimeout,
      anchorRef,
      boundingBoxRef,
      boundingBoxPadding,
      reposition,
      viewScroll,
    ],
  );

  const clickIsWithinMenu = useCallback((ev: MouseEvent) => {
    return hasParentClass("szh-menu--state-open", ev.target as Node);
  }, []);

  const handleScreenEventForSave = useCallback(
    (ev: MouseEvent) => {
      if (!clickIsWithinMenu(ev)) {
        //!ev.currentTarget.contains(ev.relatedTarget || document.activeElement)) {
        ev.preventDefault();
        ev.stopPropagation();
        // FIXME There's an issue in React17
        // the cell doesn't refresh during update if save is invoked from a native event
        // This doesn't happen in React18
        // To work around it, I invoke the save by clicking on a passed in invisible button ref
        if (saveButtonRef.current) saveButtonRef.current.click();
        else safeCall(onClose, { reason: CloseReason.BLUR });

        // If a user clicks on the menu button when a menu is open, we need to close the menu.
        // However, a blur event will be fired prior to the click event on menu button,
        // which makes the menu first close and then open again.
        // If this happens, e.relatedTarget is incorrectly set to null instead of the button in Safari and Firefox,
        // and makes it difficult to determine whether onBlur is fired because of clicking on menu button.
        // This is a workaround approach which sets a flag to skip a following click event.
        if (skipOpen) {
          skipOpen.current = true;
          setTimeout(() => (skipOpen.current = false), 300);
        }
      }
    },
    [clickIsWithinMenu, onClose],
  );

  const handleScreenEventForCancel = useCallback(
    (ev: MouseEvent) => {
      if (!clickIsWithinMenu(ev)) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },
    [clickIsWithinMenu],
  );

  useEffect(() => {
    if (isMenuOpen(state)) {
      const thisDocument = anchorRef.current ? anchorRef.current.ownerDocument : document;
      thisDocument.addEventListener("mousedown", handleScreenEventForCancel, true);
      thisDocument.addEventListener("mouseup", handleScreenEventForSave, true);
      thisDocument.addEventListener("click", handleScreenEventForCancel, true);
      thisDocument.addEventListener("dblclick", handleScreenEventForCancel, true);
      return () => {
        thisDocument.removeEventListener("mousedown", handleScreenEventForCancel, true);
        thisDocument.removeEventListener("mouseup", handleScreenEventForSave, true);
        thisDocument.removeEventListener("click", handleScreenEventForCancel, true);
        thisDocument.removeEventListener("dblclick", handleScreenEventForCancel, true);
      };
    }
    return () => {};
  }, [handleScreenEventForSave, handleScreenEventForCancel, state]);

  const itemSettings = useMemo(
    () => ({
      submenuOpenDelay,
      submenuCloseDelay,
    }),
    [submenuOpenDelay, submenuCloseDelay],
  );

  const eventHandlers = useMemo(
    () => ({
      handleClick(event, isCheckorRadio) {
        if (!event.stopPropagation) safeCall(onItemClick, event);

        let keepOpen = event.keepOpen;
        if (keepOpen === undefined) {
          // if event.keepOpen is undefined, the following default behaviour is used
          // According to WAI-ARIA Authoring Practices 1.1
          // Keep menu open when check or radio is invoked by SPACE key
          keepOpen = isCheckorRadio && event.key === Keys.SPACE;
        }

        if (!keepOpen) {
          safeCall(onClose, {
            value: event.value,
            key: event.key,
            reason: CloseReason.CLICK,
          });
        }
      },

      handleClose(key) {
        safeCall(onClose, { key, reason: CloseReason.CLICK });
      },
    }),
    [onItemClick, onClose],
  );

  const onKeyDown = ({ key }) => {
    switch (key) {
      case Keys.ESC:
        safeCall(onClose, { key, reason: CloseReason.CANCEL });
        break;
    }
  };

  const onBlur = (e) => {
    if (isMenuOpen(state) && !e.currentTarget.contains(e.relatedTarget || document.activeElement)) {
      safeCall(onClose, { reason: CloseReason.BLUR });

      // If a user clicks on the menu button when a menu is open, we need to close the menu.
      // However, a blur event will be fired prior to the click event on menu button,
      // which makes the menu first close and then open again.
      // If this happen, e.relatedTarget is incorrectly set to null instead of the button in Safari and Firefox,
      // and makes it difficult to determine whether onBlur is fired because of clicking on menu button.
      // This is a workaround approach which sets a flag to skip a following click event.
      if (skipOpen) {
        skipOpen.current = true;
        setTimeout(() => (skipOpen.current = false), 300);
      }
    }
  };

  const itemTransition = getTransition(transition, "item");
  const modifiers = useMemo(() => ({ theme: theming, itemTransition }), [theming, itemTransition]);

  const menuList = (
    <div
      {...mergeProps({ onKeyDown, onBlur }, containerProps)}
      className={useBEM({
        block: menuContainerClass,
        modifiers,
        className,
      })}
      style={{ ...containerProps?.style, position: "relative" }}
      ref={containerRef}
    >
      {state && (
        <SettingsContext.Provider value={settings}>
          <ItemSettingsContext.Provider value={itemSettings}>
            <EventHandlersContext.Provider value={eventHandlers}>
              <MenuList
                {...restProps}
                ariaLabel={ariaLabel || "Menu"}
                externalRef={externalRef}
                containerRef={containerRef}
                onClose={onClose}
              />
            </EventHandlersContext.Provider>
          </ItemSettingsContext.Provider>
        </SettingsContext.Provider>
      )}
    </div>
  );

  if (portal === true && anchorRef.current !== undefined) {
    portal = { target: anchorRef.current.ownerDocument.body };
  }

  if (portal === true && typeof document !== "undefined") {
    return createPortal(menuList, document.body);
  } else if (portal) {
    return portal.target ? createPortal(menuList, portal.target) : portal.stablePosition ? null : menuList;
  }
  return menuList;
});

ControlledMenu.propTypes /* remove-proptypes */ = {
  ...rootMenuPropTypes,
  state: oneOf(values(MenuStateMap)),
  anchorPoint: exact({
    x: number,
    y: number,
  }),
  anchorRef: object,
  skipOpen: object,
  captureFocus: bool,
  menuItemFocus: exact({
    position: oneOfType([string, number]),
    alwaysUpdate: bool,
  }),
  onClose: func,
};
