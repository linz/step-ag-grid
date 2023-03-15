import { GridApi } from "ag-grid-community";

import { isNotEmpty } from "../utils/util";

export const NoRowsOverlayComponentFn = (noRowsOverlayText: string | undefined) =>
  function NoRowsOverlayComponent(params: { api: GridApi }) {
    const hasData = isNotEmpty(params.api.getModel().getRowCount());
    const hasFilteredData = params.api.getDisplayedRowCount() > 0;
    return (
      <span>
        {!hasData
          ? noRowsOverlayText ?? "There are currently no rows"
          : !hasFilteredData
          ? "All rows have been filtered"
          : ""}
      </span>
    );
  };
