import { CellClassParams, CellClassRules } from "ag-grid-community/dist/lib/entities/colDef";
import { ICellEditorParams } from "ag-grid-community/dist/lib/interfaces/iCellEditor";

export const GridCellMultiSelectClassRules: CellClassRules = {
  "ag-selected-for-edit": (params: CellClassParams) => {
    const { api, node, colDef } = params;
    const cep = colDef.cellEditorSelector
      ? colDef.cellEditorSelector(params as ICellEditorParams)?.params
      : colDef.cellEditorParams;

    return (
      cep?.multiEdit &&
      api
        .getSelectedNodes()
        .map((row) => row.id)
        .includes(node.id) &&
      api.getEditingCells().some((cell) => cell.column.getColDef() === colDef)
    );
  },
};
