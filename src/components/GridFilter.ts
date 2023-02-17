import { useContext, useEffect } from "react";
import { GridContext, GridFilterExternal } from "../contexts/GridContext";

export const useGridFilter = (filter: GridFilterExternal) => {
  const { addExternalFilter, removeExternalFilter } = useContext(GridContext);

  useEffect(() => {
    const thisFilter = filter;
    addExternalFilter(thisFilter);
    return () => removeExternalFilter(thisFilter);
  }, [addExternalFilter, filter, removeExternalFilter]);
};
