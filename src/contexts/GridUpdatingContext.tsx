import { createContext } from "react";

export type GridUpdatingContextType = {
  checkUpdating: (fields: string | string[], id: number | string) => boolean;
  isUpdating: () => boolean;
  modifyUpdating: (
    fields: string | string[],
    ids: (number | string)[],
    fn: () => void | Promise<void>,
  ) => Promise<void>;
  updatedDep: number;
};

export const GridUpdatingContext = createContext<GridUpdatingContextType>({
  checkUpdating: () => {
    console.error("Missing GridUpdatingContext");
    return false;
  },
  isUpdating: () => {
    console.error("Missing GridUpdatingContext");
    return false;
  },
  modifyUpdating: async () => {
    console.error("Missing GridUpdatingContext");
  },
  updatedDep: 0,
});
