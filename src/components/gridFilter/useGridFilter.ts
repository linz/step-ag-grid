import { useContext, useEffect } from 'react';

import { GridContext, GridFilterExternal } from '../../contexts/GridContext';
import { GridBaseRow } from '../Grid';

export const useGridFilter = <TData extends GridBaseRow>(filter: GridFilterExternal<TData> | undefined) => {
  const { addExternalFilter, removeExternalFilter } = useContext(GridContext);

  useEffect(() => {
    const thisFilter = filter;
    thisFilter && addExternalFilter(thisFilter);
    return () => {
      thisFilter && removeExternalFilter(thisFilter);
    };
  }, [addExternalFilter, filter, removeExternalFilter]);
};
