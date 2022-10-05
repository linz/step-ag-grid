import { createContext } from "react";
import { GridApi } from "ag-grid-community";

export type AgGridContextType = {
  gridReady: () => boolean;
  setGridApi: (gridApi: GridApi | undefined) => void;
  setQuickFilter: (quickFilter: string) => void;
  selectRows: (rowIds?: number[]) => void;
  editingCells: () => boolean;
  getSelectedRows: <T extends unknown>() => T[];
  getSelectedRowIds: () => number[];
  selectRowsDiff: (updateFn: () => Promise<any>) => Promise<void>;
  selectRowsWithFlash: (rowIds?: number[]) => void;
  selectRowsWithFlashDiff: (updateFn: () => Promise<any>) => Promise<void>;
  setSelectedRowIds: (ids: number[]) => void;
  flashRows: (rowIds?: number[]) => void;
  flashRowsDiff: (updateFn: () => Promise<any>) => Promise<void>;
  ensureRowVisible: (id: number) => void;
  ensureSelectedRowIsVisible: () => void;
  stopEditing: () => void;
};

export const AgGridContext = createContext<AgGridContextType>({
  gridReady: () => {
    console.error("no context provider for gridReady");
    return false;
  },
  setGridApi: () => {
    console.error("no context provider for setGridApi");
  },
  setQuickFilter: () => {
    console.error("no context provider for setQuickFilter");
  },
  selectRows: () => {
    console.error("no context provider for selectRows");
  },
  getSelectedRows: <T extends unknown>(): T[] => {
    console.error("no context provider for getSelectedRows");
    return [];
  },
  getSelectedRowIds: () => {
    console.error("no context provider for getSelectedRowIds");
    return [];
  },
  selectRowsDiff: async () => {
    console.error("no context provider for selectRowsDiff");
  },
  selectRowsWithFlash: () => {
    console.error("no context provider for selectRowsWithFlash");
  },
  selectRowsWithFlashDiff: async () => {
    console.error("no context provider for selectRowsWithFlashDiff");
  },
  setSelectedRowIds: () => {
    console.error("no context provider for setSelectedRowIds");
  },
  flashRows: () => {
    console.error("no context provider for flashRows");
  },
  flashRowsDiff: async () => {
    console.error("no context provider for flashRows");
  },
  ensureRowVisible: () => {
    console.error("no context provider for ensureRowVisible");
  },
  ensureSelectedRowIsVisible: () => {
    console.error("no context provider for ensureSelectedRowIsVisible");
  },
  editingCells: () => {
    console.error("no context provider for editingCells");
    return false;
  },
  stopEditing: () => {
    console.error("no context provider for stopEditing");
  },
});
