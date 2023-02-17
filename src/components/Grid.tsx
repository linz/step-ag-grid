import clsx from "clsx";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent, ColDef, ModelUpdatedEvent } from "ag-grid-community";
import { AgGridEvent, CellEvent, GridReadyEvent, SelectionChangedEvent } from "ag-grid-community/dist/lib/events";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import { difference, isEmpty, last, xorBy } from "lodash-es";
import { GridContext } from "../contexts/GridContext";
import { usePostSortRowsHook } from "./PostSortRowsHook";
import { fnOrVar, isNotEmpty } from "../utils/util";
import { GridHeaderSelect } from "./gridHeader/GridHeaderSelect";
import { GridUpdatingContext } from "../contexts/GridUpdatingContext";
import { CellClassParams, EditableCallback, EditableCallbackParams } from "ag-grid-community/dist/lib/entities/colDef";

export interface GridBaseRow {
  id: string | number;
}

export interface GridProps {
  readOnly?: boolean; // set all editables to false when read only, make all styles black, otherwise style is gray for not editable
  selectable?: boolean;
  ["data-testid"]?: string;
  domLayout?: GridOptions["domLayout"];
  externalSelectedItems?: any[];
  setExternalSelectedItems?: (items: any[]) => void;
  defaultColDef?: GridOptions["defaultColDef"];
  columnDefs: ColDef[];
  rowData: GridOptions["rowData"];
  postSortRows?: GridOptions["postSortRows"];
  animateRows?: boolean;
  rowClassRules?: GridOptions["rowClassRules"];
  rowSelection?: "single" | "multiple";
  autoSelectFirstRow?: boolean;
  onColumnMoved?: GridOptions["onColumnMoved"];
  alwaysShowVerticalScroll?: boolean;
}

/**
 * Wrapper for AgGrid to add commonly used functionality.
 */
export const Grid = (params: GridProps): JSX.Element => {
  const {
    gridReady,
    setGridApi,
    prePopupOps,
    ensureRowVisible,
    selectRowsById,
    focusByRowById,
    ensureSelectedRowIsVisible,
    sizeColumnsToFit,
    externallySelectedItemsAreInSync,
    setExternallySelectedItemsAreInSync,
    isExternalFilterPresent,
    doesExternalFilterPass,
  } = useContext(GridContext);
  const { checkUpdating } = useContext(GridUpdatingContext);

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
  useEffect(() => {
    synchroniseExternallySelectedItemsToGrid();
  }, [synchroniseExternallySelectedItemsToGrid]);

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
            suppressSizeToFit: true,
            checkboxSelection: true,
            headerComponent: params.rowSelection === "multiple" ? GridHeaderSelect : null,
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
  }, [
    params.columnDefs,
    params.selectable,
    params.rowSelection,
    params.readOnly,
    params.defaultColDef?.editable,
    clickSelectorCheckboxWhenContainingCellClicked,
  ]);

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      setGridApi(event.api);
      synchroniseExternallySelectedItemsToGrid();
    },
    [setGridApi, synchroniseExternallySelectedItemsToGrid],
  );

  const noRowsOverlayComponent = useCallback(
    (event: AgGridEvent) => {
      const hasData = (params.rowData?.length ?? 0) > 0;
      const hasFilteredData = event.api.getDisplayedRowCount() > 0;
      return (
        <span>{!hasData ? "There are currently no rows" : !hasFilteredData ? "All rows have been filtered" : ""}</span>
      );
    },
    [params.rowData?.length],
  );

  const onModelUpdated = useCallback((event: ModelUpdatedEvent) => {
    event.api.getDisplayedRowCount() === 0 ? event.api.showNoRowsOverlay() : event.api.hideOverlay();
  }, []);

  const refreshSelectedRows = useCallback((event: CellEvent): void => {
    // Force-refresh all selected rows to re-run class function, to update selection highlighting
    event.api.refreshCells({
      force: true,
      rowNodes: event.api.getSelectedNodes(),
    });
  }, []);

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
      <div style={{ flex: 1 }}>
        <AgGridReact
          animateRows={params.animateRows}
          rowClassRules={params.rowClassRules}
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
          domLayout={params.domLayout}
          columnDefs={columnDefs}
          rowData={params.rowData}
          noRowsOverlayComponent={noRowsOverlayComponent}
          onModelUpdated={onModelUpdated}
          onGridReady={onGridReady}
          onSortChanged={ensureSelectedRowIsVisible}
          postSortRows={params.postSortRows ?? postSortRows}
          onSelectionChanged={synchroniseExternalStateToGridSelection}
          onColumnMoved={params.onColumnMoved}
          alwaysShowVerticalScroll={params.alwaysShowVerticalScroll}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
        />
      </div>
    </div>
  );
};
