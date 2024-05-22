import {
  CellClickedEvent,
  ColDef,
  ColGroupDef,
  ColumnResizedEvent,
  IClientSideRowModel,
  ModelUpdatedEvent,
  RowHighlightPosition,
  RowNode,
} from "ag-grid-community";
import { CellClassParams, EditableCallback, EditableCallbackParams } from "ag-grid-community";
import { GridOptions } from "ag-grid-community";
import {
  AgGridEvent,
  CellEvent,
  CellKeyDownEvent,
  GridReadyEvent,
  RowDragEndEvent,
  RowDragMoveEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import clsx from "clsx";
import { defer, difference, isEmpty, last, omit, xorBy } from "lodash-es";
import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";

import { GridContext } from "../contexts/GridContext";
import { GridUpdatingContext } from "../contexts/GridUpdatingContext";
import { fnOrVar, isNotEmpty } from "../utils/util";
import { GridNoRowsOverlay } from "./GridNoRowsOverlay";
import { usePostSortRowsHook } from "./PostSortRowsHook";
import { GridHeaderSelect } from "./gridHeader";
import { GridContextMenuComponent, useGridContextMenu } from "./gridHook";

export interface GridBaseRow {
  id: string | number;
}

export interface GridProps {
  readOnly?: boolean; // set all editables to false when read only, make all styles black, otherwise style is gray for not editable
  selectable?: boolean;
  theme?: string; // should have prefix ag-theme-
  ["data-testid"]?: string;
  domLayout?: GridOptions["domLayout"];
  externalSelectedItems?: any[];
  setExternalSelectedItems?: (items: any[]) => void;
  defaultColDef?: GridOptions["defaultColDef"];
  columnDefs: ColDef[];
  rowData: GridOptions["rowData"];
  /**
   * Whether select column is pinned.  Defaults to "left".
   */
  selectColumnPinned?: ColDef["pinned"];
  noRowsOverlayText?: string;
  noRowsMatchingOverlayText?: string;
  animateRows?: boolean;
  rowHeight?: number;
  rowClassRules?: GridOptions["rowClassRules"];
  rowSelection?: "single" | "multiple";
  autoSelectFirstRow?: boolean;
  onColumnMoved?: GridOptions["onColumnMoved"];
  rowDragText?: GridOptions["rowDragText"];
  onRowDragEnd?: (movedRow: any, targetRow: any, targetIndex: number) => Promise<void>;
  alwaysShowVerticalScroll?: boolean;
  suppressColumnVirtualization?: GridOptions["suppressColumnVirtualisation"];
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
  sizeColumns?: "fit" | "auto" | "auto-skip-headers" | "none";
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
  pinnedTopRowData?: GridOptions["pinnedTopRowData"];
  pinnedBottomRowData?: GridOptions["pinnedBottomRowData"];
}

/**
 * Wrapper for AgGrid to add commonly used functionality.
 */
export const Grid = ({
  "data-testid": dataTestId,
  rowSelection = "multiple",
  suppressColumnVirtualization = true,
  theme = "ag-theme-step-default",
  sizeColumns = "auto",
  selectColumnPinned = null,
  contextMenuSelectRow = false,
  singleClickEdit = false,
  rowData,
  rowHeight = theme === "ag-theme-step-default" ? 40 : theme === "ag-theme-step-compact" ? 36 : 40,
  ...params
}: GridProps): ReactElement => {
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
  const { checkUpdating, updatedDep, updatingCols } = useContext(GridUpdatingContext);

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

    const skipHeader = sizeColumns === "auto-skip-headers" && gridRendered === "rows-visible";
    if (sizeColumns === "auto" || skipHeader) {
      const result = autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current, includeFlex: true });
      if (!result) {
        needsAutoSize.current = true;
        return;
      }
      if (gridRendered === "empty") {
        if (!hasSetContentSizeEmpty.current && !hasSetContentSize.current) {
          hasSetContentSizeEmpty.current = true;
          params.onContentSize?.(result);
        }
      } else if (gridRendered === "rows-visible") {
        if (!hasSetContentSize.current) {
          hasSetContentSize.current = true;
          params.onContentSize?.(result);
        }
      } else {
        // It should be impossible to get here
        console.error("Unknown value returned from hasGridRendered");
      }
    }

    if (sizeColumns !== "none") {
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
    if (needsAutoSize.current || (!hasSetContentSize.current && sizeColumns === "auto")) {
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
   * AgGrid checkbox select does not pass clicks within cell but not on the checkbox to checkbox.
   * This passes the event to the checkbox when you click anywhere in the cell.
   */
  const clickSelectorCheckboxWhenContainingCellClicked = useCallback(({ event }: CellClickedEvent) => {
    if (!event) return;
    const input = (event.target as Element).querySelector("input");
    input?.dispatchEvent(event);
  }, []);

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
        params.externalSelectedItems.length != selectedRows.length ||
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
    const adjustColDefs = params.columnDefs.map((colDef) => {
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
          "GridCell-readonly": (ccp: CellClassParams) => !editable(ccp as any as EditableCallbackParams),
        },
      };
    });

    return params.selectable || params.onRowDragEnd
      ? [
          {
            colId: "selection",
            editable: false,
            rowDrag: !!params.onRowDragEnd,
            minWidth: params.selectable && params.onRowDragEnd ? 76 : 48,
            maxWidth: params.selectable && params.onRowDragEnd ? 76 : 48,
            pinned: selectColumnPinned,
            headerComponentParams: {
              exportable: false,
            },
            checkboxSelection: params.selectable,
            headerComponent: rowSelection === "multiple" ? GridHeaderSelect : null,
            suppressHeaderKeyboardEvent: (e) => {
              if (!params.selectable) return false;
              if ((e.event.key === "Enter" || e.event.key === " ") && !e.event.repeat) {
                if (isEmpty(e.api.getSelectedRows())) {
                  e.api.selectAllFiltered();
                } else {
                  e.api.deselectAll();
                }
                return true;
              }
              return false;
            },
            onCellClicked: clickSelectorCheckboxWhenContainingCellClicked,
          },
          ...adjustColDefs,
        ]
      : adjustColDefs;
  }, [
    params.columnDefs,
    params.selectable,
    params.onRowDragEnd,
    params.loading,
    params.readOnly,
    params.defaultColDef?.editable,
    selectColumnPinned,
    rowSelection,
    clickSelectorCheckboxWhenContainingCellClicked,
  ]);

  /**
   * When grid is ready set the apis to the grid context and sync selected items to grid.
   */
  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      setApis(event.api, dataTestId);
      event.api.showNoRowsOverlay();
      synchroniseExternallySelectedItemsToGrid();
    },
    [dataTestId, setApis, synchroniseExternallySelectedItemsToGrid],
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

    const skipHeader = sizeColumns === "auto-skip-headers";
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
  const refreshSelectedRows = useCallback((event: CellEvent): void => {
    event.api.refreshCells({
      force: true,
      rowNodes: event.api.getSelectedNodes(),
    });
  }, []);

  /**
   * Make sure node is selected for editing and start edit
   */
  const startCellEditing = useCallback(
    (event: CellEvent) => {
      prePopupOps();
      if (!event.node.isSelected()) {
        event.node.setSelected(true, true);
      }
      // Cell already being edited, so don't re-edit until finished
      if (checkUpdating([event.colDef.field ?? ""], event.data.id)) {
        return;
      }

      if (event.rowIndex !== null) {
        event.api.startEditingCell({
          rowIndex: event.rowIndex,
          colKey: event.column.getColId(),
        });
      }
    },
    [checkUpdating, prePopupOps],
  );

  /**
   * Handle double click edit
   */
  const onCellDoubleClick = useCallback(
    (event: CellEvent) => {
      if (!invokeEditAction(event)) startCellEditing(event);
    },
    [startCellEditing],
  );

  /**
   * Handle single click edits
   */
  const onCellClicked = useCallback(
    (event: CellEvent) => {
      if (event.colDef?.cellRendererParams?.singleClickEdit ?? singleClickEdit) {
        startCellEditing(event);
      }
    },
    [singleClickEdit, startCellEditing],
  );

  /**
   * If cell has an edit action invoke it (if editable)
   */
  const invokeEditAction = (e: CellEvent): boolean => {
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
      if ((e.event as KeyboardEvent).key === "Enter") {
        if (!invokeEditAction(e)) startCellEditing(e);
      }
    },
    [startCellEditing],
  );

  /**
   * Once the grid has auto-sized we want to run fit to fit the grid in its container,
   * but we don't want the non-flex auto-sized columns to "fit" size, so suppressSizeToFit is set to true.
   */
  const columnDefsAdjusted = useMemo(() => {
    const adjustColDefOrGroup = (colDef: ColDef | ColGroupDef) =>
      "children" in colDef ? adjustGroupColDef(colDef) : adjustColDef(colDef);

    const adjustGroupColDef = (colDef: ColGroupDef): ColGroupDef => ({
      ...colDef,
      children: colDef.children.map((colDef) => adjustColDefOrGroup(colDef)),
    });

    const adjustColDef = (colDef: ColDef): ColDef => ({
      ...colDef,
      suppressSizeToFit: (sizeColumns === "auto" || sizeColumns === "auto-skip-headers") && !colDef.flex,
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
        const skipHeader = sizeColumns === "auto-skip-headers";
        if (sizeColumns === "auto" || skipHeader) {
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
    if (sizeColumns !== "none") {
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
      case "uiColumnDragged":
        userSizedColIds.current.add(colId);
        break;
      case "autosizeColumns":
        userSizedColIds.current.delete(colId);
        break;
    }
  }, []);

  const gridContextMenu = useGridContextMenu({ contextMenu: params.contextMenu, contextMenuSelectRow });

  const onRowDragLeave = useCallback((event: RowDragMoveEvent) => {
    const clientSideRowModel = event.api.getModel() as IClientSideRowModel;
    clientSideRowModel.highlightRowAtPixel(null);
  }, []);

  const onRowDragMove = useCallback((event: RowDragMoveEvent) => {
    if (event.overNode && event.node.rowIndex != null) {
      const clientSideRowModel = event.api.getModel() as IClientSideRowModel;

      //position 0 means highlight above, 1 means below
      const position = clientSideRowModel.getHighlightPosition(event.y, event.overNode as RowNode);

      //we don't want to show the row highlight if it wouldn't result in the row moving
      const targetIndex = event.overIndex + position - (event.node.rowIndex < event.overIndex ? 1 : 0);
      if (event.node.rowIndex != targetIndex) {
        clientSideRowModel.highlightRowAtPixel(event.node as RowNode, event.y);
      }
    }
  }, []);

  const onRowDragEnd = useCallback(
    async (event: RowDragEndEvent) => {
      const clientSideRowModel = event.api.getModel() as IClientSideRowModel;
      if (event.node.rowIndex != null) {
        const lastHighlightedRowNode = clientSideRowModel.getLastHighlightedRowNode();
        const isBelow = lastHighlightedRowNode && lastHighlightedRowNode.highlighted === RowHighlightPosition.Below;

        let targetIndex = event.overIndex;
        if (event.node.rowIndex > event.overIndex) {
          targetIndex += isBelow ? 1 : 0;
        } else {
          targetIndex += isBelow ? 0 : -1;
        }

        const moved = event.node.data;
        const target = event.overNode?.data;
        moved.id !== target?.id && //moved over a different row
          event.node.rowIndex != targetIndex && //moved to a different index
          params.onRowDragEnd &&
          (await params.onRowDragEnd(moved, target, targetIndex));
      }
      clientSideRowModel.highlightRowAtPixel(null);
    },
    [params],
  );

  // This is setting a ref in the GridContext so won't be triggering an update loop
  setOnCellEditingComplete(params.onCellEditingComplete);

  const headerRowCount = columnDefs.some((c) => (c as any).children) ? 2 : 1;

  return (
    <div
      data-testid={dataTestId}
      className={clsx(
        "Grid-container",
        theme,
        "theme-specific",
        staleGrid && "Grid-sortIsStale",
        gridReady && rowData && autoSized && "Grid-ready",
      )}
    >
      {gridContextMenu.component}
      <div style={{ flex: 1 }} ref={gridDivRef}>
        <AgGridReact
          reactiveCustomComponents={true}
          rowHeight={rowHeight}
          animateRows={params.animateRows ?? false}
          rowClassRules={params.rowClassRules}
          getRowId={(params) => `${params.data.id}`}
          suppressRowClickSelection={true}
          rowSelection={rowSelection}
          suppressBrowserResizeObserver={true}
          onGridSizeChanged={onGridSizeChanged}
          suppressColumnVirtualisation={suppressColumnVirtualization}
          suppressClickEdit={true}
          onColumnVisible={() => {
            setInitialContentSize();
          }}
          onRowDataUpdated={onRowDataChanged}
          onCellKeyDown={onCellKeyPress}
          onCellClicked={onCellClicked}
          onCellDoubleClicked={onCellDoubleClick}
          onCellEditingStarted={refreshSelectedRows}
          domLayout={params.domLayout}
          onColumnResized={onColumnResized}
          defaultColDef={{ minWidth: 48, ...omit(params.defaultColDef, ["editable"]) }}
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
          onModelUpdated={onModelUpdated}
          onGridReady={onGridReady}
          onSortChanged={ensureSelectedRowIsVisible}
          postSortRows={params.onRowDragEnd ? undefined : postSortRows}
          onSelectionChanged={synchroniseExternalStateToGridSelection}
          onColumnMoved={params.onColumnMoved}
          alwaysShowVerticalScroll={params.alwaysShowVerticalScroll}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          maintainColumnOrder={true}
          preventDefaultOnContextMenu={true}
          onCellContextMenu={gridContextMenu.cellContextMenu}
          rowDragText={params.rowDragText}
          onRowDragMove={onRowDragMove}
          onRowDragEnd={onRowDragEnd}
          onRowDragLeave={onRowDragLeave}
          suppressCellFocus={params.suppressCellFocus}
          pinnedTopRowData={params.pinnedTopRowData}
          pinnedBottomRowData={params.pinnedBottomRowData}
        />
      </div>
    </div>
  );
};
