import { ColDef, GridApi, IRowNode, ISizeColumnsToFitParams } from 'ag-grid-community';
import { CsvExportParams } from 'ag-grid-community';
import { createContext, useContext } from 'react';

import { ColDefT, GridBaseRow } from '../components';

export type GridFilterExternal<TData extends GridBaseRow> = (data: TData, rowNode: IRowNode) => boolean;

export interface AutoSizeColumnsProps {
  skipHeader?: boolean;
  colIds?: Set<string> | string[];
  userSizedColIds?: Set<string>;
}

export type AutoSizeColumnsResult = { width: number } | null;

export interface StartCellEditingProps {
  rowId: number;
  colId: string;
}

export interface GridContextType<TData extends GridBaseRow> {
  gridReady: boolean;
  gridRenderState: () => null | 'empty' | 'rows-visible';
  getColDef: (colId?: string) => ColDef | undefined;
  getColumns: (
    filter?: keyof ColDef | ((r: ColDef) => boolean | undefined | null | number | string),
  ) => ColDefT<TData, any>[];
  getColumnIds: (filter?: keyof ColDef | ((r: ColDef) => boolean | undefined | null | number | string)) => string[];
  setApis: (gridApi: GridApi | undefined, hasExternallySelectedItems: boolean, dataTestId?: string) => void;
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
  focusByRowById: (rowId: number, ifNoCellFocused?: boolean) => void;
  ensureRowVisible: (id: number | string) => boolean;
  ensureSelectedRowIsVisible: () => void;
  getFirstRowId: () => number;
  autoSizeColumns: (props?: AutoSizeColumnsProps) => Promise<AutoSizeColumnsResult>;
  sizeColumnsToFit: (paramsOrGridWidth?: ISizeColumnsToFitParams) => void;
  startCellEditing: ({ rowId, colId }: StartCellEditingProps) => Promise<void>;
  // Restores the previous focus after cell editing
  resetFocusedCellAfterCellEditing: () => void;
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
  onBulkEditingComplete: () => Promise<void> | void;
  setOnBulkEditingComplete: (callback: (() => Promise<void> | void) | undefined) => void;
  showNoRowsOverlay: () => void;
}

export const GridContext = createContext<GridContextType<any>>({
  gridReady: false,
  gridRenderState: () => null,
  getColDef: () => {
    console.error('no context provider for getColDef');
    return undefined;
  },
  getColumns: () => {
    console.error('no context provider for getColumns');
    return [];
  },
  getColumnIds: () => {
    console.error('no context provider for getColumnIds');
    return [];
  },
  invisibleColumnIds: undefined,
  setInvisibleColumnIds: () => {
    console.error('no context provider for setInvisibleColumnIds');
  },
  prePopupOps: () => {
    console.error('no context provider for prePopupOps');
  },
  externallySelectedItemsAreInSync: false,
  setApis: () => {
    console.error('no context provider for setApis');
  },
  setQuickFilter: () => {
    console.error('no context provider for setQuickFilter');
  },
  selectRowsById: () => {
    console.error('no context provider for selectRows');
  },
  getSelectedRows: <T,>(): T[] => {
    console.error('no context provider for getSelectedRows');
    return [];
  },
  getFilteredSelectedRows: <T,>(): T[] => {
    console.error('no context provider for getFilteredSelectedRows');
    return [];
  },
  getSelectedRowIds: () => {
    console.error('no context provider for getSelectedRowIds');
    return [];
  },
  getFilteredSelectedRowIds: () => {
    console.error('no context provider for getFilteredSelectedRowIds');
    return [];
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  selectRowsDiff: async () => {
    console.error('no context provider for selectRowsDiff');
  },
  selectRowsByIdWithFlash: () => {
    console.error('no context provider for selectRowsWithFlash');
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  selectRowsWithFlashDiff: async () => {
    console.error('no context provider for selectRowsWithFlashDiff');
  },
  flashRows: () => {
    console.error('no context provider for flashRows');
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  flashRowsDiff: async () => {
    console.error('no context provider for flashRows');
  },
  // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-misused-promises
  focusByRowById: async () => {
    console.error('no context provider for focusByRowById');
  },
  ensureRowVisible: () => {
    console.error('no context provider for ensureRowVisible');
    return true;
  },
  ensureSelectedRowIsVisible: () => {
    console.error('no context provider for ensureSelectedRowIsVisible');
  },
  getFirstRowId: () => {
    console.error('no context provider for getFirstRowId');
    return -1;
  },
  autoSizeColumns: async () => {
    console.error('no context provider for autoSizeColumns');
    return Promise.resolve(null);
  },
  sizeColumnsToFit: () => {
    console.error('no context provider for autoSizeAllColumns');
    return null;
  },
  editingCells: () => {
    console.error('no context provider for editingCells');
    return false;
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  startCellEditing: async () => {
    console.error('no context provider for startCellEditing');
  },
  resetFocusedCellAfterCellEditing: () => {
    console.error('no context provider for resetFocusedCellAfterCellEditing');
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  updatingCells: async () => {
    console.error('no context provider for modifyUpdating');
    return false;
  },
  redrawRows: () => {
    console.error('no context provider for redrawRows');
  },
  setExternallySelectedItemsAreInSync: () => {
    console.error('no context provider for setExternallySelectedItemsAreInSync');
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  waitForExternallySelectedItemsToBeInSync: async () => {
    console.error('no context provider for waitForExternallySelectedItemsToBeInSync');
  },
  addExternalFilter: () => {
    console.error('no context provider for addExternalFilter');
  },
  removeExternalFilter: () => {
    console.error('no context provider for removeExternalFilter');
  },
  isExternalFilterPresent: () => {
    console.error('no context provider for isExternalFilterPresent');
    return false;
  },
  doesExternalFilterPass: () => {
    console.error('no context provider for doesExternalFilterPass');
    return true;
  },
  downloadCsv: () => {
    console.error('no context provider for downloadCsv');
  },
  onBulkEditingComplete: () => {
    console.error('no context provider for onBulkEditingComplete');
  },
  setOnBulkEditingComplete: () => {
    console.error('no context provider for setOnBulkEditingComplete');
  },
  showNoRowsOverlay: () => {
    console.error('no context provider for showLoadingOverlay');
  },
});

export const useGridContext = <TData extends GridBaseRow>() => useContext<GridContextType<TData>>(GridContext);
