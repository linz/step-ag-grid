import { useContext, useEffect } from "react";
import { GridContext, GridFilterExternal } from "../contexts/GridContext";
import { GridBaseRow } from "./Grid";

export const useGridFilter = <RowType extends GridBaseRow>(filter: GridFilterExternal<RowType>) => {
  const { addExternalFilter, removeExternalFilter } = useContext(GridContext);

  useEffect(() => {
    const thisFilter = filter;
    addExternalFilter(thisFilter);
    return () => removeExternalFilter(thisFilter);
  }, [addExternalFilter, filter, removeExternalFilter]);
};
