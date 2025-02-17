import { createContext } from 'react';

import { FocusPosition } from '../types';

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
