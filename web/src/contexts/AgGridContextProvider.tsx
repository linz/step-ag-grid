import { ReactElement, ReactNode, useCallback, useRef } from "react";
import { GridApi, RowNode } from "ag-grid-community";
import { AgGridContext } from "./AgGridContext";
import { isNotEmpty } from "../utils/util";
import { difference, isEmpty, last } from "lodash-es";

interface AgGridContextProps {
  children: ReactNode;
}

export const AgGridContextProvider = (props: AgGridContextProps): ReactElement => {
  const gridApiRef = useRef<GridApi>();
  const idsBeforeUpdate = useRef<number[]>([]);

  /**
   * Grid api has been set.
   */
  const gridReady = () => {
    return gridApiRef.current != null;
  };

  /**
   * Set current ref to grid api.
   */
  const setGridApi = (_gridApi: GridApi | undefined) => {
    gridApiRef.current = _gridApi;
  };

  /**
   * Set the quick filter value to grid.
   */
  const setQuickFilter = (quickFilter: string) => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return;
    }
    gridApi.setQuickFilter(quickFilter);
  };

  /**
   * Get all row id's in grid
   */
  const getAllRowIds = (gridApi: GridApi) => {
    const result: number[] = [];
    gridApi.forEachNode((node) => result.push(node.data.id));
    return result;
  };

  /**
   * Get grid nodes via rowIds.
   *
   * @param rowIds If specified gets RowNodes from grid, otherwise uses beforeUpdate ids to find new nodes.
   */
  const rowIdsToNodes = (rowIds?: number[]): RowNode[] => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return [];
    }
    if (rowIds === undefined) {
      rowIds = difference(getAllRowIds(gridApi), idsBeforeUpdate.current);
    }

    return rowIds
      .map((rowId) => gridApi.getRowNode("" + rowId)) //
      .filter((r) => r) as RowNode[];
  };

  /**
   * Record all row id's before update so that we can select/flash the new rows after update.
   */
  const beforeUpdate = () => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      idsBeforeUpdate.current = [];
      console.error("no gridApi set");
      return;
    }

    idsBeforeUpdate.current = getAllRowIds(gridApi);
  };

  /**
   * Internal method for selecting and flashing rows.
   *
   * @param rowIds RowIds to select and flash. If undefined a diff is done with beforeUpdate and current state to select
   * @param select Whether to select rows
   * @param flash Whether to flash rows
   * @param retryCount Table updates may not be present when this is called, so retry is needed.
   */
  const selectRowsWithOptionalFlash = (
    rowIds: number[] | undefined,
    select: boolean,
    flash: boolean,
    retryCount = 5, // We retry for approximately 5x200ms=1s
  ) => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return;
    }

    const rowNodes = rowIdsToNodes(rowIds);
    const gridRowIdsNotUpdatedYet = rowIds && rowNodes.length !== rowIds.length; // rowIds are specified
    const gridRowIdsNotChangedYet = !rowIds && isEmpty(rowNodes); // rowIds are from beforeUpdate
    const gridHasNotUpdated = gridRowIdsNotUpdatedYet || gridRowIdsNotChangedYet;
    // After retry count expires we give-up and deselect all rows, then select any subset of rows that have updated
    if (gridHasNotUpdated && retryCount > 0) {
      setTimeout(() => selectRowsWithOptionalFlash(rowIds, select, flash, retryCount - 1), 250);
      return;
    }
    select && gridApi.deselectAll();
    if (isNotEmpty(rowNodes)) {
      gridApi.ensureNodeVisible(rowNodes[0]);
      if (select) {
        rowNodes.forEach((nodeToSelect) => nodeToSelect.setSelected(true));
      }
      if (flash) {
        setTimeout(() => {
          try {
            gridApi.flashCells({ rowNodes });
          } catch {
            // ignore, flash cells sometimes throws errors as nodes have gone out of scope
          }
        }, 250);
      }
    }
  };

  const selectRows = (rowIds?: number[]) => selectRowsWithOptionalFlash(rowIds, true, false);
  const selectRowsWithFlash = (rowIds?: number[]) => selectRowsWithOptionalFlash(rowIds, true, true);
  const flashRows = (rowIds?: number[]) => selectRowsWithOptionalFlash(rowIds, false, true);

  const selectRowsDiff = async (fn: () => Promise<any>) => {
    beforeUpdate();
    await fn();
    selectRowsWithOptionalFlash(undefined, true, false);
  };

  const selectRowsWithFlashDiff = async (fn: () => Promise<any>) => {
    beforeUpdate();
    await fn();
    selectRowsWithOptionalFlash(undefined, true, true);
  };

  const flashRowsDiff = async (fn: () => Promise<any>) => {
    beforeUpdate();
    await fn();
    selectRowsWithOptionalFlash(undefined, false, true);
  };

  const getSelectedRows = <T extends unknown>(): T[] => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return [];
    }

    return gridApi.getSelectedRows();
  };

  const getSelectedRowIds = (): number[] => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return [];
    }

    return gridApi.getSelectedRows().map((row) => row.id);
  };

  const selectNodeById = (id: number): void => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return;
    }
    const node = gridApi.getRowNode(`${id}`);
    if (node && !node.isSelected()) {
      node.setSelected(true);
    }
  };

  const deselectNodeById = (id: number): void => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return;
    }
    const node = gridApi.getRowNode(`${id}`);
    if (node && node.isSelected()) {
      node.setSelected(false);
    }
  };

  const setSelectedRowIds = (ids: number[]): void => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return;
    }

    gridApi
      .getSelectedNodes()
      ?.filter((node) => !ids.includes(node.data.id))
      .forEach((node) => {
        deselectNodeById(node.data.id);
      });

    ids.forEach((id) => selectNodeById(id));
  };

  const editingCells = (): boolean => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return false;
    }
    return isNotEmpty(gridApi.getEditingCells());
  };

  const ensureRowVisible = (id: number): void => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return;
    }
    const node = gridApi.getRowNode(`${id}`);
    gridApi.ensureNodeVisible(node);
  };

  /**
   * Scroll last selected row into view on grid sort change
   */
  const ensureSelectedRowIsVisible = useCallback((): void => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return;
    }
    const selectedNodes = gridApi.getSelectedNodes();
    if (isEmpty(selectedNodes)) return;
    gridApi.ensureNodeVisible(last(selectedNodes));
  }, []);

  const stopEditing = (): void => {
    const gridApi = gridApiRef.current;
    if (!gridApi) {
      console.error("no gridApi set");
      return;
    }
    gridApi.stopEditing();
  };

  return (
    <AgGridContext.Provider
      value={{
        gridReady,
        setGridApi,
        setQuickFilter,
        selectRows,
        selectRowsDiff,
        selectRowsWithFlash,
        selectRowsWithFlashDiff,
        flashRows,
        flashRowsDiff,
        getSelectedRows,
        getSelectedRowIds,
        setSelectedRowIds,
        editingCells,
        ensureRowVisible,
        ensureSelectedRowIsVisible,
        stopEditing,
      }}
    >
      {props.children}
    </AgGridContext.Provider>
  );
};
