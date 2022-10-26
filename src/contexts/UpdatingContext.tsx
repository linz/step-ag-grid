import { createContext } from "react";

export type UpdatingContextType = {
  checkUpdating: (fields: string | string[], id: number | string) => boolean;
  modifyUpdating: (field: string, ids: (number | string)[], fn: () => void | Promise<void>) => Promise<void>;
};

export const UpdatingContext = createContext<UpdatingContextType>({
  checkUpdating: () => {
    console.error("Missing UpdatingContext");
    return false;
  },
  modifyUpdating: async () => {
    console.error("Missing UpdatingContext");
  },
});
