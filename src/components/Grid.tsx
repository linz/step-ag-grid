import clsx from "clsx";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent, ColDef } from "ag-grid-community";
import { CellEvent, GridReadyEvent, SelectionChangedEvent } from "ag-grid-community/dist/lib/events";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import { difference, isEmpty, last, xorBy } from "lodash-es";
import { GridContext } from "../contexts/GridContext";
import { usePostSortRowsHook } from "./PostSortRowsHook";
import { fnOrVar, isNotEmpty } from "../utils/util";
import { GridHeaderSelect } from "./gridHeader/GridHeaderSelect";
import { GridUpdatingContext } from "../contexts/GridUpdatingContext";
import { CellClassParams } from "ag-grid-community/dist/lib/entities/colDef";

export interface GridBaseRow {
  id: string | number;
}

export interface GridProps {
  readOnly?: boolean; // set all editables to false when read only, make all styles black, otherwise style is gray for not editable
  selectable?: boolean;
  ["data-testid"]?: string;
  quickFilter?: boolean;
  quickFilterPlaceholder?: string;
  quickFilterValue?: string;
  domLayout?: GridOptions["domLayout"];
  externalSelectedItems?: any[];
  setExternalSelectedItems?: (items: any[]) => void;
  defaultColDef?: GridOptions["defaultColDef"];
  columnDefs: GridOptions["columnDefs"];
  rowData: GridOptions["rowData"];
  noRowsOverlayText?: string;
  postSortRows?: GridOptions["postSortRows"];
  animateRows?: boolean;
  rowClassRules?: GridOptions["rowClassRules"];
  rowSelection?: "single" | "multiple";
  autoSelectFirstRow?: boolean;
  onColumnMoved?: GridOptions["onColumnMoved"];
}

/**
 * Wrapper for AgGrid to add commonly used functionality.
 */
