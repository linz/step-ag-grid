import { CellClassFunc } from "ag-grid-community";
import { GridContext } from "../contexts/AgGridContext";

export const GenericSingleEditCellClass: CellClassFunc = (props): string => {
  const api = props.api;
  if (api == null) return "";

  const rowSelected = props.node.data.id == (props.context as GridContext).selectedRow?.id;

  return rowSelected && api.getEditingCells().some((cell) => cell.column.getColDef() === props.colDef)
    ? "ag-selected-for-edit"
    : "";
};

export const GenericMultiEditCellClass: CellClassFunc = (props): string => {
  const api = props.api;
  if (api == null) return "";

  const rowSelected = api
    .getSelectedNodes()
    .map((row) => row.id)
    .includes(props.node.id);

  return rowSelected && api.getEditingCells().some((cell) => cell.column.getColDef() === props.colDef)
    ? "ag-selected-for-edit"
    : "";
};

/**
 * Applies the ag-selected-for-edit class not only to the cells "being edited" as understood by ag-grid, which is the
 * cell the user right-clicked on, but also to any other cell from a selected row in the same column.
 *
 * This does not get called on the cell that is being edited, it seems.
 */
export const GenericCellClass = GenericMultiEditCellClass;
