import { useContext, useEffect } from "react";

import { GridContext, GridFilterExternal } from "../contexts/GridContext";
import { GridBaseRow } from "./Grid";

export const useGridFilter = <RowType extends GridBaseRow>(filter: GridFilterExternal<RowType> | undefined) => {
  const { addExternalFilter, removeExternalFilter } = useContext(GridContext);

  useEffect(() => {
    const thisFilter = filter;
    thisFilter && addExternalFilter(thisFilter);
    return () => {
      thisFilter && removeExternalFilter(thisFilter);
    };
  }, [addExternalFilter, filter, removeExternalFilter]);
};
