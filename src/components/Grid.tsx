import {
  AgGridEvent,
  AllCommunityModule,
  CellClassParams,
  CellClickedEvent,
  CellDoubleClickedEvent,
  CellEditingStartedEvent,
  CellKeyDownEvent,
  ColDef,
  ColGroupDef,
  ColumnResizedEvent,
  EditableCallback,
  EditableCallbackParams,
  GridOptions,
  GridReadyEvent,
  ModelUpdatedEvent,
  ModuleRegistry,
  RowDragEndEvent,
  RowDragMoveEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import { defer, difference, isEmpty, last, omit, xorBy } from 'lodash-es';
import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { GridContext, useGridContext } from '../contexts/GridContext';
import { GridUpdatingContext } from '../contexts/GridUpdatingContext';
import { fnOrVar, isNotEmpty } from '../utils/util';
import { clickInputWhenContainingCellClicked } from './clickInputWhenContainingCellClicked';
import { GridHeaderSelect } from './gridHeader';
import { GridContextMenuComponent, useGridContextMenu } from './gridHook';
import { GridNoRowsOverlay } from './GridNoRowsOverlay';
import { usePostSortRowsHook } from './PostSortRowsHook';

ModuleRegistry.registerModules([AllCommunityModule]);

let timeOfLastSingleClick = 0;
let lastClickColId: unknown;
let lastClickRowIndex: unknown;

const resetClickDebounce = () => {
  timeOfLastSingleClick = 0;
  lastClickColId = '';
  lastClickRowIndex = -1;
};

/**
 * If click is more than 200ms since last click return true.
 */
const clickDebounceSkipClick = (colId: unknown, rowIndex: unknown): boolean => {
  const doubleClickMs = 200;

  if (
    Date.now() - timeOfLastSingleClick < doubleClickMs &&
    lastClickColId === colId &&
    lastClickRowIndex === rowIndex
  ) {
    // Skipping double click due to single click edit
    return true;
  }
  timeOfLastSingleClick = Date.now();
  lastClickColId = colId;
  lastClickRowIndex = rowIndex;
  return false;
};

export interface GridBaseRow {
  id: string | number;
}

export interface GridOnRowDragEndProps<TData extends GridBaseRow> {
  movedRow: TData;
  targetRow: TData;
  direction: -1 | 1;
}

export interface GridProps<TData extends GridBaseRow = GridBaseRow> {
  readOnly?: boolean; // set all editables to false when read only, make all styles black, otherwise style is gray for not editable
  defaultPostSort?: boolean; // Retain sort order after edit, Defaults to true.
  selectable?: boolean;
  enableClickSelection?: boolean;
  enableSelectionWithoutKeys?: boolean;
  hideSelectColumn?: boolean;
  theme?: string; // should have prefix ag-theme-
  ['data-testid']?: string;
  domLayout?: GridOptions['domLayout'];
  externalSelectedItems?: any[];
  setExternalSelectedItems?: (items: any[]) => void;
  defaultColDef?: GridOptions['defaultColDef'];
  columnDefs: ColDef<TData>[];
  rowData: GridOptions['rowData'];
  selectColumnPinned?: ColDef['pinned'];
  noRowsOverlayText?: string;
  noRowsMatchingOverlayText?: string;
  animateRows?: boolean;
  rowHeight?: number;
  rowClassRules?: GridOptions['rowClassRules'];
  rowSelection?: 'single' | 'multiple';
  autoSelectFirstRow?: boolean;
  onColumnMoved?: GridOptions['onColumnMoved'];
  rowDragText?: GridOptions['rowDragText'];
  onRowDragEnd?: (props: GridOnRowDragEndProps<TData>) => Promise<void> | void;
  alwaysShowVerticalScroll?: boolean;
  suppressColumnVirtualization?: GridOptions['suppressColumnVirtualisation'];
  /**
   * When the grid is rendered using sizeColumns=="auto" this is called initially with the required container size to fit all content.
   * This allows you set the size of the panel to fit perfectly.
   */
  onContentSize?: (props: { width: number }) => void;
  /**
   * <ul>
   * <li>"none" to use aggrid defaults.</li>
   * <li>"fit" will adjust columns to fit within panel via min/max/initial sizing.
   * <b>Note:</b> This is only really needed if you have auto-height columns which prevents "auto" from working.
   * </li>
   * <li>"auto" will size columns based on their content but still obeying min/max sizing.</li>
   * <li>"auto-skip-headers" (default) same as auto but does not take headers into account.</li>
   * </ul>
   *
   * If you want to stretch to container width if width is greater than the container add a flex column.
   */
  sizeColumns?: 'fit' | 'auto' | 'auto-skip-headers' | 'none';
  /**
   * When pressing tab whilst editing the grid will select and edit the next cell if available.
   * Once the last cell to edit closes this callback is called.
   */
  onCellEditingComplete?: () => void;

  /**
   * Context menu definition if required.
   */
  contextMenu?: GridContextMenuComponent<any>;

  /**
   * Whether to select row on context menu.
   */
  contextMenuSelectRow?: boolean;

  /**
   * Defaults to false.
   */
  singleClickEdit?: boolean;

  loading?: boolean;
  suppressCellFocus?: boolean;
  pinnedTopRowData?: GridOptions['pinnedTopRowData'];
  pinnedBottomRowData?: GridOptions['pinnedBottomRowData'];
}

/**
 * Wrapper for AgGrid to add commonly used functionality.
 */
export const Grid = <TData extends GridBaseRow = GridBaseRow>({
  'data-testid': dataTestId,
  defaultPostSort = true,
  rowSelection = 'multiple',
  suppressColumnVirtualization = true,
  theme = 'ag-theme-step-default',
  sizeColumns = 'auto',
  selectColumnPinned = 'left',
  contextMenuSelectRow = false,
  singleClickEdit = false,
  rowData,
  rowHeight = theme === 'ag-theme-step-default' ? 40 : theme === 'ag-theme-step-compact' ? 36 : 40,
  selectable,
  ...params
}: GridProps<TData>): ReactElement => {
  const {
    gridReady,
    gridRenderState,
    setApis,
    ensureRowVisible,
    getFirstRowId,
    selectRowsById,
    focusByRowById,
    ensureSelectedRowIsVisible,
    autoSizeColumns,
    sizeColumnsToFit,
    externallySelectedItemsAreInSync,
    setExternallySelectedItemsAreInSync,
    isExternalFilterPresent,
    doesExternalFilterPass,
    setOnCellEditingComplete,
    getColDef,
    showNoRowsOverlay,
    prePopupOps,
    stopEditing,
  } = useContext(GridContext);
  const { startCellEditing } = useGridContext();
  const { updatedDep, updatingCols } = useContext(GridUpdatingContext);

  const gridDivRef = useRef<HTMLDivElement>(null);
  const lastSelectedIds = useRef<number[]>([]);

  const [staleGrid, setStaleGrid] = useState(false);
  const [autoSized, setAutoSized] = useState(false);

  const postSortRows = usePostSortRowsHook({ setStaleGrid });

  /**
   * onContentSize should only be called at maximum twice.
   * Once when an empty grid is loaded.
   * And again when the grid has content.
   */
  const hasSetContentSize = useRef(false);
  const hasSetContentSizeEmpty = useRef(false);
  const needsAutoSize = useRef(true);

  const lastFullResize = useRef<number>();

  const setInitialContentSize = useCallback(() => {
    if (!gridDivRef.current?.clientWidth || rowData == null) {
      // Don't resize grids if they are offscreen as it doesn't work.
      needsAutoSize.current = true;
      return;
    }

    const gridRendered = gridRenderState();
    if (gridRendered === null) {
      // Don't resize until grid has rendered, or it has 0 rows.
      needsAutoSize.current = true;
      return;
    }

    const skipHeader = sizeColumns === 'auto-skip-headers' && gridRendered === 'rows-visible';
    if (sizeColumns === 'auto' || skipHeader) {
      const result = autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current, includeFlex: true });
      if (!result) {
        needsAutoSize.current = true;
        return;
      }
      if (gridRendered === 'empty') {
        if (!hasSetContentSizeEmpty.current && !hasSetContentSize.current) {
          hasSetContentSizeEmpty.current = true;
          params.onContentSize?.(result);
        }
      } else if (gridRendered === 'rows-visible') {
        if (!hasSetContentSize.current) {
          if (lastFullResize.current === result.width) {
            hasSetContentSize.current = true;
            params.onContentSize?.(result);
          } else {
            needsAutoSize.current = true;
          }
          lastFullResize.current = result.width;
        }
      } else {
        // It should be impossible to get here
        console.error('Unknown value returned from hasGridRendered');
      }
    }

    if (sizeColumns !== 'none') {
      sizeColumnsToFit();
    }
    setAutoSized(true);
    needsAutoSize.current = false;
  }, [autoSizeColumns, gridRenderState, params, rowData, sizeColumns, sizeColumnsToFit]);

  const lastOwnerDocumentRef = useRef<Document>();

  /**
   * Auto-size windows that had deferred auto-size
   */
  useInterval(() => {
    // Check if window has been popped out and needs resize
    const currentDocument = gridDivRef.current?.ownerDocument;
    if (currentDocument !== lastOwnerDocumentRef.current) {
      lastOwnerDocumentRef.current = currentDocument;
      if (currentDocument) {
        needsAutoSize.current = true;
      }
    }
    if (needsAutoSize.current || (!hasSetContentSize.current && sizeColumns === 'auto')) {
      needsAutoSize.current = false;
      setInitialContentSize();
    }
  }, 200);

  /**
   * On data load select the first row of the grid if required.
   */
  const hasSelectedFirstItem = useRef(false);
  useEffect(() => {
    if (!gridReady || hasSelectedFirstItem.current || !rowData || !externallySelectedItemsAreInSync) return;
    hasSelectedFirstItem.current = true;
    if (isNotEmpty(rowData) && isEmpty(params.externalSelectedItems)) {
      const firstRowId = getFirstRowId();
      if (params.autoSelectFirstRow) {
        selectRowsById([firstRowId]);
      } else {
        focusByRowById(firstRowId, true);
      }
    }
  }, [
    externallySelectedItemsAreInSync,
    focusByRowById,
    gridReady,
    params.externalSelectedItems,
    params.autoSelectFirstRow,
    rowData,
    selectRowsById,
    getFirstRowId,
  ]);

  /**
   * Ensure external selected items list is in sync with panel.
   */
  const synchroniseExternalStateToGridSelection = useCallback(
    ({ api }: SelectionChangedEvent) => {
      if (!params.externalSelectedItems || !params.setExternalSelectedItems) {
        setExternallySelectedItemsAreInSync(true);
        return;
      }

      const selectedRows = api.getSelectedRows();
      // We don't want to update selected Items if it hasn't changed to prevent excess renders
      if (
        params.externalSelectedItems.length !== selectedRows.length ||
        isNotEmpty(xorBy(selectedRows, params.externalSelectedItems, (row) => row.id))
      ) {
        setExternallySelectedItemsAreInSync(false);
        params.setExternalSelectedItems([...selectedRows]);
      } else {
        setExternallySelectedItemsAreInSync(true);
      }
    },
    [params, setExternallySelectedItemsAreInSync],
  );

  /**
   * Synchronise externally selected items to grid.
   * If new ids are selected scroll them into view.
   */
  const synchroniseExternallySelectedItemsToGrid = useCallback(() => {
    if (!gridReady) return;
    if (!params.externalSelectedItems) {
      setExternallySelectedItemsAreInSync(true);
      return;
    }

    const selectedIds = params.externalSelectedItems.map((row) => row.id) as number[];
    const lastNewId = last(difference(selectedIds, lastSelectedIds.current));
    if (lastNewId != null) {
      ensureRowVisible(lastNewId);
    }
    lastSelectedIds.current = selectedIds;
    selectRowsById(selectedIds);
    setExternallySelectedItemsAreInSync(true);
  }, [gridReady, params.externalSelectedItems, ensureRowVisible, selectRowsById, setExternallySelectedItemsAreInSync]);

  /**
   * Combine grid and cell editable into one function
   */
  const combineEditables =
    (...editables: (boolean | EditableCallback | undefined)[]) =>
    (params: EditableCallbackParams): boolean => {
      const results = editables.map((editable) => fnOrVar(editable, params));
      // If editable is not set anywhere then it's non-editable
      if (results.every((v) => v == null)) return false;
      // If any editable value is or returns false then it's non-editable
      return !results.some((v) => v == false);
    };

  /**
   * Synchronise externally selected items to grid on externalSelectedItems change
   */
  useEffect(synchroniseExternallySelectedItemsToGrid, [synchroniseExternallySelectedItemsToGrid]);

  /**
   * Add selectable column to colDefs.  Adjust column defs to block fit for auto sized columns.
   */
  const columnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
    return params.columnDefs.map((colDef) => {
      const colDefEditable = colDef.editable;
      const editable = combineEditables(
        params.loading !== true && params.readOnly !== true,
        params.defaultColDef?.editable,
        colDefEditable,
      );
      return {
        ...colDef,
        editable,
        cellClassRules: {
          ...colDef.cellClassRules,
          'GridCell-readonly': (ccp: CellClassParams) => !editable(ccp as any as EditableCallbackParams),
        },
      };
    });
  }, [params.columnDefs, params.loading, params.readOnly, params.defaultColDef?.editable]);

  const hasExternallySelectedItems = !!params.setExternalSelectedItems;

  /**
   * When grid is ready set the apis to the grid context and sync selected items to grid.
   */
  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      setApis(event.api, hasExternallySelectedItems, dataTestId);
      event.api.showNoRowsOverlay();
      synchroniseExternallySelectedItemsToGrid();
    },
    [dataTestId, hasExternallySelectedItems, setApis, synchroniseExternallySelectedItemsToGrid],
  );

  /**
   * When the grid is being initialized the data may be empty.
   * This will resize columns when we have at least one row.
   */
  const previousRowDataLength = useRef(0);

  const onRowDataChanged = useCallback(() => {
    const length = rowData?.length ?? 0;
    if (previousRowDataLength.current !== length) {
      setInitialContentSize();
      previousRowDataLength.current = length;
    }

    if (lastUpdatedDep.current === updatedDep || isEmpty(colIdsEdited.current)) return;
    lastUpdatedDep.current = updatedDep;

    // Don't update while there are spinners
    if (!isEmpty(updatingCols())) return;

    const skipHeader = sizeColumns === 'auto-skip-headers';
    if (hasSetContentSize.current) {
      autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current, colIds: colIdsEdited.current });
    }
    colIdsEdited.current.clear();
  }, [autoSizeColumns, rowData?.length, setInitialContentSize, sizeColumns, updatedDep, updatingCols]);

  /**
   * Show/hide no rows overlay when model changes.
   */
  const onModelUpdated = useCallback((event: ModelUpdatedEvent) => {
    event.api.showNoRowsOverlay();
  }, []);

  /**
   * Force-refresh all selected rows to re-run class function, to update selection highlighting
   */
  const refreshSelectedRows = useCallback((_event: CellEditingStartedEvent): void => {
    // MATT Disabled I don't believe these are needed anymore
    // I've left them here just in case they are
    /*event.api.refreshCells({
      force: true,
      rowNodes: event.api.getSelectedNodes(),
    });*/
  }, []);

  /**
   * Handle double click edit
   */
  const onCellDoubleClick = useCallback(
    (event: CellDoubleClickedEvent) => {
      if (clickDebounceSkipClick(event.colDef.colId, event.rowIndex)) {
        // the next click will be a single click, we want it to pass
        resetClickDebounce();
        return;
      }
      const editable = fnOrVar(event.colDef?.editable, event);
      if (editable && !invokeEditAction(event)) {
        void startCellEditing({ rowId: event.data.id, colId: event.column.getColId() });
      }
    },
    [startCellEditing],
  );

  /**
   * Handle single click edits
   */
  const onCellClicked = useCallback(
    (event: CellClickedEvent) => {
      const editable = fnOrVar(event.colDef?.editable, event);
      if ((editable && event.colDef.singleClickEdit) ?? singleClickEdit) {
        if (clickDebounceSkipClick(event.colDef.colId, event.rowIndex)) {
          return;
        }
        void startCellEditing({ rowId: event.data.id, colId: event.column.getColId() });
      }
    },
    [singleClickEdit, startCellEditing],
  );

  /**
   * If cell has an edit action invoke it (if editable)
   */
  const invokeEditAction = (e: CellDoubleClickedEvent | CellKeyDownEvent): boolean => {
    const editAction = e.colDef?.cellRendererParams?.editAction;
    if (!editAction) return false;

    const editable = fnOrVar(e.colDef?.editable, e);
    if (editable) {
      if (!e.node.isSelected()) {
        e.node.setSelected(true, true);
      }
      editAction([e.data, ...e.api.getSelectedRows().filter((row) => row.id !== e.data.id)]);
    }
    return true;
  };

  /**
   * Start editing on pressing Enter
   */
  const onCellKeyPress = useCallback(
    (e: CellKeyDownEvent) => {
      const kbe = e.event as KeyboardEvent;
      if (kbe.key === 'Enter') {
        if (!invokeEditAction(e)) {
          void startCellEditing({ rowId: e.data.id, colId: e.column.getColId() });
        }
      }
      if (kbe.key === 'Tab') {
        prePopupOps();
      }
    },
    [prePopupOps, startCellEditing],
  );

  /**
   * Once the grid has auto-sized we want to run fit to fit the grid in its container,
   * but we don't want the non-flex auto-sized columns to "fit" size, so suppressSizeToFit is set to true.
   */
  const columnDefsAdjusted = useMemo(() => {
    const adjustColDefOrGroup = (colDef: ColDef<TData> | ColGroupDef<TData>) =>
      'children' in colDef ? adjustGroupColDef(colDef) : adjustColDef(colDef);

    const adjustGroupColDef = (colDef: ColGroupDef<TData>): ColGroupDef<TData> => ({
      ...colDef,
      children: colDef.children.map((colDef) => adjustColDefOrGroup(colDef)),
    });

    const adjustColDef = (colDef: ColDef<TData>): ColDef<TData> => ({
      ...colDef,
      suppressSizeToFit: (sizeColumns === 'auto' || sizeColumns === 'auto-skip-headers') && !colDef.flex,
      sortable: colDef.sortable && params.defaultColDef?.sortable !== false,
    });

    return columnDefs.map((colDef) => adjustColDefOrGroup(colDef));
  }, [columnDefs, params.defaultColDef?.sortable, sizeColumns]);

  /**
   * Set of colIds that need auto-sizing.
   */
  const colIdsEdited = useRef(new Set<string>());
  const lastUpdatedDep = useRef(updatedDep);

  /**
   * When cell editing has completed the colId as needing auto-sizing
   */
  useEffect(() => {
    if (lastUpdatedDep.current === updatedDep) return;
    lastUpdatedDep.current = updatedDep;

    const colIds = updatingCols();
    // Updating possibly completed
    if (isEmpty(colIds)) {
      // Columns to resize?
      if (!isEmpty(colIdsEdited.current)) {
        const skipHeader = sizeColumns === 'auto-skip-headers';
        if (sizeColumns === 'auto' || skipHeader) {
          defer(() => {
            if (hasSetContentSize.current) {
              autoSizeColumns({
                skipHeader,
                userSizedColIds: userSizedColIds.current,
                colIds: colIdsEdited.current,
              });
            }
          });
        }
        colIdsEdited.current.clear();
      }
    } else {
      // Updates not complete, add them to a list of columns needing resize
      colIds.forEach((colId) => {
        if (colId && !getColDef(colId)?.flex) {
          colIdsEdited.current.add(colId);
        }
      });
    }
  }, [autoSizeColumns, getColDef, sizeColumns, updatedDep, updatingCols]);

  const prevLoading = useRef(false);
  useEffect(() => {
    const newLoading = !rowData || params.loading === true;
    if (newLoading && !prevLoading.current) {
      stopEditing();
      showNoRowsOverlay();
    }
    prevLoading.current = newLoading;
  }, [params.loading, rowData, showNoRowsOverlay, stopEditing]);

  /**
   * Resize columns to fit if required on window/container resize
   */
  const onGridSizeChanged = useCallback(() => {
    if (sizeColumns !== 'none') {
      sizeColumnsToFit();
    }
  }, [sizeColumns, sizeColumnsToFit]);

  /**
   * Set of column I'd's that are prevented from auto-sizing as they are user set
   */
  const userSizedColIds = useRef(new Set<string>());

  /**
   * Lock/unlock column width on user edit/reset.
   */
  const onColumnResized = useCallback((e: ColumnResizedEvent) => {
    const colId = e.column?.getColId();
    if (colId == null) return;
    switch (e.source) {
      case 'uiColumnDragged':
        userSizedColIds.current.add(colId);
        break;
      case 'autosizeColumns':
        userSizedColIds.current.delete(colId);
        break;
    }
  }, []);

  const gridContextMenu = useGridContextMenu({ contextMenu: params.contextMenu, contextMenuSelectRow });

  const startDragYRef = useRef<number | null>(null);

  const clearHighlightRowClasses = useCallback(() => {
    document.querySelectorAll(`.ag-row-highlight-above`)?.forEach((el) => {
      el.classList.remove('ag-row-highlight-above');
    });
    document.querySelectorAll(`.ag-row-highlight-below`)?.forEach((el) => {
      el.classList.remove('ag-row-highlight-below');
    });
  }, []);

  const gridElementRef = useRef<Element>();
  const onRowDragMove = useCallback(
    (event: RowDragMoveEvent) => {
      if (startDragYRef.current === null) {
        startDragYRef.current = event.y;
      }

      const yDiff = event.y - startDragYRef.current;
      const data = event.overNode?.data;
      if (data) {
        clearHighlightRowClasses();
        // Find the grid element, this can only be found on start drag.
        // Once dragging is no progress the event target is the drag element not the start drag column.
        const targetEl = event.event.target as Element | undefined;
        if (targetEl) {
          const gridElement = targetEl.closest('.ag-body');
          if (gridElement) {
            gridElementRef.current = gridElement;
          }
        }
        gridElementRef.current?.querySelectorAll(`[row-id='${data.id}']`)?.forEach((el) => {
          el.classList.add(yDiff < 0 ? 'ag-row-highlight-above' : 'ag-row-highlight-below');
        });
      }
    },
    [clearHighlightRowClasses],
  );

  const onRowDragEnd = useCallback(
    (event: RowDragEndEvent<TData>) => {
      clearHighlightRowClasses();
      gridElementRef.current = undefined;
      if (!params.onRowDragEnd || startDragYRef.current === null) {
        return;
      }
      const yDiff = event.y - startDragYRef.current;
      startDragYRef.current = null;
      if (event.node.rowIndex != null) {
        const movedRow = event.node.data;
        const targetRow = event.overNode?.data;
        if (!movedRow || !targetRow || movedRow === targetRow || yDiff === 0) {
          return;
        }
        void params.onRowDragEnd({ movedRow, targetRow, direction: yDiff > 0 ? 1 : -1 });
      }
    },
    [params, clearHighlightRowClasses],
  );

  useEffect(() => {
    if (params.setExternalSelectedItems && selectable == null) {
      console.warn(
        '<Grid/> has setExternalSelectedItems parameter, but is missing selectable parameter,' +
          'this will cause weird delays in editing.\nIf you need to hide selection column use hideSelectColumn=true',
      );
    }
  }, [params.setExternalSelectedItems, selectable]);

  // This is setting a ref in the GridContext so won't be triggering an update loop
  setOnCellEditingComplete(params.onCellEditingComplete);

  const selectWidth = params.hideSelectColumn ? 0 : selectable && params.onRowDragEnd ? 76 : 48;
  const headerRowCount = columnDefs.some((c) => (c as any).children) ? 2 : 1;
  return (
    <div
      data-testid={dataTestId}
      className={clsx(
        'Grid-container',
        theme,
        'theme-specific',
        staleGrid && 'Grid-sortIsStale',
        gridReady && rowData && autoSized && 'Grid-ready',
      )}
    >
      {gridContextMenu.component}
      <div style={{ flex: 1 }} ref={gridDivRef}>
        <AgGridReact
          theme={'legacy'}
          rowSelection={
            selectable
              ? {
                  enableSelectionWithoutKeys: params.enableSelectionWithoutKeys ?? false,
                  enableClickSelection: params.enableClickSelection ?? false,
                  mode: rowSelection == 'single' ? 'singleRow' : 'multiRow',
                }
              : undefined
          }
          rowHeight={rowHeight}
          animateRows={params.animateRows ?? false}
          rowClassRules={params.rowClassRules}
          getRowId={(params) => `${params.data.id}`}
          onGridSizeChanged={onGridSizeChanged}
          suppressColumnVirtualisation={suppressColumnVirtualization}
          suppressClickEdit={true}
          onColumnVisible={setInitialContentSize}
          onRowDataUpdated={onRowDataChanged}
          onCellKeyDown={onCellKeyPress}
          onCellClicked={onCellClicked}
          onCellDoubleClicked={onCellDoubleClick}
          onCellEditingStarted={refreshSelectedRows}
          domLayout={params.domLayout}
          onColumnResized={onColumnResized}
          defaultColDef={{ minWidth: 48, ...omit(params.defaultColDef, ['editable']) }}
          columnDefs={columnDefsAdjusted}
          rowData={rowData}
          noRowsOverlayComponent={(event: AgGridEvent) => {
            let rowCount = 0;
            event.api.forEachNode(() => rowCount++);
            return (
              <GridNoRowsOverlay
                loading={!rowData || params.loading === true}
                rowCount={rowCount}
                headerRowHeight={headerRowCount * rowHeight}
                filteredRowCount={event.api.getDisplayedRowCount()}
                noRowsOverlayText={params.noRowsOverlayText}
                noRowsMatchingOverlayText={params.noRowsMatchingOverlayText}
              />
            );
          }}
          quickFilterParser={(filterStr) => {
            filterStr = filterStr.trim();
            const quoted = filterStr.startsWith('"');
            filterStr = filterStr.replace(/^"/, '').replace(/"$/, '');
            // If the user encloses the search term in quotes, treat it as an exact match otherwise split by space
            return quoted ? [filterStr] : filterStr.split(' ');
          }}
          onModelUpdated={onModelUpdated}
          onGridReady={onGridReady}
          onSortChanged={ensureSelectedRowIsVisible}
          postSortRows={params.onRowDragEnd || !defaultPostSort ? undefined : postSortRows}
          onSelectionChanged={synchroniseExternalStateToGridSelection}
          onColumnMoved={params.onColumnMoved}
          alwaysShowVerticalScroll={params.alwaysShowVerticalScroll}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          maintainColumnOrder={true}
          preventDefaultOnContextMenu={true}
          onCellContextMenu={gridContextMenu.cellContextMenu}
          rowDragText={params.rowDragText}
          onRowDragCancel={clearHighlightRowClasses}
          onRowDragMove={onRowDragMove}
          onRowDragEnd={onRowDragEnd}
          suppressCellFocus={params.suppressCellFocus}
          pinnedTopRowData={params.pinnedTopRowData}
          pinnedBottomRowData={params.pinnedBottomRowData}
          selectionColumnDef={{
            suppressNavigable: params.hideSelectColumn,
            rowDrag: !!params.onRowDragEnd,
            minWidth: selectWidth,
            maxWidth: selectWidth,
            pinned: selectColumnPinned,
            headerComponentParams: {
              exportable: false,
            },
            headerClass: clsx('ag-header-hide-default-select', params.onRowDragEnd && 'ag-header-select-draggable'),
            headerComponent: rowSelection == 'multiple' ? GridHeaderSelect : undefined,
            suppressHeaderKeyboardEvent: (e) => {
              if (!selectable) return false;
              if ((e.event.key === 'Enter' || e.event.key === ' ') && !e.event.repeat) {
                if (isEmpty(e.api.getSelectedRows())) {
                  e.api.selectAll('filtered');
                } else {
                  e.api.deselectAll();
                }
                return true;
              }
              return false;
            },
            onCellClicked:
              params.enableSelectionWithoutKeys || params.enableClickSelection
                ? undefined
                : clickInputWhenContainingCellClicked,
          }}
        />
      </div>
    </div>
  );
};
