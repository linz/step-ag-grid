import { createContext, RefObject, useContext } from 'react';

import { GridBaseRow } from '../components/types';

export interface GridPopoverContextType<TData extends GridBaseRow> {
  anchorRef: RefObject<Element>;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  stopEditing: () => void;
  colId: string;
  field: keyof TData;
  value: any;
  data: TData;
  selectedRows: TData[];
  updateValue: (
    saveFn: (selectedRows: any[]) => Promise<boolean>,
    tabDirection: 1 | 0 | -1,
  ) => Promise<boolean> | boolean;
  formatValue: (value: any) => any;
}

export const GridPopoverContext = createContext<GridPopoverContextType<any>>({
  anchorRef: { current: null },
  saving: false,
  setSaving: () => {},
  stopEditing: () => {},
  colId: '',
  field: '',
  value: null,
  data: {} as GridBaseRow,
  selectedRows: [],
  updateValue: () => false,
  formatValue: () => '! No gridPopoverContextProvider !',
});

export const useGridPopoverContext = <TData extends GridBaseRow>() =>
  useContext<GridPopoverContextType<TData>>(GridPopoverContext);
