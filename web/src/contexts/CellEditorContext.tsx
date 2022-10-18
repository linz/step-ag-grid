import { createContext, MutableRefObject, useRef } from "react";
import { ICellEditorParams } from "ag-grid-community";
import { BaseGridRow } from "../components/Grid";

export type SaveFn = (selectedRows: any[]) => Promise<boolean>;

export interface CellEditorContextType {
  cellEditorParamsRef: MutableRefObject<ICellEditorParams>;
  saveRef: MutableRefObject<SaveFn>;
}

export const CellEditorContext = createContext<CellEditorContextType>({
  cellEditorParamsRef: {} as CellEditorContextType["cellEditorParamsRef"],
  saveRef: {} as CellEditorContextType["saveRef"],
});
