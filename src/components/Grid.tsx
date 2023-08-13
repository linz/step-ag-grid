import { CellClickedEvent, ColDef, ColGroupDef, ColumnResizedEvent, ModelUpdatedEvent } from "ag-grid-community";
import { CellClassParams, EditableCallback, EditableCallbackParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import { AgGridEvent, CellEvent, GridReadyEvent, SelectionChangedEvent } from "ag-grid-community/dist/lib/events";
import { AgGridReact } from "ag-grid-react";
import clsx from "clsx";
import { defer, difference, isEmpty, last, omit, xorBy } from "lodash-es";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { GridContext } from "../contexts/GridContext";
import { GridUpdatingContext } from "../contexts/GridUpdatingContext";
import { useIntervalHook } from "../lui/timeoutHook";
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
  postSortRows?: GridOptions["postSortRows"];
  animateRows?: boolean;
  rowHeight?: number;
  rowClassRules?: GridOptions["rowClassRules"];
  rowSelection?: "single" | "multiple";
  autoSelectFirstRow?: boolean;
  onColumnMoved?: GridOptions["onColumnMoved"];
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
}

/**
 * Wrapper for AgGrid to add commonly used functionality.
 */
export const Grid = ({
  "data-testid": dataTestId,
  rowSelection = "multiple",
  suppressColumnVirtualization = true,
  theme = "ag-theme-alpine",
  sizeColumns = "auto",
  selectColumnPinned = null,
  contextMenuSelectRow = false,
  ...params
}: GridProps): JSX.Element => {
  const {
    gridReady,
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
  } = useContext(GridContext);
  const { checkUpdating, updatedDep, updatingCols } = useContext(GridUpdatingContext);
  const { prePopupOps } = useContext(GridContext);

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
  const needsAutoSize = useRef(false);

  const setInitialContentSize = useCallback(() => {
    if (!gridDivRef.current?.clientWidth) {
      // Don't resize grids if they are offscreen as it doesn't work.
      needsAutoSize.current = true;
      return;
    }

    const headerCellCount = gridDivRef.current?.getElementsByClassName("ag-header-cell-label")?.length;
    if (headerCellCount < 2) {
      // Don't resize grids until all the columns are visible
      // as `autoSizeColumns` will fail silently in this case
      needsAutoSize.current = true;
      return;
    }

    const skipHeader = sizeColumns === "auto-skip-headers" && !isEmpty(params.rowData);
    if (sizeColumns === "auto" || skipHeader) {
      const result = autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current });
      if (isEmpty(params.rowData)) {
        if (!hasSetContentSizeEmpty.current && result && !hasSetContentSize.current) {
          hasSetContentSizeEmpty.current = true;
          params.onContentSize && params.onContentSize(result);
        }
      } else {
        if (result && !hasSetContentSize.current) {
          hasSetContentSize.current = true;
          params.onContentSize && params.onContentSize(result);
        }
      }
    }

    if (sizeColumns !== "none") {
      sizeColumnsToFit();
    }
    setAutoSized(true);
    needsAutoSize.current = false;
  }, [autoSizeColumns, params, sizeColumns, sizeColumnsToFit]);

  const lastOwnerDocumentRef = useRef<Document>();

  /**
   * Auto-size windows that had deferred auto-size
   */
  useIntervalHook({
    callback: () => {
      // Check if window has been popped out and needs resize
      const currentDocument = gridDivRef.current?.ownerDocument;
      if (currentDocument !== lastOwnerDocumentRef.current) {
        lastOwnerDocumentRef.current = currentDocument;
        if (currentDocument) {
          needsAutoSize.current = true;
        }
      }
      if (needsAutoSize.current) {
        needsAutoSize.current = false;
        setInitialContentSize();
      }
    },
    timeoutMs: 1000,
  });

  const previousGridReady = useRef(gridReady);
  useEffect(() => {
    if (!previousGridReady.current && gridReady) {
      previousGridReady.current = true;
      setInitialContentSize();
    }
  }, [gridReady, setInitialContentSize]);

  /**
   * On data load select the first row of the grid if required.
   */
  const hasSelectedFirstItem = useRef(false);
  useEffect(() => {
    if (!gridReady || hasSelectedFirstItem.current || !params.rowData || !externallySelectedItemsAreInSync) return;
    hasSelectedFirstItem.current = true;
    if (isNotEmpty(params.rowData) && isEmpty(params.externalSelectedItems)) {
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
    params.rowData,
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
      const editable = combineEditables(params.readOnly !== true, params.defaultColDef?.editable, colDefEditable);
      return {
        ...colDef,
        editable,
        cellClassRules: {
          ...colDef.cellClassRules,
          "GridCell-readonly": (ccp: CellClassParams) => !editable(ccp as any as EditableCallbackParams),
        },
      };
    });
    return params.selectable
      ? [
          {
            colId: "selection",
            editable: false,
            minWidth: 42,
            maxWidth: 42,
            pinned: selectColumnPinned,
            headerComponentParams: {
              exportable: false,
            },
            checkboxSelection: true,
            headerComponent: rowSelection === "multiple" ? GridHeaderSelect : null,
            suppressHeaderKeyboardEvent: (e) => {
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
      setApis(event.api, event.columnApi, dataTestId);
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
    const length = params.rowData?.length ?? 0;
    if (previousRowDataLength.current !== length) {
      setInitialContentSize();
      previousRowDataLength.current = length;
    }

    if (lastUpdatedDep.current === updatedDep || isEmpty(colIdsEdited.current)) return;
    lastUpdatedDep.current = updatedDep;

    // Don't update while there are spinners
    if (!isEmpty(updatingCols())) return;

    const skipHeader = sizeColumns === "auto-skip-headers";
    autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current, colIds: colIdsEdited.current });
    colIdsEdited.current.clear();
  }, [autoSizeColumns, params.rowData?.length, setInitialContentSize, sizeColumns, updatedDep, updatingCols]);

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
      if (event.colDef?.cellRendererParams?.singleClickEdit) {
        startCellEditing(event);
      }
    },
    [startCellEditing],
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
    (e: CellEvent) => {
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
          defer(() =>
            autoSizeColumns({
              skipHeader,
              userSizedColIds: userSizedColIds.current,
              colIds: colIdsEdited.current,
            }),
          );
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

  /**
   * Resize columns to fit if required on window/container resize
   */
  const onGridSizeChanged = useCallback(() => {
    if (sizeColumns !== "none") {
      sizeColumnsToFit();
    }
  }, [sizeColumns, sizeColumnsToFit]);

  /**
   * Set of column Id's that are prevented from auto-sizing as they are user set
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

  // This is setting a ref in the GridContext so won't be triggering an update loop
  setOnCellEditingComplete(params.onCellEditingComplete);

  return (
    <div
      data-testid={dataTestId}
      className={clsx(
        "Grid-container",
        theme,
        staleGrid && "Grid-sortIsStale",
        gridReady && params.rowData && autoSized && "Grid-ready",
      )}
    >
      {gridContextMenu.component}
      <div style={{ flex: 1 }} ref={gridDivRef}>
        <AgGridReact
          rowHeight={params.rowHeight}
          animateRows={params.animateRows}
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
          onRowDataChanged={onRowDataChanged}
          onCellKeyPress={onCellKeyPress}
          onCellClicked={onCellClicked}
          onCellDoubleClicked={onCellDoubleClick}
          onCellEditingStarted={refreshSelectedRows}
          domLayout={params.domLayout}
          onColumnResized={onColumnResized}
          defaultColDef={{ minWidth: 48, ...omit(params.defaultColDef, ["editable"]) }}
          columnDefs={columnDefsAdjusted}
          rowData={params.rowData}
          noRowsOverlayComponent={(event: AgGridEvent) => {
            let rowCount = 0;
            event.api.forEachNode(() => rowCount++);
            return (
              <GridNoRowsOverlay
                rowCount={rowCount}
                filteredRowCount={event.api.getDisplayedRowCount()}
                noRowsOverlayText={params.noRowsOverlayText}
              />
            );
          }}
          onModelUpdated={onModelUpdated}
          onGridReady={onGridReady}
          onSortChanged={ensureSelectedRowIsVisible}
          postSortRows={params.postSortRows ?? postSortRows}
          onSelectionChanged={synchroniseExternalStateToGridSelection}
          onColumnMoved={params.onColumnMoved}
          alwaysShowVerticalScroll={params.alwaysShowVerticalScroll}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          maintainColumnOrder={true}
          preventDefaultOnContextMenu={true}
          onCellContextMenu={gridContextMenu.cellContextMenu}
        />
      </div>
    </div>
  );
};
