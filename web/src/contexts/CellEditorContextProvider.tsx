import { ReactNode, useRef } from "react";
import { ICellEditorParams } from "ag-grid-community";
import { CellEditorContext, SaveFn } from "./CellEditorContext";

interface CellEditorContextProps {
  children: ReactNode;
}

export const CellEditorContextProvider = (props: CellEditorContextProps) => {
  const cellEditorParamsRef = useRef<ICellEditorParams>({} as ICellEditorParams);
  const saveRef = useRef<SaveFn>(async () => {
    return false;
  });

  return (
    <CellEditorContext.Provider value={{ cellEditorParamsRef, saveRef }}>{props.children}</CellEditorContext.Provider>
  );
};
