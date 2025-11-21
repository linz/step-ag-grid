import { useEffect } from 'react';

import { GridFilterExternal, useGridContext } from '../../contexts/GridContext';
import { GridBaseRow } from '../types';

export const useGridFilter = <TData extends GridBaseRow>(filter: GridFilterExternal<TData> | undefined) => {
  const { addExternalFilter, removeExternalFilter } = useGridContext<TData>();

  useEffect(() => {
    const thisFilter = filter;
    thisFilter && addExternalFilter(thisFilter);
    return () => {
      thisFilter && removeExternalFilter(thisFilter);
    };
  }, [addExternalFilter, filter, removeExternalFilter]);
};
