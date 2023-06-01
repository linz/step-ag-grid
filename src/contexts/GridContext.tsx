import { ColumnApi, GridApi, RowNode } from "ag-grid-community";
import { CsvExportParams } from "ag-grid-community/dist/lib/interfaces/exportParams";
import { createContext, useContext } from "react";

import { ColDefT, GridBaseRow } from "../components";

export type GridFilterExternal<RowType extends GridBaseRow> = (data: RowType, rowNode: RowNode) => boolean;

export interface GridContextType<RowType extends GridBaseRow> {
  gridReady: boolean;
  setApis: (gridApi: GridApi | undefined, columnApi: ColumnApi | undefined, dataTestId?: string) => void;
  prePopupOps: () => void;
  setQuickFilter: (quickFilter: string) => void;
  editingCells: () => boolean;
  getSelectedRows: <T extends GridBaseRow>() => T[];
  getFilteredSelectedRows: <T extends GridBaseRow>() => T[];
  getSelectedRowIds: () => number[];
  getFilteredSelectedRowIds: () => number[];
  selectRowsDiff: (updateFn: () => Promise<any>) => Promise<void>;
  selectRowsWithFlashDiff: (updateFn: () => Promise<any>) => Promise<void>;
  selectRowsById: (rowIds?: number[]) => void;
  selectRowsByIdWithFlash: (rowIds?: number[]) => void;
  flashRows: (rowIds?: number[]) => void;
  flashRowsDiff: (updateFn: () => Promise<any>) => Promise<void>;
  focusByRowById: (rowId: number) => void;
  ensureRowVisible: (id: number | string) => boolean;
  ensureSelectedRowIsVisible: () => void;
  getFirstRowId: () => number;
  autoSizeAllColumns: (props?: { skipHeader?: boolean }) => { width: number } | null;
  sizeColumnsToFit: () => void;
  stopEditing: () => void;
  updatingCells: (
    props: { selectedRows: GridBaseRow[]; field?: string },
    fnUpdate: (selectedRows: any[]) => Promise<boolean>,
    setSaving?: (saving: boolean) => void,
    tabDirection?: 1 | 0 | -1,
  ) => Promise<boolean>;
  redrawRows: (rowNodes?: RowNode[]) => void;
  externallySelectedItemsAreInSync: boolean;
  setExternallySelectedItemsAreInSync: (inSync: boolean) => void;
  waitForExternallySelectedItemsToBeInSync: () => Promise<void>;
  addExternalFilter: (filter: GridFilterExternal<RowType>) => void;
  removeExternalFilter: (filter: GridFilterExternal<RowType>) => void;
  isExternalFilterPresent: () => boolean;
  doesExternalFilterPass: (node: RowNode) => boolean;
  getColumns: () => ColDefT<RowType>[];
  invisibleColumnIds: string[];
  setInvisibleColumnIds: (colIds: string[]) => void;
  downloadCsv: (csvExportParams?: CsvExportParams) => void;
}

export const GridContext = createContext<GridContextType<any>>({
  gridReady: false,
  getColumns: () => {
    console.error("no context provider for getColumns");
    return [];
  },
  invisibleColumnIds: [],
  setInvisibleColumnIds: () => {
    console.error("no context provider for setInvisibleColumnIds");
  },
  prePopupOps: () => {
    console.error("no context provider for prePopupOps");
  },
  externallySelectedItemsAreInSync: false,
  setApis: () => {
    console.error("no context provider for setApis");
  },
  setQuickFilter: () => {
    console.error("no context provider for setQuickFilter");
  },
  selectRowsById: () => {
    console.error("no context provider for selectRows");
  },
  getSelectedRows: <T extends unknown>(): T[] => {
    console.error("no context provider for getSelectedRows");
    return [];
  },
  getFilteredSelectedRows: <T extends unknown>(): T[] => {
    console.error("no context provider for getFilteredSelectedRows");
    return [];
  },
  getSelectedRowIds: () => {
    console.error("no context provider for getSelectedRowIds");
    return [];
  },
  getFilteredSelectedRowIds: () => {
    console.error("no context provider for getFilteredSelectedRowIds");
    return [];
  },
  selectRowsDiff: async () => {
    console.error("no context provider for selectRowsDiff");
  },
  selectRowsByIdWithFlash: () => {
    console.error("no context provider for selectRowsWithFlash");
  },
  selectRowsWithFlashDiff: async () => {
    console.error("no context provider for selectRowsWithFlashDiff");
  },
  flashRows: () => {
    console.error("no context provider for flashRows");
  },
  flashRowsDiff: async () => {
    console.error("no context provider for flashRows");
  },
  focusByRowById: async () => {
    console.error("no context provider for focusByRowById");
  },
  ensureRowVisible: () => {
    console.error("no context provider for ensureRowVisible");
    return true;
  },
  ensureSelectedRowIsVisible: () => {
    console.error("no context provider for ensureSelectedRowIsVisible");
  },
  getFirstRowId: () => {
    console.error("no context provider for getFirstRowId");
    return -1;
  },
  autoSizeAllColumns: () => {
    console.error("no context provider for autoSizeAllColumns");
    return null;
  },
  sizeColumnsToFit: () => {
    console.error("no context provider for autoSizeAllColumns");
    return null;
  },
  editingCells: () => {
    console.error("no context provider for editingCells");
    return false;
  },
  stopEditing: () => {
    console.error("no context provider for stopEditing");
  },
  updatingCells: async () => {
    console.error("no context provider for modifyUpdating");
    return false;
  },
  redrawRows: () => {
    console.error("no context provider for redrawRows");
  },
  setExternallySelectedItemsAreInSync: () => {
    console.error("no context provider for setExternallySelectedItemsAreInSync");
  },
  waitForExternallySelectedItemsToBeInSync: async () => {
    console.error("no context provider for waitForExternallySelectedItemsToBeInSync");
  },
  addExternalFilter: () => {
    console.error("no context provider for addExternalFilter");
  },
  removeExternalFilter: () => {
    console.error("no context provider for removeExternalFilter");
  },
  isExternalFilterPresent: () => {
    console.error("no context provider for isExternalFilterPresent");
    return false;
  },
  doesExternalFilterPass: () => {
    console.error("no context provider for doesExternalFilterPass");
    return true;
  },
  downloadCsv: () => {
    console.error("no context provider for downloadCsv");
  },
});

export const useGridContext = <RowType extends GridBaseRow>() => useContext<GridContextType<RowType>>(GridContext);
