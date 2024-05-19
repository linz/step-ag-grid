import { ColDef } from "ag-grid-community";
import { GridBaseRow } from "./Grid";

export const GridCellFillerColId = "gridCellFiller";

export const isGridCellFiller = (col: ColDef) => col.colId === GridCellFillerColId;

export const GridCellFiller = <RowType extends GridBaseRow>(): ColDef<RowType, any> => ({
  colId: GridCellFillerColId,
  headerName: "",
  flex: 1,
});
