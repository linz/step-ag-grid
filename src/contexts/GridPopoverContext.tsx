import { createContext, RefObject } from "react";

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
  field: string;
  value: any;
  data: any;
  selectedRows: any[];
  updateValue: (saveFn: (selectedRows: any[]) => Promise<boolean>) => Promise<boolean>;
};

export const GridPopoverContext = createContext<GridPopoverContextType>({
  anchorRef: { current: null },
  saving: false,
  setSaving: () => {},
  field: "",
  value: null,
  data: null,
  selectedRows: [],
  updateValue: async () => false,
});
