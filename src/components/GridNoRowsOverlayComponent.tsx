import { isEmpty } from "lodash-es";

export const NoRowsOverlayComponent = (params: {
  rowData: any[] | null | undefined;
  noRowsOverlayText: string | undefined;
}) => (
  <span>
    {isEmpty(params.rowData)
      ? params.noRowsOverlayText ?? "There are currently no rows"
      : "All rows have been filtered"}
  </span>
);
