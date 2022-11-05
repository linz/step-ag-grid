import { createContext, MutableRefObject } from "react";
import { MenuDirection, MenuOverflow } from "../types";

export const MenuListContext = createContext<{
  overflow?: MenuOverflow;
  overflowAmt?: number;
  parentMenuRef?: MutableRefObject<any>;
  parentDir?: MenuDirection;
  reposSubmenu?: boolean;
}>({});
