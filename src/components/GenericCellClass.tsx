import { CellClassFunc } from "ag-grid-community";

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
