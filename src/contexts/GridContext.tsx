import { ColDef, GridApi, IRowNode, ISizeColumnsToFitParams } from 'ag-grid-community';
import { CsvExportParams } from 'ag-grid-community';
import { createContext, useContext } from 'react';

import { ColDefT, GridBaseRow } from '../components';

export type GridIdType = GridBaseRow['id'];
export type GridFilterExternal<TData extends GridBaseRow> = (data: TData, rowNode: IRowNode) => boolean;

export interface AutoSizeColumnsProps {
  skipHeader?: boolean;
  colIds?: Set<string> | string[];
  userSizedColIds?: Set<string>;
}

export type AutoSizeColumnsResult = { width: number } | null;

export interface StartCellEditingProps {
  rowId: GridIdType;
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
  getSelectedRowIds: () => GridIdType[];
  getFilteredSelectedRowIds: () => GridIdType[];
  selectRowsDiff: (updateFn: () => Promise<any>) => Promise<void>;
  selectRowsWithFlashDiff: (updateFn: () => Promise<any>) => Promise<void>;
  selectRowsById: (rowIds?: GridIdType[]) => void;
  selectRowsByIdWithFlash: (rowIds?: GridIdType[]) => void;
  flashRows: (rowIds?: GridIdType[]) => void;
  flashRowsDiff: (updateFn: () => Promise<any>) => Promise<void>;
  focusByRowById: (rowId: GridIdType, ifNoCellFocused?: boolean) => void;
  ensureRowVisible: (id: GridIdType | string) => boolean;
  ensureSelectedRowIsVisible: () => void;
  getFirstRowId: () => GridIdType;
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

const NoContext = <T,>(): T => {
  console.error('Missing GridContextProvider');
  return null as T;
};

export const GridContext = createContext<GridContextType<any>>({
  gridReady: false,
  gridRenderState: () => null,
  getColDef: NoContext,
  getColumns: NoContext,
  getColumnIds: NoContext,
  invisibleColumnIds: undefined,
  setInvisibleColumnIds: NoContext,
  prePopupOps: NoContext,
  externallySelectedItemsAreInSync: false,
  setApis: NoContext,
  setQuickFilter: NoContext,
  selectRowsById: NoContext,
  getSelectedRows: NoContext,
  getFilteredSelectedRows: NoContext,
  getSelectedRowIds: NoContext,
  getFilteredSelectedRowIds: NoContext,
  selectRowsDiff: NoContext,
  selectRowsByIdWithFlash: NoContext,
  selectRowsWithFlashDiff: NoContext,
  flashRows: NoContext,
  flashRowsDiff: NoContext,
  focusByRowById: NoContext,
  ensureRowVisible: NoContext,
  ensureSelectedRowIsVisible: NoContext,
  getFirstRowId: NoContext,
  autoSizeColumns: NoContext,
  sizeColumnsToFit: NoContext,
  editingCells: NoContext,
  startCellEditing: NoContext,
  resetFocusedCellAfterCellEditing: NoContext,
  updatingCells: NoContext,
  redrawRows: NoContext,
  setExternallySelectedItemsAreInSync: NoContext,
  waitForExternallySelectedItemsToBeInSync: NoContext,
  addExternalFilter: NoContext,
  removeExternalFilter: NoContext,
  isExternalFilterPresent: NoContext,
  doesExternalFilterPass: NoContext,
  downloadCsv: NoContext,
  onBulkEditingComplete: NoContext,
  setOnBulkEditingComplete: NoContext,
  showNoRowsOverlay: NoContext,
});

export const useGridContext = <TData extends GridBaseRow>() => useContext<GridContextType<TData>>(GridContext);
