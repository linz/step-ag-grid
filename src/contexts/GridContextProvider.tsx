import { ReactElement, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { ColDef, GridApi, RowNode } from "ag-grid-community";
import { GridContext } from "./GridContext";
import { defer, delay, difference, isEmpty, last, sortBy } from "lodash-es";
import { isNotEmpty, wait } from "../utils/util";
import { GridUpdatingContext } from "./GridUpdatingContext";
import { GridBaseRow } from "../components/Grid";

interface GridContextProps {
  children: ReactNode;
}

/**
 * Context for AgGrid operations.
 * Make sure you wrap AgGrid in this.
 * Also, make sure the provider is created in a separate component, otherwise it won't be found.
 */
export const GridContextProvider = (props: GridContextProps): ReactElement => {
  const { modifyUpdating } = useContext(GridUpdatingContext);
  const [gridApi, _setGridApi] = useState<GridApi>();
  const [gridReady, setGridReady] = useState(false);
  const idsBeforeUpdate = useRef<number[]>([]);
  const externallySelectedItemsAreInSync = useRef(false);

  const setGridApi = useCallback((gridApi: GridApi | undefined) => {
    _setGridApi(gridApi);
    setGridReady(!!gridApi);
  }, []);

  /**
   * Wraps things that require gridApi in common handling, for when gridApi not present.
   *
   * @param hasApiFn Execute when api is ready.
   * @param noApiFn Execute if api is not ready.
   */
  const gridApiOp = useCallback(
    <T extends unknown, R extends unknown>(hasApiFn: (gridApi: GridApi) => T, noApiFn?: () => R): T | R => {
      if (!noApiFn) {
        noApiFn = (() => {}) as () => R;
      }
      return gridApi ? hasApiFn(gridApi) : noApiFn();
    },
    [gridApi],
  );

  /**
   * Set the quick filter value to grid.
   */
  const setQuickFilter = useCallback(
    (quickFilter: string) => {
      gridApiOp((gridApi) => gridApi.setQuickFilter(quickFilter));
    },
    [gridApiOp],
  );

  /**
   * Get all row id's in grid.
   */
  const _getAllRowIds = useCallback(() => {
    const result: number[] = [];
    return gridApiOp(
      (gridApi) => {
        gridApi.forEachNode((node) => result.push(node.data.id));
        return result;
      },
      () => result,
    );
  }, [gridApiOp]);

  /**
   * Record all row id's before update so that we can select/flash the new rows after update.
   */
  const beforeUpdate = useCallback(() => {
    idsBeforeUpdate.current = _getAllRowIds();
  }, [_getAllRowIds]);

  /**
   * Find new row ids
   * Uses beforeUpdate ids to find new nodes.
   */
  const _getNewNodes = useCallback((): RowNode[] => {
    return gridApiOp(
      (gridApi) =>
        difference(_getAllRowIds(), idsBeforeUpdate.current)
          .map((rowId) => gridApi.getRowNode("" + rowId)) //
          .filter((r) => r) as RowNode[],
      () => [],
    );
  }, [_getAllRowIds, gridApiOp]);

  /**
   * Get grid nodes via rowIds.  If rowIds has no matching node the result may be smaller than expected.
   * This can happen if the grid has not re-rendered yet.
   *
   * @param rowIds Row ids to get from grid.
   */
  const _rowIdsToNodes = useCallback(
    (rowIds: number[]): RowNode[] => {
      return gridApiOp(
        (gridApi) =>
          rowIds
            .map((rowId) => gridApi.getRowNode("" + rowId)) //
            .filter((r) => r) as RowNode[],
        () => [] as RowNode[],
      );
    },
    [gridApiOp],
  );

  /**
   * Internal method for selecting and flashing rows.
   *
   * @param rowIds RowIds to select and flash. If undefined a diff is done with beforeUpdate and current state to select
   * @param select Whether to select rows
   * @param flash Whether to flash rows
   * @param retryCount Table updates may not be present when this is called, so retry is needed.
   */
  const _selectRowsWithOptionalFlash = useCallback(
    (
      rowIds: number[] | undefined,
      select: boolean,
      flash: boolean,
      retryCount = 15, // We retry for approximately 5x200ms=1s
    ) => {
      return gridApiOp((gridApi) => {
        const rowNodes = rowIds ? _rowIdsToNodes(rowIds) : _getNewNodes();
        const gridRowIdsNotUpdatedYet = rowIds && rowNodes.length !== rowIds.length; // rowIds are specified
        const gridRowIdsNotChangedYet = !rowIds && isEmpty(rowNodes); // rowIds are from beforeUpdate
        const gridHasNotUpdated = gridRowIdsNotUpdatedYet || gridRowIdsNotChangedYet;
        // After retry count expires we give-up and deselect all rows, then select any subset of rows that have updated
        if (gridHasNotUpdated && retryCount > 0) {
          delay(() => _selectRowsWithOptionalFlash(rowIds, select, flash, retryCount - 1), 250);
          return;
        }

        const rowsThatNeedSelecting = sortBy(
          rowNodes.filter((node) => !node.isSelected()),
          (node) => node.data.id,
        );
        const firstNode = rowsThatNeedSelecting[0];
        if (firstNode) {
          gridApi.ensureNodeVisible(firstNode);
          const colDefs = gridApi.getColumnDefs();
          if (colDefs && colDefs.length) {
            const col = colDefs[0] as ColDef; // We don't support ColGroupDef
            const rowIndex = firstNode.rowIndex;
            if (rowIndex != null && col != null) {
              const colId = col.colId;
              // We need to make sure we aren't currently editing a cell otherwise tests will fail
              // as they will start to edit the cell before this stuff has a chance to run
              colId != null &&
                defer(() => isEmpty(gridApi.getEditingCells()) && gridApi.setFocusedCell(rowIndex, colId));
            }
          }
        }
        if (select) {
          // Select rows that shouldn't be selected
          rowsThatNeedSelecting.forEach((node) => node.setSelected(true));
          // Unselect rows that shouldn't be selected
          gridApi.getSelectedNodes()?.forEach((node) => {
            if (node && !rowNodes.includes(node)) {
              node.setSelected(false);
            }
          });
        }
        if (flash) {
          delay(() => {
            try {
              gridApi.flashCells({ rowNodes });
            } catch {
              // ignore, flash cells sometimes throws errors as nodes have gone out of scope
            }
          }, 250);
        }
      });
    },
    [_getNewNodes, _rowIdsToNodes, gridApiOp],
  );

  const selectRowsById = useCallback(
    (rowIds?: number[]) => _selectRowsWithOptionalFlash(rowIds, true, false),
    [_selectRowsWithOptionalFlash],
  );
  const selectRowsByIdWithFlash = useCallback(
    (rowIds?: number[]) => _selectRowsWithOptionalFlash(rowIds, true, true),
    [_selectRowsWithOptionalFlash],
  );
  const flashRows = useCallback(
    (rowIds?: number[]) => _selectRowsWithOptionalFlash(rowIds, false, true),
    [_selectRowsWithOptionalFlash],
  );

  const selectRowsDiff = useCallback(
    async (fn: () => Promise<any>) => {
      beforeUpdate();
      await fn();
      _selectRowsWithOptionalFlash(undefined, true, false);
    },
    [_selectRowsWithOptionalFlash, beforeUpdate],
  );

  const selectRowsWithFlashDiff = useCallback(
    async (fn: () => Promise<any>) => {
      beforeUpdate();
      await fn();
      _selectRowsWithOptionalFlash(undefined, true, true);
    },
    [_selectRowsWithOptionalFlash, beforeUpdate],
  );

  const flashRowsDiff = useCallback(
    async (fn: () => Promise<any>) => {
      beforeUpdate();
      await fn();
      _selectRowsWithOptionalFlash(undefined, false, true);
    },
    [_selectRowsWithOptionalFlash, beforeUpdate],
  );

  const getSelectedRows = useCallback(<T extends unknown>(): T[] => {
    return gridApiOp(
      (gridApi) => gridApi.getSelectedRows(),
      () => [],
    );
  }, [gridApiOp]);

  const getSelectedRowIds = useCallback(
    (): number[] => getSelectedRows().map((row) => (row as any).id as number),
    [getSelectedRows],
  );

  const editingCells = useCallback((): boolean => {
    return gridApiOp(
      (gridApi) => isNotEmpty(gridApi.getEditingCells()),
      () => false,
    );
  }, [gridApiOp]);

  const ensureRowVisible = useCallback(
    (id: number | string): boolean => {
      return gridApiOp((gridApi) => {
        const node = gridApi.getRowNode(`${id}`);
        if (!node) return false;
        gridApi.ensureNodeVisible(node);
        return true;
      });
    },
    [gridApiOp],
  );

  /**
   * Scroll last selected row into view on grid sort change
   */
  const ensureSelectedRowIsVisible = useCallback((): void => {
    gridApiOp((gridApi) => {
      const selectedNodes = gridApi.getSelectedNodes();
      if (isEmpty(selectedNodes)) return;
      gridApi.ensureNodeVisible(last(selectedNodes));
    });
  }, [gridApiOp]);

  /**
   * Resize columns to fit container
   */
  const sizeColumnsToFit = useCallback((): void => {
    gridApiOp((gridApi) => {
      // Hide size columns to fit errors in tests
      document.body.clientWidth && gridApi.sizeColumnsToFit();
    });
  }, [gridApiOp]);

  const stopEditing = useCallback((): void => gridApiOp((gridApi) => gridApi.stopEditing()), [gridApiOp]);

  const selectNextCell = useCallback(
    (tabDirection: -1 | 0 | 1 = 0) => {
      gridApiOp((gridApi) => {
        if (tabDirection == 1) gridApi.tabToNextCell();
        if (tabDirection == -1) gridApi.tabToPreviousCell();
      });
    },
    [gridApiOp],
  );

  const updatingCells = useCallback(
    async (
      props: { selectedRows: GridBaseRow[]; field?: string },
      fnUpdate: (selectedRows: any[]) => Promise<boolean>,
      setSaving?: (saving: boolean) => void,
      tabDirection?: 1 | 0 | -1,
    ): Promise<boolean> => {
      setSaving && setSaving(true);
      return await gridApiOp(async (gridApi) => {
        const preOpCell = gridApi.getFocusedCell();

        const selectedRows = props.selectedRows;

        let ok = false;
        await modifyUpdating(
          props.field ?? "",
          selectedRows.map((data) => data.id),
          async () => {
            // Need to refresh to get spinners to work on all rows
            gridApi.refreshCells({ rowNodes: props.selectedRows as RowNode[], force: true });
            ok = await fnUpdate(selectedRows).catch((ex) => {
              console.error("Exception during modifyUpdating", ex);
              return false;
            });
          },
        );

        // async processes need to refresh their own rows
        gridApi.refreshCells({ rowNodes: selectedRows as RowNode[], force: true });

        if (ok) {
          const cell = gridApi.getFocusedCell();
          if (cell && gridApi.getFocusedCell() == null) {
            gridApi.setFocusedCell(cell.rowIndex, cell.column);
          }
          // This is needed to trigger postSortRowsHook
          gridApi.refreshClientSideRowModel();
        } else {
          // Don't set saving if ok as the form has already closed
          setSaving && setSaving(false);
        }

        // Only focus next cell if user hasn't already manually changed focus
        const postOpCell = gridApi.getFocusedCell();
        if (
          tabDirection &&
          preOpCell &&
          postOpCell &&
          preOpCell.rowIndex == postOpCell.rowIndex &&
          preOpCell.column.getColId() == postOpCell.column.getColId()
        ) {
          selectNextCell(tabDirection);
        }

        return ok;
      });
    },
    [gridApiOp, modifyUpdating, selectNextCell],
  );

  const redrawRows = useCallback(
    (rowNodes?: RowNode[]) => {
      gridApiOp((gridApi) => {
        gridApi.redrawRows(rowNodes ? { rowNodes } : undefined);
      });
    },
    [gridApiOp],
  );

  const setExternallySelectedItemsAreInSync = useCallback((inSync: boolean) => {
    externallySelectedItemsAreInSync.current = inSync;
  }, []);

  const waitForExternallySelectedItemsToBeInSync = useCallback(async () => {
    // Wait for up to 5 seconds
    for (let i = 0; i < 5000 / 200 && !externallySelectedItemsAreInSync.current; i++) {
      await wait(200);
    }
  }, []);

  return (
    <GridContext.Provider
      value={{
        gridReady,
        setGridApi,
        setQuickFilter,
        selectRowsById,
        selectRowsDiff,
        selectRowsByIdWithFlash,
        selectRowsWithFlashDiff,
        flashRows,
        flashRowsDiff,
        getSelectedRows,
        getSelectedRowIds,
        editingCells,
        ensureRowVisible,
        ensureSelectedRowIsVisible,
        sizeColumnsToFit,
        stopEditing,
        updatingCells,
        redrawRows,
        setExternallySelectedItemsAreInSync,
        waitForExternallySelectedItemsToBeInSync,
      }}
    >
      {props.children}
    </GridContext.Provider>
  );
};
