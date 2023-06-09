import { CellClickedEvent, ColDef, ColumnResizedEvent, ModelUpdatedEvent } from "ag-grid-community";
import { CellClassParams, EditableCallback, EditableCallbackParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import {
  CellEditingStoppedEvent,
  CellEvent,
  GridReadyEvent,
  SelectionChangedEvent,
} from "ag-grid-community/dist/lib/events";
import { AgGridReact } from "ag-grid-react";
import clsx from "clsx";
import { difference, isEmpty, last, omit, xorBy } from "lodash-es";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { GridContext } from "../contexts/GridContext";
import { GridUpdatingContext } from "../contexts/GridUpdatingContext";
import { fnOrVar, isNotEmpty } from "../utils/util";
import { GridNoRowsOverlay } from "./GridNoRowsOverlay";
import { usePostSortRowsHook } from "./PostSortRowsHook";
import { GridHeaderSelect } from "./gridHeader";

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
  noRowsOverlayText?: string;
  postSortRows?: GridOptions["postSortRows"];
  animateRows?: boolean;
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
}

/**
 * Wrapper for AgGrid to add commonly used functionality.
 */
export const Grid = ({
  "data-testid": dataTestId,
  rowSelection = "multiple",
  suppressColumnVirtualization = true,
  theme = "ag-theme-alpine",
  sizeColumns = "auto-skip-headers",
  ...params
}: GridProps): JSX.Element => {
  const {
    gridReady,
    setApis,
    prePopupOps,
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
  } = useContext(GridContext);
  const { checkUpdating, updatedDep, isUpdating } = useContext(GridUpdatingContext);

  const lastSelectedIds = useRef<number[]>([]);
  const [staleGrid, setStaleGrid] = useState(false);
  const postSortRows = usePostSortRowsHook({ setStaleGrid });

  /**
   * onContentSize should only be called at maximum twice.
   * Once when an empty grid is loaded.
   * And again when the grid has content.
   */
  const hasSetContentSize = useRef(false);
  const hasSetContentSizeEmpty = useRef(false);

  const setInitialContentSize = useCallback(() => {
    const skipHeader = sizeColumns === "auto-skip-headers";
    if (sizeColumns === "auto" || skipHeader) {
      const result = autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current });
      if (isEmpty(params.rowData)) {
        if (!hasSetContentSizeEmpty.current && !hasSetContentSize.current) {
          hasSetContentSizeEmpty.current = true;
          params.onContentSize && result && params.onContentSize(result);
        }
      } else {
        if (!hasSetContentSize.current) {
          hasSetContentSize.current = true;
          params.onContentSize && result && params.onContentSize(result);
        }
      }
    }

    if (sizeColumns !== "none") {
      sizeColumnsToFit();
    }
  }, [autoSizeColumns, params, sizeColumns, sizeColumnsToFit]);

  /**
   * When the grid becomes ready resize it
   */
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
        focusByRowById(firstRowId);
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
  const columnDefs = useMemo((): ColDef[] => {
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
    rowSelection,
    clickSelectorCheckboxWhenContainingCellClicked,
  ]);

  /**
   * When grid is ready set the apis to the grid context and sync selected items to grid.
   */
  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      setApis(event.api, event.columnApi, dataTestId);
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
    if (isUpdating()) return;

    const skipHeader = sizeColumns === "auto-skip-headers";
    autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current, colIds: colIdsEdited.current });
    colIdsEdited.current.clear();
  }, [autoSizeColumns, isUpdating, params.rowData?.length, setInitialContentSize, sizeColumns, updatedDep]);

  /**
   * Show/hide no rows overlay when model changes.
   */
  const isShowingNoRowsOverlay = useRef(false);
  const onModelUpdated = useCallback((event: ModelUpdatedEvent) => {
    if (event.api.getDisplayedRowCount() === 0) {
      if (!isShowingNoRowsOverlay.current) {
        event.api.showNoRowsOverlay();
        isShowingNoRowsOverlay.current = true;
      }
    } else {
      if (isShowingNoRowsOverlay.current) {
        event.api.hideOverlay();
        isShowingNoRowsOverlay.current = false;
      }
    }
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
  const columnDefsAdjusted = useMemo(
    () =>
      columnDefs.map((colDef) => ({
        ...colDef,
        suppressSizeToFit: (sizeColumns === "auto" || sizeColumns === "auto-skip-headers") && !colDef.flex,
      })),
    [columnDefs, sizeColumns],
  );

  /**
   * Set of colIds that need auto-sizing.
   */
  const colIdsEdited = useRef(new Set<string>());

  /**
   * When cell editing has completed tag the colId as needing auto-sizing
   */
  const onCellEditingStopped = useCallback(
    (e: CellEditingStoppedEvent) => {
      const skipHeader = sizeColumns === "auto-skip-headers";
      if (sizeColumns === "auto" || skipHeader) {
        // This may be wrong as the cell update hasn't completed?
        const colId = e.colDef.colId;
        if (colId && !e.colDef.flex) {
          // This auto-sizes based on updatingContext completing
          colIdsEdited.current.add(colId);
          // This auto-sizes immediately in case it was an in place update
          !isUpdating() && autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current, colIds: [colId] });
        }
      }
    },
    [autoSizeColumns, isUpdating, sizeColumns],
  );

  const lastUpdatedDep = useRef(updatedDep);

  /**
   * If columns are edited, wait for the updating context to complete then auto-size them.
   */
  useEffect(() => {
    if (lastUpdatedDep.current === updatedDep || isEmpty(colIdsEdited.current)) return;
    lastUpdatedDep.current = updatedDep;

    // Don't update while there are spinners
    if (isUpdating()) return;

    const skipHeader = sizeColumns === "auto-skip-headers";
    autoSizeColumns({ skipHeader, userSizedColIds: userSizedColIds.current, colIds: colIdsEdited.current });
    colIdsEdited.current.clear();
  }, [autoSizeColumns, updatedDep, sizeColumns, isUpdating]);

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

  setOnCellEditingComplete(params.onCellEditingComplete);

  return (
    <div
      data-testid={dataTestId}
      className={clsx(
        "Grid-container",
        theme,
        staleGrid && "Grid-sortIsStale",
        gridReady && params.rowData && "Grid-ready",
      )}
    >
      <div style={{ flex: 1 }}>
        <AgGridReact
          animateRows={params.animateRows}
          rowClassRules={params.rowClassRules}
          getRowId={(params) => `${params.data.id}`}
          suppressRowClickSelection={true}
          rowSelection={rowSelection}
          suppressBrowserResizeObserver={true}
          onGridSizeChanged={onGridSizeChanged}
          suppressColumnVirtualisation={suppressColumnVirtualization}
          suppressClickEdit={true}
          onRowDataChanged={onRowDataChanged}
          onCellKeyPress={onCellKeyPress}
          onCellClicked={onCellClicked}
          onCellDoubleClicked={onCellDoubleClick}
          onCellEditingStarted={refreshSelectedRows}
          domLayout={params.domLayout}
          onCellEditingStopped={onCellEditingStopped}
          onColumnResized={onColumnResized}
          defaultColDef={{ minWidth: 48, ...omit(params.defaultColDef, ["editable"]) }}
          columnDefs={columnDefsAdjusted}
          rowData={params.rowData}
          noRowsOverlayComponent={GridNoRowsOverlay}
          noRowsOverlayComponentParams={{ rowData: params.rowData, noRowsOverlayText: params.noRowsOverlayText }}
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
        />
      </div>
    </div>
  );
};
