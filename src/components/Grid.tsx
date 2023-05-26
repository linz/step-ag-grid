import { CellClickedEvent, ColDef, ModelUpdatedEvent } from "ag-grid-community";
import { CellClassParams, EditableCallback, EditableCallbackParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import {
  CellEvent,
  FirstDataRenderedEvent,
  GridReadyEvent,
  GridSizeChangedEvent,
  SelectionChangedEvent,
} from "ag-grid-community/dist/lib/events";
import { AgGridReact } from "ag-grid-react";
import clsx from "clsx";
import { difference, isEmpty, last, xorBy } from "lodash-es";
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
  onGridSizeChanged?: GridOptions["onGridSizeChanged"];
  onFirstDataRendered?: GridOptions["onFirstDataRendered"];
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
   * <li>"auto" (default) will size columns based on their content but still obeying min/max sizing.</li>
   * <li>"auto-skip-headers" same as auto but does not take headers into account.</li>
   * </ul>
   *
   * If you want to stretch to container width if width is greater than the container add a flex column.
   */
  sizeColumns?: "fit" | "auto" | "auto-skip-headers" | "none";
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
  ...params
}: GridProps): JSX.Element => {
  const {
    gridReady,
    setApis,
    prePopupOps,
    ensureRowVisible,
    selectRowsById,
    focusByRowById,
    ensureSelectedRowIsVisible,
    autoSizeAllColumns,
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

  const setInitialContentSize = useCallback(() => {
    const skipHeaders = sizeColumns === "auto-skip-headers";
    if (sizeColumns === "auto" || skipHeaders) {
      // If we aren't skipping headers and there's no data, then don't skip headers
      const result = autoSizeAllColumns({ skipHeader: skipHeaders && !isEmpty(params.rowData) });
      params.onContentSize && result && params.onContentSize(result);
    }

    if (sizeColumns !== "none") {
      sizeColumnsToFit();
    }
  }, [autoSizeAllColumns, params, sizeColumns, sizeColumnsToFit]);

  const onFirstDataRendered = useCallback(
    (event: FirstDataRenderedEvent) => {
      params.onFirstDataRendered && params.onFirstDataRendered(event);
      setInitialContentSize();
    },
    [params, setInitialContentSize],
  );

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
    params.externalSelectedItems,
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
  useEffect(() => {
    const length = params.rowData?.length ?? 0;
    if (previousRowDataLength.current !== length) {
      if (previousRowDataLength.current === 0 && length > 0) {
        setInitialContentSize();
      }
      previousRowDataLength.current = length;
    }
  }, [params.rowData?.length, setInitialContentSize]);

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

  const onGridSizeChanged = useCallback(
    (event: GridSizeChangedEvent) => {
      params.onGridSizeChanged && params.onGridSizeChanged(event);
      sizeColumns !== "none" && sizeColumnsToFit();
    },
    [params, sizeColumns, sizeColumnsToFit],
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
          onFirstDataRendered={onFirstDataRendered}
          onGridSizeChanged={onGridSizeChanged}
          suppressColumnVirtualisation={suppressColumnVirtualization}
          suppressClickEdit={true}
          onCellKeyPress={onCellKeyPress}
          onCellClicked={onCellClicked}
          onCellDoubleClicked={onCellDoubleClick}
          onCellEditingStarted={refreshSelectedRows}
          domLayout={params.domLayout}
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
