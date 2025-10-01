import { createContext } from 'react';

export type GridUpdatingContextType = {
  anyUpdating: () => boolean;
  checkUpdating: (fields: string | string[], id: number | string) => boolean;
  modifyUpdating: (
    fields: string | string[],
    ids: (number | string)[],
    fn: () => void | Promise<void>,
  ) => Promise<void>;
  updatedDep: number;
  updatingCols: () => string[];
};

export const GridUpdatingContext = createContext<GridUpdatingContextType>({
  anyUpdating: () => {
    console.error('Missing GridUpdatingContext');
    return false;
  },
  checkUpdating: () => {
    console.error('Missing GridUpdatingContext');
    return false;
  },
  updatingCols: () => {
    console.error('Missing GridUpdatingContext');
    return [];
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  modifyUpdating: async () => {
    console.error('Missing GridUpdatingContext');
  },
  updatedDep: 0,
});
