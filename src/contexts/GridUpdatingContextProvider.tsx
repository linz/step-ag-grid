import { castArray, flatten, remove } from "lodash-es";
import { ReactNode, useRef, useState } from "react";

import { GridUpdatingContext } from "./GridUpdatingContext";

interface UpdatingContextProviderProps {
  children: ReactNode;
}

export type GridUpdatingContextStatus = Record<string, (number | string)[] | undefined>;

type FieldName = string;
type IdList = (number | string)[];
type UpdatingBlock = Record<FieldName, IdList[]>;

export const GridUpdatingContextProvider = (props: UpdatingContextProviderProps) => {
  const updatingBlocks = useRef<UpdatingBlock>({});
  const updating = useRef<GridUpdatingContextStatus>({});
  const [updatedDep, setUpdatedDep] = useState(0);

  const resetUpdating = () => {
    const mergedUpdatingBlocks: GridUpdatingContextStatus = {};
    for (const key in updatingBlocks.current) {
      mergedUpdatingBlocks[key] = flatten(updatingBlocks.current[key]);
    }
    updating.current = mergedUpdatingBlocks;
    setUpdatedDep((updatedDep) => updatedDep + 1);
  };

  const modifyUpdating = async (
    fields: string | string[],
    ids: (number | string)[],
    fn: () => void | Promise<void>,
  ) => {
    const idRef = [...ids];
    castArray(fields).forEach((field) => {
      const fieldUpdatingIds = updatingBlocks.current[field] ?? (updatingBlocks.current[field] = []);
      fieldUpdatingIds.push(idRef);
    });
    resetUpdating();
    await fn();
    castArray(fields).forEach((field) => {
      const fieldUpdatingIds = updatingBlocks.current[field];
      remove(fieldUpdatingIds, (idList) => idList === idRef);
    });
    resetUpdating();
  };

  const checkUpdating = (fields: string | string[], id: number | string): boolean =>
    castArray(fields).some((f) => updating.current[f]?.includes(id));

  return (
    <GridUpdatingContext.Provider value={{ modifyUpdating, checkUpdating, updatedDep }}>
      {props.children}
    </GridUpdatingContext.Provider>
  );
};
