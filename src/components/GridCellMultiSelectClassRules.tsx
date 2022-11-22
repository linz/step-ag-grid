import { CellClassParams, CellClassRules } from "ag-grid-community/dist/lib/entities/colDef";

export const GridCellMultiSelectClassRules: CellClassRules = {
  "ag-selected-for-edit": ({ api, node, colDef }: CellClassParams) =>
    api
      .getSelectedNodes()
      .map((row) => row.id)
      .includes(node.id) && api.getEditingCells().some((cell) => cell.column.getColDef() === colDef),
};
