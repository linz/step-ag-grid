import { createContext } from "react";

export const ItemSettingsContext = createContext<{ submenuCloseDelay: number; submenuOpenDelay: number }>({
  submenuOpenDelay: 0,
  submenuCloseDelay: 0,
});
