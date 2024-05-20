import { ColDef } from "ag-grid-community";
import { GridBaseRow } from "./Grid";

export const GridCellFillerColId = "gridCellFiller";

export const isGridCellFiller = (col: ColDef) => col.colId === GridCellFillerColId;

export const GridCellFiller = <TData extends GridBaseRow>(): ColDef<TData, any> => ({
  colId: GridCellFillerColId,
  headerName: "",
  flex: 1,
});
