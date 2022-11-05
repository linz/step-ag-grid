import { createContext, RefObject } from "react";
import { ICellEditorParams } from "ag-grid-community";

export interface PropsType {
  value: any;
  data: any;
  field: string;
  selectedRows: any[];
  updateValue: (saveFn: (selectedRows: any[]) => Promise<boolean>) => Promise<boolean>;
}

export type GridPopoverContextType = {
  anchorRef: RefObject<Element>;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  setProps: (props: ICellEditorParams, multiEdit: boolean) => void;
  propsRef: RefObject<PropsType>;
};

export const GridPopoverContext = createContext<GridPopoverContextType>({
  anchorRef: { current: null },
  saving: false,
  setSaving: () => {},
  setProps: () => {},
  propsRef: { current: null },
});
