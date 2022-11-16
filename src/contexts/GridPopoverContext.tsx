import { createContext, RefObject, useContext } from "react";
import { GridBaseRow } from "../components/Grid";

export interface PropsType {
  value: any;
  data: any;
  field: string;
  selectedRows: any[];
  updateValue: (saveFn: (selectedRows: any[]) => Promise<boolean>) => Promise<boolean>;
}

export interface GridPopoverContextType<RowType extends GridBaseRow> {
  anchorRef: RefObject<Element>;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  field: keyof RowType;
  value: any;
  data: RowType;
  selectedRows: RowType[];
  updateValue: (saveFn: (selectedRows: any[]) => Promise<boolean>, tabDirection: 1 | 0 | -1) => Promise<boolean>;
}

export const GridPopoverContext = createContext<GridPopoverContextType<any>>({
  anchorRef: { current: null },
  saving: false,
  setSaving: () => {},
  field: "",
  value: null,
  data: {} as GridBaseRow,
  selectedRows: [],
  updateValue: async () => false,
});

export const useGridPopoverContext = <RowType extends GridBaseRow>() =>
  useContext<GridPopoverContextType<RowType>>(GridPopoverContext);
