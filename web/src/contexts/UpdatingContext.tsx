import { createContext } from "react";

export type UpdatingContextStatus = Record<string, (number | string)[] | undefined>;

export type UpdatingContextType = {
  Updating: UpdatingContextStatus;
  checkUpdating: (fields: string | string[], id: number | string) => boolean;
  modifyUpdating: (field: string, ids: (number | string)[], fn: () => void | Promise<void>) => Promise<void>;
};

export const UpdatingContext = createContext<UpdatingContextType>({
  Updating: {},
  checkUpdating: () => {
    console.error("Missing UpdatingContext");
    return false;
  },
  modifyUpdating: async () => {
    console.error("Missing UpdatingContext");
  },
});
