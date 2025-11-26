import {
  AgGridEvent,
  AllCommunityModule,
  CellClassParams,
  CellClickedEvent,
  CellDoubleClickedEvent,
  CellFocusedEvent,
  CellKeyDownEvent,
  CellMouseDownEvent,
  CellMouseOverEvent,
  ColDef,
  ColGroupDef,
  ColumnResizedEvent,
  EditableCallback,
  EditableCallbackParams,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridSizeChangedEvent,
  ModelUpdatedEvent,
  ModuleRegistry,
  RowClickedEvent,
  RowDoubleClickedEvent,
  RowDragEndEvent,
  RowDragMoveEvent,
  SelectionChangedEvent,
  SelectionColumnDef,
  ValueFormatterParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import { defer, delay, difference, isEmpty, last, omit, xorBy } from 'lodash-es';
import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { AutoSizeColumnsResult, StartCellEditingProps, useGridContext } from '../contexts/GridContext';
import { GridUpdatingContext } from '../contexts/GridUpdatingContext';
import { compareNaturalInsensitive, fnOrVar, isNotEmpty } from '../utils/util';
import { clickInputWhenContainingCellClicked } from './clickInputWhenContainingCellClicked';
import { GridHeaderSelect } from './gridHeader';
import { GridContextMenuComponent, useGridContextMenu } from './gridHook';
import { GridNoRowsOverlay } from './GridNoRowsOverlay';
import { usePostSortRowsHook } from './PostSortRowsHook';
import { GridBaseRow, GridOnRowDragEndProps } from './types';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface GridProps<TData extends GridBaseRow = GridBaseRow> {
  ['data-testid']?: string;

  // set all editables to false when read only, make all styles black, otherwise style is gray for not editable
  readOnly?: boolean;
  // If the whole grid is readonly, suppress the read-only grey text style
  suppressReadOnlyStyle?: boolean;

  // Auto-selects first row when rowData is set
  autoSelectFirstRow?: boolean;

  // Select cells for copy. default: false
  enableRangeSelection?: boolean;

  // should have prefix ag-theme-
  theme?: string;

  domLayout?: GridOptions['domLayout'];

  defaultColDef?: GridOptions['defaultColDef'];
  columnDefs: ColDef<TData>[] | ColGroupDef<TData>[];
  rowData: GridOptions['rowData'];
  rowSelection?: 'single' | 'multiple';

  noRowsOverlayText?: string;
  noRowsMatchingOverlayText?: string;

  // Retain sort order after edit, Defaults to true.
  defaultPostSort?: boolean;

  externalSelectedIds?: TData['id'][];
  setExternalSelectedIds?: (ids: TData['id'][]) => void;

  externalSelectedItems?: TData[];
  setExternalSelectedItems?: (items: TData[]) => void;

  // Adds the selection column pinned on left hand side.
  // Make sure you add `[externalSelectedIds/setExternalSelectedIds]`
  // or `[externalSelectedItems, setExternalSelectedItems]`
  selectable?: boolean;
  selectColumnPinned?: ColDef['pinned'];

  // Click on any cell to select row.  You would use this on a read only grid.
  enableClickSelection?: boolean;

  // If you set selection to true you get a select column, but if you have enableClickSelection=true you may no want to see the checkboxes
  hideSelectColumn?: boolean;

  // Allows users to select rows with a simple mouse click, without needing to hold down modifier keys (like Ctrl or Shift)
  enableSelectionWithoutKeys?: boolean;

  // No need to double-click for editing cells.  default: false
  singleClickEdit?: boolean;

  // Whether to select row on context menu.
  contextMenuSelectRow?: boolean;

  // Context menu definition if required.
  contextMenu?: GridContextMenuComponent<TData>;

  // When pressing tab whilst editing, the grid will select and edit the next cell if available.
  // Once the last cell to edit closes within the same row this callback is called.
  onBulkEditingComplete?: () => Promise<void> | void;

  animateRows?: boolean;
  rowHeight?: number;
  rowClassRules?: GridOptions['rowClassRules'];

  onCellFocused?: (props: { colDef: ColDef<TData>; data: TData }) => void;
  onColumnMoved?: GridOptions['onColumnMoved'];
  rowDragText?: GridOptions['rowDragText'];
  onRowDragEnd?: (props: GridOnRowDragEndProps<TData>) => Promise<void> | void;
  alwaysShowVerticalScroll?: boolean;
  suppressColumnVirtualization?: GridOptions['suppressColumnVirtualisation'];

  /**
   * When the grid is rendered using sizeColumns=="auto" this is called initially with the required container size to fit all content.
   * This allows you set the size of the panel to fit perfectly.  This can take a couple of seconds plus whatever your data load time is.
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

  // On first don't return a content size larger than this.
  maxInitialWidth?: number;

  loading?: boolean;
  suppressCellFocus?: boolean;
  pinnedTopRowData?: GridOptions['pinnedTopRowData'];
  pinnedBottomRowData?: GridOptions['pinnedBottomRowData'];
  onRowClicked?: (event: RowClickedEvent) => void;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void;
}

/**
 * Wrapper for AgGrid to add commonly used functionality.
 */
export const Grid = <TData extends GridBaseRow = GridBaseRow>({
  'data-testid': dataTestId,
  defaultPostSort = true,
  rowSelection = 'multiple',
  enableRangeSelection,
  suppressColumnVirtualization = true,
  theme = 'ag-theme-step-default',
  sizeColumns = 'auto',
  selectColumnPinned = 'left',
  contextMenuSelectRow = false,
  singleClickEdit = false,
  rowData,
  rowHeight = theme === 'ag-theme-step-default' ? 40 : theme === 'ag-theme-step-compact' ? 36 : 40,
  selectable,
  autoSelectFirstRow,
  onCellFocused: paramsOnCellFocused,
  maxInitialWidth,
  suppressReadOnlyStyle = false,
  externalSelectedItems,
  setExternalSelectedItems,
  externalSelectedIds,
  setExternalSelectedIds,
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
    setOnBulkEditingComplete,
    getColDef,
    showNoRowsOverlay,
    prePopupOps,
    startCellEditing: propStartCellEditing,
  } = useGridContext<TData>();
  // CellEditingStop event happens too much for one edit
  const startedEditRef = useRef(false);
  const startCellEditing = useCallback(
    (props: StartCellEditingProps<TData>) => {
      startedEditRef.current = true;
      return propStartCellEditing(props);
    },
    [propStartCellEditing],
  );

  const { updatedDep, anyUpdating, updatingCols } = useContext(GridUpdatingContext);

  const gridDivRef = useRef<HTMLDivElement>(null);
  const lastSelectedIds = useRef<TData['id'][] | undefined>();

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

  const autoSizeResultRef = useRef<AutoSizeColumnsResult | null>(null);
  const prevRowsVisibleRef = useRef(false);
  const initialContentSizeInProgressRef = useRef(false);
  const setInitialContentSize = useCallback(async (): Promise<void> => {
    if (initialContentSizeInProgressRef.current) {
      return;
    }
    initialContentSizeInProgressRef.current = true;
    try {
      needsAutoSize.current = false;

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

      // 1. First we autosize to get the size of the columns on an infinite grid.
      if (sizeColumns === 'auto' || sizeColumns === 'auto-skip-headers') {
        // You can't skip headers until the grid has content
        const rowsVisible = gridRendered === 'rows-visible';
        const skipHeader = sizeColumns === 'auto-skip-headers' && rowsVisible;
        // If grid was empty and now has content we need to autosize
        if (rowsVisible !== prevRowsVisibleRef.current && rowsVisible) {
          prevRowsVisibleRef.current = rowsVisible;
          autoSizeResultRef.current = null;
        }
        const autoSizeResult =
          autoSizeResultRef.current ??
          (await autoSizeColumns({
            skipHeader,
            userSizedColIds: new Set(userSizedColIds.current.keys()),
          }));
        // Auto-size failed retry later
        if (!autoSizeResult) {
          needsAutoSize.current = true;
          return;
        }

        autoSizeResultRef.current = autoSizeResult;
        // Calculate the auto-sized width, limit it to maxInitialWidth
        autoSizeResult.width = maxInitialWidth ? Math.min(autoSizeResult.width, maxInitialWidth) : autoSizeResult.width;
        if (gridRendered === 'empty') {
          // If the grid is empty we still do an onContentSize callback, we will do another callback when grid has data
          // We don't do this callback if we have previously had row data, or have already called back for empty
          if (!hasSetContentSizeEmpty.current && !hasSetContentSize.current) {
            hasSetContentSizeEmpty.current = true;
            params.onContentSize?.(autoSizeResult);
          }
        } else if (gridRendered === 'rows-visible') {
          // we have rows now so callback grid size
          if (!hasSetContentSize.current) {
            hasSetContentSize.current = true;
            params.onContentSize?.(autoSizeResult);
          }
        } else {
          // It should be impossible to get here
          console.error('Unknown value returned from hasGridRendered');
        }
      } else {
        sizeColumnsToFit();
      }

      setAutoSized(true);
      needsAutoSize.current = false;
    } finally {
      initialContentSizeInProgressRef.current = false;
    }
  }, [autoSizeColumns, gridRenderState, maxInitialWidth, params, rowData, sizeColumns, sizeColumnsToFit]);

  const lastOwnerDocumentRef = useRef<Document>();
  const wasVisibleRef = useRef(false);

  /**
   * Auto-size windows that had deferred auto-size
   * Reset focus if panel went from invisible to visible.
   */
  useInterval(() => {
    // If grid has become visible after previously being hidden, then refocus the last focused cell.
    const visible = !!gridDivRef.current?.checkVisibility?.();
    if (visible && !wasVisibleRef.current) {
      wasVisibleRef.current = true;
      const el = (window as any).__stepaggrid_lastfocuseventtarget;
      if (el) {
        // Setting this to null will cause a new refocus event
        (window as any).__stepaggrid_lastfocuseventtarget = null;
        // Check element is still part of document
        if (el.checkVisibility()) {
          el.focus();
        }
      }
    }
    wasVisibleRef.current = visible;

    // Check if window has been popped out and needs resize
    const currentDocument = gridDivRef.current?.ownerDocument;
    if (currentDocument !== lastOwnerDocumentRef.current) {
      lastOwnerDocumentRef.current = currentDocument;
      if (currentDocument) {
        needsAutoSize.current = true;
      }
    }
    if (
      needsAutoSize.current ||
      (!hasSetContentSize.current && (sizeColumns === 'auto' || sizeColumns === 'auto-skip-headers'))
    ) {
      void setInitialContentSize();
    }
  }, 200);

  /**
   * On data load select the first row of the grid if required.
   */
  const hasSelectedFirstItem = useRef(false);
  useEffect(() => {
    if (!gridReady || hasSelectedFirstItem.current || !rowData || !externallySelectedItemsAreInSync) {
      return;
    }
    hasSelectedFirstItem.current = true;
    if (isNotEmpty(rowData) && isEmpty(externalSelectedItems)) {
      const firstRowId = getFirstRowId();
      if (autoSelectFirstRow && selectable) {
        selectRowsById([firstRowId]);
      } else {
        focusByRowById(firstRowId, true);
      }
    }
  }, [
    externallySelectedItemsAreInSync,
    focusByRowById,
    gridReady,
    externalSelectedItems,
    autoSelectFirstRow,
    rowData,
    selectRowsById,
    getFirstRowId,
    selectable,
  ]);

  /**
   * Ensure external selected items list is in sync with panel.
   */
  const synchroniseExternalStateToGridSelection = useCallback(
    ({ api }: SelectionChangedEvent) => {
      if (externalSelectedIds && setExternalSelectedIds) {
        const selectedRowsIds = api.getSelectedRows().map((row: TData) => row.id);

        // We don't want to update selected Items if it hasn't changed to prevent excess renders
        if (
          externalSelectedIds.length !== selectedRowsIds.length ||
          isNotEmpty(xorBy(selectedRowsIds, externalSelectedIds))
        ) {
          setExternallySelectedItemsAreInSync(false);
          setExternalSelectedIds([...selectedRowsIds]);
        } else {
          setExternallySelectedItemsAreInSync(true);
        }
      } else if (externalSelectedItems && setExternalSelectedItems) {
        const selectedRows = api.getSelectedRows();

        // We don't want to update selected Items if it hasn't changed to prevent excess renders
        if (
          externalSelectedItems.length !== selectedRows.length ||
          isNotEmpty(xorBy(selectedRows, externalSelectedItems, (row) => row.id))
        ) {
          setExternallySelectedItemsAreInSync(false);
          setExternalSelectedItems([...selectedRows]);
        } else {
          setExternallySelectedItemsAreInSync(true);
        }
      } else {
        setExternallySelectedItemsAreInSync(true);
      }
    },
    [
      externalSelectedIds,
      externalSelectedItems,
      setExternalSelectedIds,
      setExternalSelectedItems,
      setExternallySelectedItemsAreInSync,
    ],
  );

  /**
   * Synchronise externally selected items to grid.
   * If new ids are selected scroll them into view.
   */
  const synchroniseExternallySelectedItemsToGrid = useCallback(() => {
    if (!gridReady) return;
    if (!externalSelectedItems && !externalSelectedIds) {
      setExternallySelectedItemsAreInSync(true);
      return;
    }

    const selectedIds = externalSelectedIds ?? externalSelectedItems?.map((row) => row.id);
    const lastNewId = last(difference(selectedIds, lastSelectedIds.current ?? []));
    if (lastNewId != null) {
      ensureRowVisible(lastNewId);
    }
    lastSelectedIds.current = selectedIds;
    selectRowsById(selectedIds);
    setExternallySelectedItemsAreInSync(true);
  }, [
    gridReady,
    externalSelectedItems,
    externalSelectedIds,
    selectRowsById,
    setExternallySelectedItemsAreInSync,
    ensureRowVisible,
  ]);

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

  const mapColDef = useCallback(
    (colDef: ColDef | ColGroupDef): ColDef | ColGroupDef => {
      if ('children' in colDef) {
        return {
          ...colDef,
          children: colDef.children.map(mapColDef),
        };
      } else {
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
            'GridCell-readonly': (ccp: CellClassParams<TData>) =>
              !suppressReadOnlyStyle && !editable(ccp as unknown as EditableCallbackParams<TData>),
          },
        };
      }
    },
    [params.defaultColDef?.editable, params.loading, params.readOnly, suppressReadOnlyStyle],
  );

  /**
   * Add selectable column to colDefs.  Adjust column defs to block fit for auto sized columns.
   */
  const columnDefs = useMemo((): (ColDef | ColGroupDef)[] => {
    return params.columnDefs.map(mapColDef);
  }, [params.columnDefs, mapColDef]);

  const hasExternallySelectedItems = !!setExternalSelectedItems || !!setExternalSelectedIds;

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

  const onRowDataUpdated = useCallback(() => {
    const length = rowData?.length ?? 0;
    if (previousRowDataLength.current !== length) {
      // We need to autosize all cells again
      autoSizeResultRef.current = null;
      previousRowDataLength.current = length;
      void setInitialContentSize();
      return;
    }

    if (lastUpdatedDep.current === updatedDep || isEmpty(colIdsEdited.current)) {
      return;
    }
    lastUpdatedDep.current = updatedDep;

    // Don't update while there are spinners
    if (anyUpdating()) {
      return;
    }

    const skipHeader = sizeColumns === 'auto-skip-headers';
    if ((sizeColumns === 'auto' || sizeColumns === 'auto-skip-headers') && hasSetContentSize.current) {
      void autoSizeColumns({
        skipHeader,
        userSizedColIds: new Set(userSizedColIds.current.keys()),
        colIds: colIdsEdited.current,
      });
    }
    colIdsEdited.current.clear();
  }, [autoSizeColumns, rowData?.length, setInitialContentSize, sizeColumns, updatedDep, anyUpdating]);

  /**
   * Show/hide no rows overlay when model changes.
   */
  const onModelUpdated = useCallback((event: ModelUpdatedEvent) => {
    event.api.showNoRowsOverlay();
  }, []);

  /**
   * Handle double click edit
   */
  const onCellDoubleClick = useCallback(
    (event: CellDoubleClickedEvent) => {
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
        void startCellEditing({ rowId: event.data.id, colId: event.column.getColId() });
      }
    },
    [singleClickEdit, startCellEditing],
  );

  const onCellEditingStopped = useCallback(
    (event: AgGridEvent<TData>) => {
      if (!startedEditRef.current) {
        return;
      }
      startedEditRef.current = false;
      const api = event.api;
      // We need to redraw on fit as the updated row heights aren't visible
      if (sizeColumns === 'fit') {
        delay(() => {
          // Don't update if currently editing, that will stop the edit
          if (!anyUpdating() && document.querySelectorAll('.szh-menu--state-open').length === 0) {
            if (!api.isDestroyed()) {
              api.redrawRows();
            }
          }
        }, 500);
      }
    },
    [anyUpdating, sizeColumns],
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

  // TODO  reset ranges on edit
  const rangeStartRef = useRef<CellLocation | null>(null);
  const rangeEndRef = useRef<CellLocation | null>(null);
  const rangeSortedRowIdsRef = useRef<TData['id'][] | null>(null);

  const updateRangeSelectionCellClasses = useCallback(() => {
    //
    // Get all grid cols, sort by pinned, then style: left
    const gridElement = gridDivRef.current;
    if (!gridElement) {
      return;
    }

    // Clear all selections
    gridElement
      .querySelectorAll('.rangeSelect,.rangeSelectLeft,.rangeSelectTop,.rangeSelectRight,.rangeSelectBottom')
      .forEach((el) => {
        el.classList.remove(
          'rangeSelect',
          'rangeSelectLeft',
          'rangeSelectTop',
          'rangeSelectRight',
          'rangeSelectBottom',
        );
      });

    // if range selection multiple add .Grid-container.rangeSelectingMultiple
    const rangeStart = rangeStartRef.current;
    const rangeEnd = rangeEndRef.current;
    if (
      rangeStart !== null &&
      rangeEnd !== null &&
      (rangeStart.colId !== rangeEnd.colId || rangeStart.rowId !== rangeEnd.rowId)
    ) {
      gridElement.classList.add('rangeSelectingMultiple');
      gridElement.querySelectorAll('.ag-cell-focus').forEach((el) => {
        el.classList.remove('ag-cell-focus');
      });
    } else {
      gridElement.classList.remove('rangeSelectingMultiple');
      return;
    }
    const rangeSortedRowIds = rangeSortedRowIdsRef.current;
    if (!rangeSortedRowIds) {
      return;
    }

    const elStyleLeftComparator = (el1: Element, el2: Element) => elStyleLeft(el1) - elStyleLeft(el2);
    const elStyleLeft = (el: Element): number => parseFloat((el as HTMLElement).style.left) ?? 0;

    const getSortedColIds = (): string[] => {
      //
      const leftHeaders = [...gridElement.querySelectorAll('.ag-pinned-left-header .ag-header-cell')].sort(
        elStyleLeftComparator,
      );
      const centerHeaders = [...gridElement.querySelectorAll('.ag-header-viewport .ag-header-cell')].sort(
        elStyleLeftComparator,
      );
      const rightHeaders = [...gridElement.querySelectorAll('.ag-pinned-right-header .ag-header-cell')].sort(
        elStyleLeftComparator,
      );

      return [...leftHeaders, ...centerHeaders, ...rightHeaders].map((el, i) => el.getAttribute('col-id') ?? String(i));
    };

    console.assert(rangeSortedRowIdsRef.current !== null);

    const sortedColIds = getSortedColIds();

    const selectedColIds = sortedColIds.slice(
      sortedColIds.indexOf(rangeStart.colId),
      sortedColIds.indexOf(rangeEnd.colId) + 1,
    );

    const startRowIndex = rangeSortedRowIds.indexOf(rangeStart.rowId);
    const endRowIndex = rangeSortedRowIds.indexOf(rangeEnd.rowId) + 1;
    const selectedRowsIds = rangeSortedRowIds.slice(startRowIndex, endRowIndex);

    for (const colId of selectedColIds) {
      for (const rowId of selectedRowsIds) {
        const cell = gridElement.querySelector(
          `.ag-row[row-id=${JSON.stringify(String(rowId))}] .ag-cell[col-id=${JSON.stringify(colId)}`,
        );
        cell?.classList.add('rangeSelect');
        if (colId === rangeStart.colId) {
          cell?.classList.add('rangeSelectLeft');
        }
        if (colId === rangeEnd.colId) {
          cell?.classList.add('rangeSelectRight');
        }
        if (rowId === rangeStart.rowId) {
          cell?.classList.add('rangeSelectTop');
        }
        if (rowId === rangeEnd.rowId) {
          cell?.classList.add('rangeSelectBottom');
        }
      }
    }
  }, []);

  const onCellMouseDown = useCallback(
    (e: CellMouseDownEvent) => {
      if (!enableRangeSelection) {
        return;
      }
      rangeStartRef.current = {
        rowId: e.node.data.id,
        colId: e.column.getColId(),
      };
      rangeEndRef.current = null;

      updateRangeSelectionCellClasses();

      const sortedRowIds: (string | number)[] = [];
      e.api.forEachNodeAfterFilterAndSort((row) => sortedRowIds.push(row.data.id));
      rangeSortedRowIdsRef.current = sortedRowIds;
    },
    [enableRangeSelection, updateRangeSelectionCellClasses],
  );

  const onCellMouseOver = useCallback(
    (e: CellMouseOverEvent) => {
      if (!enableRangeSelection) {
        return;
      }
      const button = (e.event as { buttons?: number }).buttons;
      if (button !== 1) {
        rangeSortedRowIdsRef.current = null;
        return;
      }
      rangeEndRef.current = {
        rowId: e.node.data.id,
        colId: e.column.getColId(),
      };

      updateRangeSelectionCellClasses();
    },
    [enableRangeSelection, updateRangeSelectionCellClasses],
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

    const adjustColDef = (colDef: ColDef<TData>): ColDef<TData> => {
      const flex = colDef.flex ?? (sizeColumns === 'fit' ? 1 : undefined);
      const valueFormatter = colDef.valueFormatter;
      const sortable = colDef.sortable && params.defaultColDef?.sortable !== false;
      let comparator = colDef.comparator;
      if (sortable && !comparator) {
        comparator = (value1, value2, node1, node2) => {
          let r;
          if (typeof valueFormatter === 'function') {
            r = compareNaturalInsensitive(
              valueFormatter({
                data: node1.data,
                value: value1,
                node: node1,
                colDef: adjustedColDef,
                ...NotAGridValueFormatterCall,
              } as ValueFormatterParams<TData>),
              valueFormatter({
                data: node2.data,
                value: value2,
                node: node2,
                colDef: adjustedColDef,
                ...NotAGridValueFormatterCall,
              } as ValueFormatterParams<TData>),
            );
          } else {
            r = compareNaturalInsensitive(value1, value2);
          }
          // secondary compare as primary sort column rows are equal
          return r === 0 ? compareNaturalInsensitive(node1.data?.id, node2.data?.id) : r;
        };
      }
      const adjustedColDef = {
        ...colDef,
        // You cannot pass a width to a flex
        width: !!colDef.flex ? undefined : colDef.width,
        ...(!!colDef.flex && { flexAutoSizeWidth: colDef.width }),
        // If this is allowed flex columns don't size based on flex
        suppressSizeToFit: true,
        // Auto-sizing flex columns breaks everything
        flex,
        suppressAutoSize: !!flex,
        sortable,
        comparator,
      } as ColDef<TData> & { flexAutoSizeWidth?: number };

      return adjustedColDef;
    };

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
    if (lastUpdatedDep.current === updatedDep) {
      return;
    }
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
              void autoSizeColumns({
                skipHeader,
                userSizedColIds: new Set(userSizedColIds.current.keys()),
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
      showNoRowsOverlay();
    }
    prevLoading.current = newLoading;
  }, [params.loading, rowData, showNoRowsOverlay]);

  /**
   * Set of column I'd's that are prevented from auto-sizing as they are user set
   */
  const userSizedColIds = useRef(new Map<string, number>());

  /**
   * Lock/unlock column width on user edit/reset.
   */
  const onColumnResized = useCallback((e: ColumnResizedEvent) => {
    const colId = e.column?.getColId();
    if (colId == null) {
      return;
    }
    const width = e.column?.getActualWidth();
    if (width == null) {
      return;
    }
    switch (e.source) {
      case 'uiColumnResized':
        userSizedColIds.current.set(colId, width);
        /*const colDef = e.column?.getColDef();
          if (!colDef?.flex) {
            onGridResize(e);
          }*/
        break;
      case 'autosizeColumns':
        userSizedColIds.current.delete(colId);
        //onGridResize(e);
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

  const onCellFocused = useCallback(
    (event: CellFocusedEvent<TData>) => {
      if (event.rowIndex == null) {
        return;
      }
      const api = event.api;
      const rowNode = api.getDisplayedRowAtIndex(event.rowIndex);
      const data = rowNode?.data;
      const column = event.column;
      if (!data || !column || typeof column === 'string') {
        return;
      }
      const colDef = column.getColDef();
      if (!colDef || typeof colDef === 'string') {
        return;
      }
      // Prevent repeated callbacks to cell focus when focus didn't change
      const { sourceEvent } = event;
      if (sourceEvent) {
        const cell = (sourceEvent.target as Element | undefined)?.closest?.('.ag-cell') ?? null;
        if ((window as any).__stepaggrid_lastfocuseventtarget === cell) {
          return;
        }
        (window as any).__stepaggrid_lastfocuseventtarget = cell;
      }

      paramsOnCellFocused?.({ colDef, data });
    },
    [paramsOnCellFocused],
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

  useEffect(
    () => {
      if ((setExternalSelectedItems || setExternalSelectedIds) && selectable == null) {
        console.warn(
          '<Grid/> has setExternalSelectedItems/setExternalSelectedIds parameter, but is missing selectable parameter,' +
            'this will cause weird delays in editing.\nIf you need to hide selection column use hideSelectColumn=true',
        );
      }
    },
    // Only needs to run on startup
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectable],
  );

  // This is setting a ref in the GridContext so won't be triggering an update loop
  setOnBulkEditingComplete(params.onBulkEditingComplete);

  const getRowId = useCallback((params: GetRowIdParams<TData, unknown>) => `${params.data.id}`, []);
  const defaultColDef = useMemo(
    (): ColDef<TData, unknown> => ({
      minWidth: 48,
      ...omit(params.defaultColDef, ['editable', 'field', 'colId', 'tooltipField']),
    }),
    [params.defaultColDef],
  );

  const noRowsOverlayComponent = useCallback(
    (event: AgGridEvent) => {
      const headerRowCount = columnDefs.some((c) => (c as any).children) ? 2 : 1;

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
    },
    [columnDefs, params.loading, params.noRowsMatchingOverlayText, params.noRowsOverlayText, rowData, rowHeight],
  );

  const selectionColumnDef = useMemo((): SelectionColumnDef | undefined => {
    // Note this has to be 1 for hidden otherwise ag-grid does crazy things whilst resizing
    const selectWidth = params.onRowDragEnd ? 76 : 48;
    return {
      suppressNavigable: params.hideSelectColumn,
      rowDrag: !!params.onRowDragEnd,
      minWidth: selectWidth,
      maxWidth: selectWidth,
      pinned: selectColumnPinned,
      headerComponentParams: {
        exportable: false,
      },
      suppressAutoSize: true,
      suppressSizeToFit: true,
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
      onCellClicked: clickInputWhenContainingCellClicked,
    };
  }, [params.hideSelectColumn, params.onRowDragEnd, rowSelection, selectColumnPinned, selectable]);

  const onGridSizeChanged = useCallback(
    (event: GridSizeChangedEvent<TData>) => {
      if (sizeColumns === 'fit' || (['auto', 'auto-skip-headers'].includes(sizeColumns) && hasSetContentSize.current)) {
        event.api.sizeColumnsToFit();
      }
    },
    [sizeColumns],
  );

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
                  mode: rowSelection === 'single' ? 'singleRow' : 'multiRow',
                  ...(params.hideSelectColumn && {
                    checkboxes: false,
                    headerCheckbox: false,
                  }),
                }
              : undefined
          }
          selectionColumnDef={selectionColumnDef}
          rowHeight={rowHeight}
          animateRows={params.animateRows ?? false}
          rowClassRules={params.rowClassRules}
          getRowId={getRowId}
          suppressColumnVirtualisation={suppressColumnVirtualization}
          suppressClickEdit={true}
          onGridSizeChanged={onGridSizeChanged}
          onColumnVisible={() => void setInitialContentSize()}
          onRowDataUpdated={onRowDataUpdated}
          onCellFocused={onCellFocused}
          onCellKeyDown={onCellKeyPress}
          onCellClicked={onCellClicked}
          onCellDoubleClicked={onCellDoubleClick}
          onCellEditingStopped={onCellEditingStopped}
          onCellMouseDown={onCellMouseDown}
          onCellMouseOver={onCellMouseOver}
          domLayout={params.domLayout}
          onColumnResized={onColumnResized}
          defaultColDef={defaultColDef}
          columnDefs={columnDefsAdjusted}
          rowData={rowData}
          postSortRows={params.onRowDragEnd || !defaultPostSort ? undefined : postSortRows}
          onModelUpdated={onModelUpdated}
          onGridReady={onGridReady}
          onSortChanged={ensureSelectedRowIsVisible}
          quickFilterParser={quickFilterParser}
          onSelectionChanged={synchroniseExternalStateToGridSelection}
          onColumnMoved={params.onColumnMoved}
          noRowsOverlayComponent={noRowsOverlayComponent}
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
          onRowClicked={params.onRowClicked}
          onRowDoubleClicked={params.onRowDoubleClicked}
          suppressStartEditOnTab={true}
        />
      </div>
    </div>
  );
};

const quickFilterParser = (filterStr: string) => {
  // filter is exact matches exactly groups separated by commas
  return filterStr.split(',').map((str) => str.trim());
};

/**
 * Columns to indicate to user when they debug why things are broken in the default comparator if their valueFormatter
 * is too complicated.
 */
const NotAGridValueFormatterCall = {
  column: 'Default comparator has no access to column, write your own comparator' as unknown,
  api: 'Default comparator has no access to api, write your own comparator' as unknown,
  context: 'Default comparator has no access to context, write your own comparator' as unknown,
};

interface CellLocation {
  rowId: string;
  colId: string;
}
