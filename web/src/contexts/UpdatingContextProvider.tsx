import { ReactNode, useRef, useState } from "react";
import { castArray, flatten } from "lodash-es";
import { UpdatingContext, UpdatingContextStatus } from "./UpdatingContext";

interface UpdatingContextProviderProps {
  children: ReactNode;
}

type FieldName = string;
type IdList = (number | string)[];
type UpdatingBlock = Record<FieldName, IdList[]>;

export const UpdatingContextProvider = (props: UpdatingContextProviderProps) => {
  const updatingBlocks = useRef<UpdatingBlock>({});
  const [Updating, setUpdating] = useState<UpdatingContextStatus>({});

  const resetUpdating = () => {
    const mergedUpdatingBlocks: UpdatingContextStatus = {};
    for (const key in updatingBlocks.current) {
      mergedUpdatingBlocks[key] = flatten(updatingBlocks.current[key]);
    }
    setUpdating(mergedUpdatingBlocks);
  };

  const modifyUpdating = async (field: string, ids: (number | string)[], fn: () => void | Promise<void>) => {
    let fieldUpdatingIds = updatingBlocks.current[field];
    if (fieldUpdatingIds == null) {
      fieldUpdatingIds = [];
      updatingBlocks.current[field] = fieldUpdatingIds;
    }
    fieldUpdatingIds.push(ids);
    resetUpdating();
    await fn();
    updatingBlocks.current[field] = fieldUpdatingIds.filter((idList) => idList !== ids);
    resetUpdating();
  };

  const checkUpdating = (fields: string | string[], id: number | string): boolean => {
    return castArray(fields).some((f) => Updating[f]?.includes(id));
  };

  return (
    <UpdatingContext.Provider value={{ modifyUpdating, checkUpdating, Updating }}>
      {props.children}
    </UpdatingContext.Provider>
  );
};
