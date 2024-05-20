import { ColDef, ColumnApi, GridApi, IRowNode } from "ag-grid-community";
import { CsvExportParams } from "ag-grid-community";
import { createContext, useContext } from "react";

import { ColDefT, GridBaseRow } from "../components";

export type GridFilterExternal<TData extends GridBaseRow> = (data: TData, rowNode: IRowNode) => boolean;

export interface AutoSizeColumnsProps {
  skipHeader?: boolean;
  colIds?: Set<string> | string[];
  userSizedColIds?: Set<string>;
  includeFlex?: boolean;
}

export type AutoSizeColumnsResult = { width: number } | null;

export interface GridContextType<TData extends GridBaseRow> {
  gridReady: boolean;
  gridRenderState: () => null | "empty" | "rows-visible";
  getColDef: (colId?: string) => ColDef | undefined;
  getColumns: (
    filter?: keyof ColDef | ((r: ColDef) => boolean | undefined | null | number | string),
  ) => ColDefT<TData, any>[];
  getColumnIds: (filter?: keyof ColDef | ((r: ColDef) => boolean | undefined | null | number | string)) => string[];
  setApis: (gridApi: GridApi | undefined, columnApi: ColumnApi | undefined, dataTestId?: string) => void;
  prePopupOps: () => void;
  postPopupOps: () => void;
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
  focusByRowById: (rowId: number, ifNoCellFocused?: boolean) => void;
  ensureRowVisible: (id: number | string) => boolean;
  ensureSelectedRowIsVisible: () => void;
  getFirstRowId: () => number;
  autoSizeColumns: (props?: AutoSizeColumnsProps) => AutoSizeColumnsResult;
  sizeColumnsToFit: () => void;
  cancelEdit: () => void;
  startCellEditing: ({ rowId, colId }: { rowId: number; colId: string }) => void;
  stopEditing: () => void;
  updatingCells: (
    props: { selectedRows: GridBaseRow[]; field?: string },
    fnUpdate: (selectedRows: any[]) => Promise<boolean>,
    setSaving?: (saving: boolean) => void,
    tabDirection?: 1 | 0 | -1,
  ) => Promise<boolean>;
  redrawRows: (rowNodes?: IRowNode[]) => void;
  externallySelectedItemsAreInSync: boolean;
  setExternallySelectedItemsAreInSync: (inSync: boolean) => void;
  waitForExternallySelectedItemsToBeInSync: () => Promise<void>;
  addExternalFilter: (filter: GridFilterExternal<TData>) => void;
  removeExternalFilter: (filter: GridFilterExternal<TData>) => void;
  isExternalFilterPresent: () => boolean;
  doesExternalFilterPass: (node: IRowNode) => boolean;
  invisibleColumnIds: string[] | undefined;
  setInvisibleColumnIds: (colIds: string[]) => void;
  downloadCsv: (csvExportParams?: CsvExportParams) => void;
  setOnCellEditingComplete: (callback: (() => void) | undefined) => void;
  showNoRowsOverlay: () => void;
}

export const GridContext = createContext<GridContextType<any>>({
  gridReady: false,
  gridRenderState: () => null,
  getColDef: () => {
    console.error("no context provider for getColDef");
    return undefined;
  },
  getColumns: () => {
    console.error("no context provider for getColumns");
    return [];
  },
  getColumnIds: () => {
    console.error("no context provider for getColumnIds");
    return [];
  },
  invisibleColumnIds: undefined,
  setInvisibleColumnIds: () => {
    console.error("no context provider for setInvisibleColumnIds");
  },
  prePopupOps: () => {
    console.error("no context provider for prePopupOps");
  },
  postPopupOps: () => {
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
  autoSizeColumns: () => {
    console.error("no context provider for autoSizeColumns");
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
  cancelEdit: () => {
    console.error("no context provider for cancelEdit");
  },
  startCellEditing: () => {
    console.error("no context provider for startCellEditing");
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
  setOnCellEditingComplete: () => {
    console.error("no context provider for setOnCellEditingComplete");
  },
  showNoRowsOverlay: () => {
    console.error("no context provider for showLoadingOverlay");
  },
});

export const useGridContext = <TData extends GridBaseRow>() => useContext<GridContextType<TData>>(GridContext);
