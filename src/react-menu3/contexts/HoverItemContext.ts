import { createContext } from "react";

export const HoverItemContext = createContext<
  | HTMLDivElement
  | HTMLLIElement
  | ((prevItem: HTMLDivElement | HTMLLIElement) => HTMLDivElement | HTMLLIElement | undefined)
  | undefined
>(undefined);
