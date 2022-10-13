import "./GridStyles.scss";

import clsx from "clsx";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AgGridEvent, CellClickedEvent, ColDef } from "ag-grid-community";
import { CellEvent, GridReadyEvent, SelectionChangedEvent } from "ag-grid-community/dist/lib/events";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import { difference, last, xorBy } from "lodash-es";
import { AgGridContext } from "../contexts/AgGridContext";
import { usePostSortRowsHook } from "./PostSortRowHook";
import { isNotEmpty } from "../utils/util";
import { GridSelectHeader } from "./GridSelectHeader";
import { GridGenericCellRendererComponent } from "./GridGenericCellRenderer";
import { UpdatingContext } from "../contexts/UpdatingContext";

export interface BaseAgGridRow {
  id: string | number;
}
export interface AgGridProps {
  dataTestId?: string;
  quickFilterValue?: string;
  externalSelectedItems: any[];
  setExternalSelectedItems: (items: any[]) => void;
  onGridReady?: GridOptions["onGridReady"];
  defaultColDef: GridOptions["defaultColDef"];
  columnDefs: GridOptions["columnDefs"];
  rowData: GridOptions["rowData"];
  noRowsOverlayText?: string;
}

/**
 * Wrapper for AgGrid to add commonly used functionality.
 */
export const Grid = (params: AgGridProps): JSX.Element => {
  const { gridReady, setGridApi, setQuickFilter, ensureRowVisible, selectRowsById, ensureSelectedRowIsVisible } =
    useContext(AgGridContext);
  const { checkUpdating } = useContext(UpdatingContext);

  const lastSelectedIds = useRef<number[]>([]);
  const [staleGrid, setStaleGrid] = useState(false);
  const postSortRows = usePostSortRowsHook({ setStaleGrid });

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
  const synchroniseExternalStateToGridSelection = ({ api }: SelectionChangedEvent) => {
    const selectedRows = api.getSelectedRows();
    // We don't want to update selected Items if it hasn't changed to prevent excess renders
    if (
      params.externalSelectedItems.length != selectedRows.length ||
      isNotEmpty(xorBy(selectedRows, params.externalSelectedItems, (row) => row.id))
    ) {
      params.setExternalSelectedItems([...selectedRows]);
    }
  };

  /**
   * Synchronise externally selected items to grid.
   * If new ids are selected scroll them into view.
   */
  const synchroniseExternallySelectedItemsToGrid = useCallback(() => {
    if (!gridReady()) return;

    const selectedIds = params.externalSelectedItems.map((row) => row.id) as number[];
    const lastNewId = last(difference(selectedIds, lastSelectedIds.current));
    if (lastNewId != null) ensureRowVisible(lastNewId);
    lastSelectedIds.current = selectedIds;
    selectRowsById(selectedIds);
  }, [params.externalSelectedItems, ensureRowVisible, gridReady, selectRowsById]);

  /**
   * Synchronise quick filter to grid
   */
  const updateQuickFilter = useCallback(() => {
    if (!gridReady()) return;
    if (params.quickFilterValue == null) return;
    setQuickFilter(params.quickFilterValue);
  }, [gridReady, params.quickFilterValue, setQuickFilter]);

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

  const columnDefs = useMemo(
    (): GridOptions["columnDefs"] => [
      {
        colId: "selection",
        editable: false,
        initialWidth: 35,
        minWidth: 35,
        maxWidth: 35,
        suppressSizeToFit: true,
        checkboxSelection: true,
        headerComponent: GridSelectHeader,
        onCellClicked: clickSelectorCheckboxWhenContainingCellClicked,
      },
      ...(params.columnDefs as ColDef[]),
    ],
    [clickSelectorCheckboxWhenContainingCellClicked, params.columnDefs],
  );

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      setGridApi(event.api);
      params.onGridReady && params.onGridReady(event);
      synchroniseExternallySelectedItemsToGrid();
      updateQuickFilter();
    },
    [params, setGridApi, synchroniseExternallySelectedItemsToGrid, updateQuickFilter],
  );

  const noRowsOverlayComponent = useCallback(
    () => (
      <span className="ag-overlay-no-rows-center">{params.noRowsOverlayText ?? "There are currently no rows"}</span>
    ),
    [params.noRowsOverlayText],
  );

  const sizeColumnsToFit = useCallback((event: AgGridEvent) => {
    // @ts-ignore (gridBodyCtrl is private)
    if (event.api.gridBodyCtrl == undefined) {
      return;
      // this is here because ag grid was throwing api undefined error when closing POPPED OUT panel
    }
    event.api.sizeColumnsToFit();
  }, []);

  const refreshSelectedRows = useCallback((event: CellEvent): void => {
    // Force-refresh all selected rows to re-run class function, to update selection highlighting
    event.api.refreshCells({
      force: true,
      rowNodes: event.api.getSelectedNodes(),
    });
    const cell = event.api.getFocusedCell();
    cell && event.api.setFocusedCell(cell.rowIndex, cell.column);
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

  const singleClickEdit = useCallback(
    (event: CellEvent) => {
      if (event.colDef?.cellRendererParams?.singleClickEdit) {
        startCellEditing(event);
      }
    },
    [startCellEditing],
  );

  const onCellKeyDown = useCallback(
    (e: CellEvent) => {
      if ((e.event as KeyboardEvent).key === "Enter") startCellEditing(e);
    },
    [startCellEditing],
  );

  const onCellEditingStopped = useCallback(
    (event: CellEvent) => {
      refreshSelectedRows(event);
    },
    [refreshSelectedRows],
  );

  const defaultColDef = useMemo(
    () => ({
      cellRenderer: GridGenericCellRendererComponent,
      sortable: true,
      resizable: true,
      ...params.defaultColDef,
    }),
    [params.defaultColDef],
  );

  return (
    <div
      data-testid={params.dataTestId}
      className={clsx("ag-grid-grid", "ag-grid-grid--editing", "ag-theme-alpine", staleGrid && "aggrid-sortIsStale")}
    >
      <AgGridReact
        getRowId={(params) => `${params.data.id}`}
        suppressRowClickSelection={true}
        rowSelection={"multiple"}
        suppressBrowserResizeObserver={true}
        colResizeDefault={"shift"}
        onFirstDataRendered={sizeColumnsToFit}
        onGridSizeChanged={sizeColumnsToFit}
        suppressClickEdit={true}
        onCellKeyDown={onCellKeyDown}
        onCellClicked={singleClickEdit}
        onCellDoubleClicked={startCellEditing}
        onCellEditingStarted={refreshSelectedRows}
        onCellEditingStopped={onCellEditingStopped}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={params.rowData}
        noRowsOverlayComponent={noRowsOverlayComponent}
        onGridReady={onGridReady}
        onSortChanged={ensureSelectedRowIsVisible}
        postSortRows={postSortRows}
        onSelectionChanged={synchroniseExternalStateToGridSelection}
      />
    </div>
  );
};
