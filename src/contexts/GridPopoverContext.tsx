import { createContext, RefObject } from "react";
import { ICellEditorParams } from "ag-grid-community";

export interface PropsType {
  value: any;
  data: any;
  field: string;
  selectedRows: any[];
}

export type GridPopoverContextType = {
  anchorRef: RefObject<Element>;
  updateValueRef: RefObject<(saveFn: (selectedRows: any[]) => Promise<boolean>) => Promise<boolean>>;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  setProps: (props: ICellEditorParams, multiEdit: boolean) => void;
  propsRef: RefObject<PropsType>;
};

export const GridPopoverContext = createContext<GridPopoverContextType>({
  anchorRef: { current: null },
  updateValueRef: {
    current: async () => {
      console.error("Missing GridPopoverContext updateValueRef");
      return false;
    },
  },
  saving: false,
  setSaving: () => {},
  setProps: () => {},
  propsRef: { current: null },
});
