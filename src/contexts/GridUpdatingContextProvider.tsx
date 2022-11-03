import { ReactNode, useRef } from "react";
import { castArray, flatten, remove } from "lodash-es";
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

  const resetUpdating = () => {
    const mergedUpdatingBlocks: GridUpdatingContextStatus = {};
    for (const key in updatingBlocks.current) {
      mergedUpdatingBlocks[key] = flatten(updatingBlocks.current[key]);
    }
    updating.current = mergedUpdatingBlocks;
  };

  const modifyUpdating = async (field: string, ids: (number | string)[], fn: () => void | Promise<void>) => {
    const fieldUpdatingIds = updatingBlocks.current[field] ?? (updatingBlocks.current[field] = []);
    const idRef = [...ids];
    fieldUpdatingIds.push(idRef);
    resetUpdating();
    await fn();
    remove(fieldUpdatingIds, (idList) => idList === idRef);
    resetUpdating();
  };

  const checkUpdating = (fields: string | string[], id: number | string): boolean =>
    castArray(fields).some((f) => updating.current[f]?.includes(id));

  return (
    <GridUpdatingContext.Provider value={{ modifyUpdating, checkUpdating }}>
      {props.children}
    </GridUpdatingContext.Provider>
  );
};
