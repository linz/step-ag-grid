import { createContext, RefObject } from "react";
import { ICellEditorParams } from "ag-grid-community";

export interface GridSubComponentContextType {
  value: any;
  setValue: (value: string) => void;
  setValid: (valid: boolean) => void;
  triggerSave: () => Promise<void>;
}

export const GridSubComponentContext = createContext<GridSubComponentContextType>({
  value: "GridSubComponentContext value no context",
  setValue: () => {
    console.error("GridSubComponentContext setValue no context");
  },
  setValid: () => {
    console.error("GridSubComponentContext setValid no context");
  },
  triggerSave: async () => {
    console.error("GridSubComponentContext triggerSave no context");
  },
});