export const Grid = (params: GridProps): JSX.Element => {
  const {
    gridReady,
    setGridApi,
    setQuickFilter,
    ensureRowVisible,
    selectRowsById,
    focusByRowById,
    ensureSelectedRowIsVisible,
    sizeColumnsToFit,
    externallySelectedItemsAreInSync,
    setExternallySelectedItemsAreInSync,
  } = useContext(GridContext);
  const { checkUpdating } = useContext(GridUpdatingContext);

  const [internalQuickFilter, setInternalQuickFilter] = useState("");
  const lastSelectedIds = useRef<number[]>([]);
  const [staleGrid, setStaleGrid] = useState(false);
  const postSortRows = usePostSortRowsHook({ setStaleGrid });

  /**
   * On data load select the first row of the grid if required.
   */
  const hasSelectedFirstItem = useRef(false);
  useEffect(() => {
    if (!gridReady || hasSelectedFirstItem.current || !params.rowData || !externallySelectedItemsAreInSync) return;
    hasSelectedFirstItem.current = true;
    if (isNotEmpty(params.rowData) && isEmpty(params.externalSelectedItems)) {
      const firstRowId = params.rowData[0].id;
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
    params,
    params.autoSelectFirstRow,
    params.rowData,
    selectRowsById,
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
    if (lastNewId != null) ensureRowVisible(lastNewId);
    lastSelectedIds.current = selectedIds;
    selectRowsById(selectedIds);
    setExternallySelectedItemsAreInSync(true);
  }, [gridReady, params.externalSelectedItems, ensureRowVisible, selectRowsById, setExternallySelectedItemsAreInSync]);

  /**
   * Synchronise quick filter to grid
   */
  const updateQuickFilter = useCallback(() => {
    if (!gridReady) return;
    if (params.quickFilter) {
      setQuickFilter(internalQuickFilter);
      return;
    }
    if (params.quickFilterValue == null) return;
    setQuickFilter(params.quickFilterValue);
  }, [gridReady, internalQuickFilter, params.quickFilter, params.quickFilterValue, setQuickFilter]);

  /**
   * Synchronise quick filter to grid
   */
  useEffect(() => {
    updateQuickFilter();
  }, [updateQuickFilter]);

  /**
   * Synchronise externally selected items to grid on externalSelectedItems change
   */
  useEffect(() => {
    synchroniseExternallySelectedItemsToGrid();
  }, [synchroniseExternallySelectedItemsToGrid]);

  const columnDefs = useMemo((): GridOptions["columnDefs"] => {
    const adjustColDefs = (params.columnDefs as ColDef[]).map((colDef) => {
      return {
        ...colDef,
        editable: params.readOnly ? false : colDef.editable,
        cellClassRules: {
          ...colDef.cellClassRules,
          "GridCell-readonly": (ccp: CellClassParams) =>
            params.readOnly != null && !params.readOnly && !fnOrVar(colDef.editable, ccp),
        },
      };
    });
    return params.selectable
      ? [
          {
            colId: "selection",
            editable: false,
            initialWidth: 35,
            minWidth: 35,
            maxWidth: 35,
            suppressSizeToFit: true,
            checkboxSelection: true,
            headerComponent: GridHeaderSelect,
            suppressHeaderKeyboardEvent: (e) => {
              if ((e.event.key === "Enter" || e.event.key === " ") && !e.event.repeat) {
                const selectedNodeCount = e.api.getSelectedRows().length;
                if (selectedNodeCount == 0) {
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
  }, [clickSelectorCheckboxWhenContainingCellClicked, params.columnDefs, params.selectable, params.readOnly]);

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      setGridApi(event.api);
      synchroniseExternallySelectedItemsToGrid();
      updateQuickFilter();
    },
    [setGridApi, synchroniseExternallySelectedItemsToGrid, updateQuickFilter],
  );

  const noRowsOverlayComponent = useCallback(
    () => <span>{params.noRowsOverlayText ?? "There are currently no rows"}</span>,
    [params.noRowsOverlayText],
  );

  const refreshSelectedRows = useCallback((event: CellEvent): void => {
    // Force-refresh all selected rows to re-run class function, to update selection highlighting
    event.api.refreshCells({
      force: true,
      rowNodes: event.api.getSelectedNodes(),
    });
  }, []);

  const startCellEditing = useCallback(
    (event: CellEvent) => {
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
    [checkUpdating],
  );

  const onCellDoubleClick = useCallback(
    (event: CellEvent) => {
      if (!invokeEditAction(event)) startCellEditing(event);
    },
    [startCellEditing],
  );

  const onCellClicked = useCallback(
    (event: CellEvent) => {
      if (event.colDef?.cellRendererParams?.singleClickEdit) {
        startCellEditing(event);
      }
    },
    [startCellEditing],
  );

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

  const onCellKeyPress = useCallback(
    (e: CellEvent) => {
      if ((e.event as KeyboardEvent).key === "Enter") {
        if (!invokeEditAction(e)) startCellEditing(e);
      }
    },
    [startCellEditing],
  );

  const onCellEditingStopped = useCallback(
    (event: CellEvent) => {
      refreshSelectedRows(event);
      // The grid loses cell focus after editing
      const cell = event.api.getFocusedCell();
      cell && event.api.setFocusedCell(cell.rowIndex, cell.column);
    },
    [refreshSelectedRows],
  );

  // When rows added or removed then resize columns
  useEffect(() => {
    if (columnDefs?.length) {
      sizeColumnsToFit();
    }
  }, [columnDefs?.length, sizeColumnsToFit]);

  return (
    <div
      data-testid={params["data-testid"]}
      className={clsx(
        "Grid-container",
        "ag-theme-alpine",
        staleGrid && "Grid-sortIsStale",
        gridReady && params.rowData && "Grid-ready",
      )}
    >
      {params.quickFilter && (
        <div className="Grid-quickFilter">
          <input
            aria-label="Search"
            className="lui-margin-top-xxs lui-margin-bottom-xxs Grid-quickFilterBox"
            type="text"
            placeholder={params.quickFilterPlaceholder ?? "Search..."}
            value={internalQuickFilter}
            onChange={(event): void => {
              setInternalQuickFilter(event.target.value);
            }}
          />
        </div>
      )}
      <AgGridReact
        animateRows={params.animateRows}
        rowClassRules={params.rowClassRules}
        defaultColDef={params.defaultColDef}
        getRowId={(params) => `${params.data.id}`}
        suppressRowClickSelection={true}
        rowSelection={params.rowSelection ?? "multiple"}
        suppressBrowserResizeObserver={true}
        colResizeDefault={"shift"}
        onFirstDataRendered={sizeColumnsToFit}
        onGridSizeChanged={sizeColumnsToFit}
        suppressClickEdit={true}
        onCellKeyPress={onCellKeyPress}
        onCellClicked={onCellClicked}
        onCellDoubleClicked={onCellDoubleClick}
        onCellEditingStarted={refreshSelectedRows}
        onCellEditingStopped={onCellEditingStopped}
        domLayout={params.domLayout}
        columnDefs={columnDefs}
        rowData={params.rowData}
        noRowsOverlayComponent={noRowsOverlayComponent}
        onGridReady={onGridReady}
        onSortChanged={ensureSelectedRowIsVisible}
        postSortRows={params.postSortRows ?? postSortRows}
        onSelectionChanged={synchroniseExternalStateToGridSelection}
        onColumnMoved={params.onColumnMoved}
      />
    </div>
  );
};
