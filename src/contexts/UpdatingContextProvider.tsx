import { ReactNode, useRef } from "react";
import { castArray, flatten, remove } from "lodash-es";
import { UpdatingContext } from "./UpdatingContext";

interface UpdatingContextProviderProps {
  children: ReactNode;
}

export type UpdatingContextStatus = Record<string, (number | string)[] | undefined>;

type FieldName = string;
type IdList = (number | string)[];
type UpdatingBlock = Record<FieldName, IdList[]>;

export const UpdatingContextProvider = (props: UpdatingContextProviderProps) => {
  const updatingBlocks = useRef<UpdatingBlock>({});
  const updating = useRef<UpdatingContextStatus>({});

  const resetUpdating = () => {
    const mergedUpdatingBlocks: UpdatingContextStatus = {};
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
    <UpdatingContext.Provider value={{ modifyUpdating, checkUpdating }}>{props.children}</UpdatingContext.Provider>
  );
};
