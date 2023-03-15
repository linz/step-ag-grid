import { GridApi } from "ag-grid-community";

import { isNotEmpty } from "../utils/util";

export const NoRowsOverlayComponent = (params: {
  api: GridApi;
  rowData: any[] | null | undefined;
  noRowsOverlayText: string | undefined;
}) => {
  const hasData = isNotEmpty(params.rowData);
  const hasFilteredData = (params.api?.getDisplayedRowCount() ?? 0) > 0;
  return (
    <span>
      {!hasData
        ? params.noRowsOverlayText ?? "There are currently no rows"
        : !hasFilteredData
        ? "All rows have been filtered"
        : ""}
    </span>
  );
};
