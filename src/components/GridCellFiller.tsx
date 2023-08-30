import { ColDef } from "ag-grid-community";

export const GridCellFillerColId = "gridCellFiller";

export const isGridCellFiller = (col: ColDef) => col.colId === GridCellFillerColId;

export const GridCellFiller = (): ColDef => ({
  colId: GridCellFillerColId,
  headerName: "",
  flex: 1,
});
