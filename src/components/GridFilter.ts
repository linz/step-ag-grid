import { useEffect } from "react";
import { GridFilterExternal, useGridContext } from "../contexts/GridContext";
import { GridBaseRow } from "./Grid";

export const useGridFilter = <RowType extends GridBaseRow>(filter: GridFilterExternal<RowType>) => {
  const { addExternalFilter, removeExternalFilter } = useGridContext<RowType>();

  useEffect(() => {
    const thisFilter = filter;
    addExternalFilter(thisFilter);
    return () => removeExternalFilter(thisFilter);
  }, [addExternalFilter, filter, removeExternalFilter]);
};
