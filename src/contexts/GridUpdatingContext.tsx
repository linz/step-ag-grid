import { createContext } from "react";

export type GridUpdatingContextType = {
  checkUpdating: (fields: string | string[], id: number | string) => boolean;
  modifyUpdating: (field: string, ids: (number | string)[], fn: () => void | Promise<void>) => Promise<void>;
};

export const GridUpdatingContext = createContext<GridUpdatingContextType>({
  checkUpdating: () => {
    console.error("Missing GridUpdatingContext");
    return false;
  },
  modifyUpdating: async () => {
    console.error("Missing GridUpdatingContext");
  },
});
