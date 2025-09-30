import { castArray, flatten, isEmpty, remove } from 'lodash-es';
import { PropsWithChildren, useCallback, useRef, useState } from 'react';

import { GridUpdatingContext } from './GridUpdatingContext';

export type GridUpdatingContextStatus = Record<string, (number | string)[] | undefined>;

type FieldName = string;
type IdList = (number | string)[];
type UpdatingBlock = Record<FieldName, IdList[]>;

export const GridUpdatingContextProvider = (props: PropsWithChildren) => {
  const updatingBlocks = useRef<UpdatingBlock>({});
  const updating = useRef<GridUpdatingContextStatus>({});
  const [updatedDep, setUpdatedDep] = useState(0);

  const resetUpdating = useCallback(() => {
    const mergedUpdatingBlocks: GridUpdatingContextStatus = {};
    for (const key in updatingBlocks.current) {
      const arr = flatten(updatingBlocks.current[key]);
      if (arr.length) {
        mergedUpdatingBlocks[key] = arr;
      }
    }
    updating.current = mergedUpdatingBlocks;
    setUpdatedDep((updatedDep) => updatedDep + 1);
  }, []);

  const updatingCols = useCallback(() => Object.keys(updating.current), []);

  const modifyUpdating = useCallback(
    async (fields: string | string[], ids: (number | string)[], fn: () => void | Promise<void>) => {
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
    },
    [resetUpdating],
  );

  const anyUpdating = useCallback((): boolean => {
    return !isEmpty(updating.current);
  }, []);

  const checkUpdating = useCallback(
    (fields: string | string[], id: number | string): boolean =>
      castArray(fields).some((f) => updating.current[f]?.includes(id)),
    [],
  );

  return (
    <GridUpdatingContext.Provider value={{ modifyUpdating, anyUpdating, checkUpdating, updatingCols, updatedDep }}>
      {props.children}
    </GridUpdatingContext.Provider>
  );
};
