// FIXME hacking a default context in here is probably bad
import { createContext, MutableRefObject, RefObject } from "react";
import { ControlledMenuProps, MenuReposition, MenuViewScroll, RectElement, TransitionFieldType } from "../types";

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

export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);
