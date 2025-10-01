import { CellPosition, ColDef, GridApi, IRowNode, RowNode } from 'ag-grid-community';
import { CsvExportParams, ProcessCellForExportParams } from 'ag-grid-community';
import debounce from 'debounce-promise';
import { compact, defer, delay, difference, filter, isEmpty, last, pull, remove, sortBy, sumBy } from 'lodash-es';
import { PropsWithChildren, ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ColDefT, GridBaseRow } from '../components';
import { GridCellFillerColId, isGridCellFiller } from '../components/GridCellFiller';
import { getColId, isFlexColumn } from '../components/gridUtil';
import { fnOrVar, isNotEmpty, sanitiseFileName, wait } from '../utils/util';
import { AutoSizeColumnsProps, AutoSizeColumnsResult, GridContext, GridFilterExternal } from './GridContext';
import { GridUpdatingContext } from './GridUpdatingContext';

/**
 * Context for AgGrid operations.
 * Make sure you wrap AgGrid in this.
 * Also, make sure the provider is created in a separate component, otherwise it won't be found.
 */
export const GridContextProvider = <TData extends GridBaseRow>(props: PropsWithChildren): ReactElement => {
  const { modifyUpdating, anyUpdating } = useContext(GridUpdatingContext);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridReady, setGridReady] = useState(false);
  const [quickFilter, _setQuickFilter] = useState('');
  const [invisibleColumnIds, _setInvisibleColumnIds] = useState<string[]>();
  const testId = useRef<string | undefined>();
  const hasExternallySelectedItemsRef = useRef(false);
  const idsBeforeUpdate = useRef<number[]>([]);
  const prePopupFocusedCell = useRef<CellPosition>();
  const [externallySelectedItemsAreInSync, setExternallySelectedItemsAreInSync] = useState(false);
  const externalFilters = useRef<GridFilterExternal<TData>[]>([]);

  const setQuickFilter = useCallback(
    (filter: string) => {
      // If we don't clear the focused cell focus switches back to grid when typing in the quick filter input
      gridApi?.clearFocusedCell();
      _setQuickFilter(filter);
    },
    [gridApi],
  );

  /**
   * Make extra sure the GridCellFillerColId never gets added to invisibleColumnIds as it's dynamically determined
   */
  const setInvisibleColumnIds = useCallback(
    (invisibleColumnIds: string[]) => _setInvisibleColumnIds(pull(invisibleColumnIds, GridCellFillerColId)),
    [],
  );

  /**
   * Set quick filter directly on grid, based on previously save quickFilter state.
   */
  useEffect(() => {
    gridApi?.setGridOption('quickFilterText', quickFilter);
  }, [gridApi, quickFilter]);

  /**
   * Wraps things that require gridApi in common handling, for when gridApi not present.
   *
   * @param hasApiFn Execute when api is ready.
   * @param noApiFn Execute if api is not ready.
   */
  const gridApiOp = useCallback(
    <T, R>(hasApiFn: (gridApi: GridApi) => T, noApiFn?: () => R): T | R => {
      if (!noApiFn) {
        noApiFn = (() => {}) as () => R;
      }
      return gridApi && !gridApi.isDestroyed() ? hasApiFn(gridApi) : noApiFn();
    },
    [gridApi],
  );

  /**
   * Scroll row into view by Id.
   *
   * @param id Id to scroll into view
   * @return true if row is found, else false
   */
  const ensureRowVisible = useCallback(
    (id: number | string): boolean => {
      if (!gridApi) return false;
      const node = gridApi.getRowNode(`${id}`);
      if (!node) return false;
      defer(() => !gridApi.isDestroyed() && gridApi.ensureNodeVisible(node));
      return true;
    },
    [gridApi],
  );

  const getFirstRowId = useCallback((): number => {
    let id = 0;
    try {
      gridApi?.forEachNodeAfterFilterAndSort((rowNode) => {
        id = parseInt(rowNode.id ?? '0');
        // this is the only way to get out of the loop
        throw 'expected exception - exit_loop';
      });
    } catch (ex) {
      // ignore
    }
    return id;
  }, [gridApi]);

  /**
   * Set the grid api when the grid is ready.
   */
  const setApis = useCallback(
    (gridApi: GridApi | undefined, hasExternallySelectedItems: boolean, dataTestId?: string) => {
      hasExternallySelectedItemsRef.current = hasExternallySelectedItems;
      testId.current = dataTestId;
      setGridApi(gridApi);
      gridApi?.setGridOption('quickFilterText', quickFilter);
      setGridReady(!!gridApi);
    },
    [quickFilter],
  );

  /**
   * Used to check if it's OK to autosize.
   */
  const gridRenderState = useCallback((): null | 'empty' | 'rows-visible' => {
    if (!gridApi) return null;
    if (!gridApi.getDisplayedRowCount()) return 'empty';
    if (!isEmpty(gridApi.getRenderedNodes())) return 'rows-visible';
    // If there are rows to render, but there are no rendered nodes then we should wait
    return null;
  }, [gridApi]);

  /**
   * Expose scrollRowIntoView for playwright tests.
   */
  useEffect(() => {
    const globalSupport = (window as any).__stepAgGrid || ((window as any).__stepAgGrid = { grids: {} });
    if (testId.current) {
      globalSupport.grids[testId.current] = {
        scrollRowIntoViewById: (rowId: number | string) => {
          if (!ensureRowVisible(rowId)) {
            throw `scrollRowIntoView failed on grid '${testId.current}' as row with id: '${rowId}' was not found`;
          }
        },
      };
    }
  }, [ensureRowVisible]);

  /**
   * Before a popup record the currently focused cell.
   */
  const prePopupOps = useCallback(() => {
    if (!gridApi || gridApi.isDestroyed()) {
      return;
    }
    prePopupFocusedCell.current = gridApi.getFocusedCell() ?? undefined;
  }, [gridApi]);

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
  const _getNewNodes = useCallback((): IRowNode[] => {
    return gridApiOp(
      (gridApi) =>
        compact(difference(_getAllRowIds(), idsBeforeUpdate.current).map((rowId) => gridApi.getRowNode('' + rowId))),
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
    (rowIds: number[]): IRowNode[] => {
      return gridApiOp(
        (gridApi) => compact(rowIds.map((rowId) => gridApi.getRowNode('' + rowId))),
        () => [] as RowNode[],
      );
    },
    [gridApiOp],
  );

  /**
   * Get ColDefs, with flattened ColGroupDefs
   */
  const getColumns = useCallback(
    (
      filterDef: keyof ColDef | ((r: ColDef) => boolean | undefined | null | number | string) = () => true,
    ): ColDefT<TData>[] =>
      filter(gridApi?.getColumns()?.map((col) => col.getColDef()) ?? [], filterDef) as ColDefT<TData>[],
    [gridApi],
  );

  const getColumnIds = useCallback(
    (filterDef: keyof ColDef | ((r: ColDef) => boolean | undefined | null | number | string) = () => true): string[] =>
      compact(getColumns(filterDef).map(getColId)),
    [getColumns],
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
      {
        rowIds,
        select,
        flash,
        ifNoCellFocused = false,
        retryCount = 15,
      }: {
        rowIds: number[] | undefined;
        select: boolean;
        flash: boolean;
        ifNoCellFocused?: boolean;
        retryCount?: number;
      }, // We retry for approximately 5x200ms=1s
    ) => {
      return gridApiOp((gridApi) => {
        const rowNodes = rowIds ? _rowIdsToNodes(rowIds) : _getNewNodes();
        const gridRowIdsNotUpdatedYet = rowIds && rowNodes.length !== rowIds.length; // rowIds are specified
        const gridRowIdsNotChangedYet = !rowIds && isEmpty(rowNodes); // rowIds are from beforeUpdate
        const gridHasNotUpdated = gridRowIdsNotUpdatedYet || gridRowIdsNotChangedYet;
        // After retry count expires we give-up and deselect all rows, then select any subset of rows that have updated
        if (gridHasNotUpdated && retryCount > 0) {
          delay(
            () =>
              _selectRowsWithOptionalFlash({
                rowIds,
                select,
                flash,
                ifNoCellFocused,
                retryCount: retryCount - 1,
              }),
            250,
          );
          return;
        }

        const rowsThatNeedSelecting = sortBy(
          rowNodes.filter((node) => !node.isSelected()),
          (node) => node.data.id,
        );
        const firstNode = rowsThatNeedSelecting[0];
        if (firstNode) {
          defer(() => !gridApi.isDestroyed() && gridApi.ensureNodeVisible(firstNode));
          const colDefs = getColumns();
          if (!isEmpty(colDefs)) {
            const col = colDefs[0];
            const rowIndex = firstNode.rowIndex;
            if (rowIndex != null && col != null) {
              const colId = col.colId;
              // We need to make sure we aren't currently editing a cell otherwise tests will fail
              // as they will start to edit the cell before this stuff has a chance to run
              colId &&
                delay(() => {
                  if (
                    !gridApi.isDestroyed() &&
                    isEmpty(gridApi.getEditingCells()) &&
                    (!ifNoCellFocused || gridApi.getFocusedCell() == null)
                  ) {
                    gridApi.setFocusedCell(rowIndex, colId);
                    // It may be that the first cell is the selection cell, this doesn't exist as a colDef
                    // so instead, I just try and select it.  If it doesn't exist selection will stay on the
                    // previously focused cell
                    gridApi.setFocusedCell(rowIndex, 'ag-Grid-SelectionColumn');
                  }
                }, 100);
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
              !gridApi.isDestroyed && gridApi.flashCells({ rowNodes });
            } catch {
              // ignore, flash cells sometimes throws errors as nodes have gone out of scope
            }
          }, 250);
        }
      });
    },
    [_getNewNodes, _rowIdsToNodes, getColumns, gridApiOp],
  );

  const selectRowsById = useCallback(
    (rowIds?: number[]) => _selectRowsWithOptionalFlash({ rowIds, select: true, flash: false }),
    [_selectRowsWithOptionalFlash],
  );

  const selectRowsByIdWithFlash = useCallback(
    (rowIds?: number[]) => _selectRowsWithOptionalFlash({ rowIds, select: true, flash: true }),
    [_selectRowsWithOptionalFlash],
  );

  const flashRows = useCallback(
    (rowIds?: number[]) => _selectRowsWithOptionalFlash({ rowIds, select: false, flash: true }),
    [_selectRowsWithOptionalFlash],
  );

  const selectRowsDiff = useCallback(
    async (fn: () => Promise<any>) => {
      beforeUpdate();
      await fn();
      _selectRowsWithOptionalFlash({ rowIds: undefined, select: true, flash: false });
    },
    [_selectRowsWithOptionalFlash, beforeUpdate],
  );

  const selectRowsWithFlashDiff = useCallback(
    async (fn: () => Promise<any>) => {
      beforeUpdate();
      await fn();
      _selectRowsWithOptionalFlash({ rowIds: undefined, select: true, flash: true });
    },
    [_selectRowsWithOptionalFlash, beforeUpdate],
  );

  const flashRowsDiff = useCallback(
    async (fn: () => Promise<any>) => {
      beforeUpdate();
      await fn();
      _selectRowsWithOptionalFlash({ rowIds: undefined, select: false, flash: true });
    },
    [_selectRowsWithOptionalFlash, beforeUpdate],
  );

  const focusByRowById = useCallback(
    (rowId: number, ifNoCellFocused?: boolean) =>
      _selectRowsWithOptionalFlash({ rowIds: [rowId], select: false, flash: false, ifNoCellFocused }),
    [_selectRowsWithOptionalFlash],
  );

  const getSelectedRows = useCallback(<T,>(): T[] => {
    return gridApiOp(
      (gridApi) => gridApi.getSelectedRows(),
      () => [],
    );
  }, [gridApiOp]);

  const getFilteredSelectedRows = useCallback(<T,>(): T[] => {
    return gridApiOp((gridApi) => {
      const rowData: T[] = [];
      gridApi.forEachNodeAfterFilter((node) => {
        if (node.isSelected()) rowData.push(node.data);
      });
      return rowData;
    });
  }, [gridApiOp]);

  const getSelectedRowIds = useCallback(
    (): number[] => getSelectedRows().map((row) => (row as any).id as number),
    [getSelectedRows],
  );

  const getFilteredSelectedRowIds = useCallback(
    (): number[] => getFilteredSelectedRows().map((row) => (row as any).id as number),
    [getFilteredSelectedRows],
  );

  const editingCells = useCallback((): boolean => {
    return gridApiOp(
      (gridApi) => isNotEmpty(gridApi.getEditingCells()),
      () => false,
    );
  }, [gridApiOp]);

  /**
   * Scroll last selected row into view on grid sort change
   */
  const ensureSelectedRowIsVisible = useCallback((): void => {
    gridApiOp((gridApi) => {
      const selectedNodes = gridApi.getSelectedNodes();
      if (isEmpty(selectedNodes)) return;
      defer(() => !gridApi.isDestroyed() && gridApi.ensureNodeVisible(last(selectedNodes)));
    });
  }, [gridApiOp]);

  /**
   * Resize columns to fit container
   */
  const autoSizeColumns = useCallback(
    ({ skipHeader, colIds, userSizedColIds, includeFlex }: AutoSizeColumnsProps = {}): AutoSizeColumnsResult => {
      if (!gridApi || !gridApi.getColumnState()) return null;
      const colIdsSet = colIds instanceof Set ? colIds : new Set(colIds);
      const colsToResize = gridApi.getColumnState()?.filter?.((colState) => {
        const colId = colState.colId;
        return (
          (isEmpty(colIdsSet) || colIdsSet.has(colId)) &&
          !userSizedColIds?.has(colId) &&
          (includeFlex || !colState.flex)
        );
      });
      if (!isEmpty(colsToResize)) {
        gridApi.autoSizeColumns(
          colsToResize.map((colState) => colState.colId),
          skipHeader,
        );
      }
      return {
        width: sumBy(
          gridApi.getColumnState().filter((col) => !col.hide),
          'width',
        ),
      };
    },
    [gridApi],
  );

  /**
   * Resize columns to fit container
   */
  const sizeColumnsToFit = useCallback((): void => {
    if (gridApi && !gridApi?.isDestroyed()) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi]);

  /**
   *
   */
  const resetFocusedCellAfterCellEditing = useCallback((): void => {
    if (!gridApi || gridApi.isDestroyed() || startCellEditingInProgressRef.current) {
      return;
    }
    if (prePopupFocusedCell.current) {
      gridApi.setFocusedCell(prePopupFocusedCell.current.rowIndex, prePopupFocusedCell.current.column);
      prePopupFocusedCell.current = undefined;
    }
  }, [gridApi]);

  // waitForExternallySelectedItemsToBeInSync can't use the state as it won't be updated during function execution
  const externallySelectedItemsAreInSyncRef = useRef(false);
  useEffect(() => {
    externallySelectedItemsAreInSyncRef.current = externallySelectedItemsAreInSync;
  }, [externallySelectedItemsAreInSync]);

  const waitForExternallySelectedItemsToBeInSync = useCallback(async () => {
    if (!hasExternallySelectedItemsRef.current) {
      externallySelectedItemsAreInSyncRef.current = true;
      return;
    }
    // Wait for up to 5 seconds
    for (let i = 0; i < 5000 / 200 && !externallySelectedItemsAreInSyncRef.current; i++) {
      await wait(200);
    }
    if (!externallySelectedItemsAreInSyncRef.current) {
      console.error('externallySelectedItems did not sync with ag-grid selection');
    }
  }, []);

  const startCellEditingInProgressRef = useRef(false);
  const startCellEditing = useCallback(
    async ({ rowId, colId }: { rowId: number; colId: string }) => {
      if (!gridApi || startCellEditingInProgressRef.current) {
        return;
      }
      startCellEditingInProgressRef.current = true;

      try {
        // Edit in progress so don't edit until finished, timeout waiting after 5s
        if (!(await waitForCondition(() => !anyUpdating(), 5000))) {
          console.error("Could not start edit because previous edit hasn't finished after 5 seconds");
          return;
        }

        const colDef = gridApi.getColumnDef(colId);
        if (!colDef) {
          return;
        }

        const rowNode = gridApi.getRowNode(`${rowId}`);
        if (!rowNode) {
          return;
        }

        prePopupOps();
        const shouldSelectNode = !rowNode.isSelected();
        if (shouldSelectNode) {
          externallySelectedItemsAreInSyncRef.current = false;
          setExternallySelectedItemsAreInSync(false);
          rowNode.setSelected(true, true);
          await waitForExternallySelectedItemsToBeInSync();
        }

        const rowIndex = rowNode.rowIndex;
        if (rowIndex != null) {
          defer(() => {
            !gridApi.isDestroyed() &&
              gridApi.startEditingCell({
                rowIndex,
                colKey: colId,
              });
          });
        }
      } finally {
        startCellEditingInProgressRef.current = false;
      }
    },
    [anyUpdating, gridApi, prePopupOps, waitForExternallySelectedItemsToBeInSync],
  );

  const bulkEditingCompleteCallbackRef = useRef<() => void>();
  const onBulkEditingComplete = useCallback(() => {
    resetFocusedCellAfterCellEditing();
    bulkEditingCompleteCallbackRef.current?.();
  }, [resetFocusedCellAfterCellEditing]);

  const setOnBulkEditingComplete = useCallback((cellEditingCompleteCallback: (() => void) | undefined) => {
    bulkEditingCompleteCallbackRef.current = cellEditingCompleteCallback;
  }, []);

  /**
   * Returns true if an editable cell on same row was selected, else false.
   */
  const selectNextEditableCell = useCallback(
    async (tabDirection: -1 | 1): Promise<boolean> => {
      // Pretend it succeeded to prevent unwanted cellEditingCompleteCallback
      if (!gridApi) {
        return true;
      }

      const focusedCellIsEditable = () => {
        const focusedCell = gridApi.isDestroyed() ? null : gridApi.getFocusedCell();
        const nextColumn = focusedCell?.column;
        const nextColDef = nextColumn?.getColDef();
        const rowNode = focusedCell && gridApi.getDisplayedRowAtIndex(focusedCell?.rowIndex);
        return (
          !!(rowNode && nextColumn && nextColDef) &&
          nextColumn.isCellEditable(rowNode) &&
          !nextColDef.cellEditorParams?.preventAutoEdit &&
          !nextColDef.cellRendererParams?.editAction
        );
      };

      // Just in case I've missed something, we don't want the loop to hang everything
      for (let maxIterations = 0; maxIterations < 50; maxIterations++) {
        if (gridApi.isDestroyed()) {
          return true;
        }
        // Prevent resetting focus to original editing cell
        prePopupFocusedCell.current = undefined;

        const preRow = gridApi.getFocusedCell();
        if (tabDirection === 1) {
          gridApi.stopEditing();
          gridApi.tabToNextCell();
        } else {
          gridApi.tabToPreviousCell();
        }

        if (gridApi.isDestroyed()) {
          return true;
        }
        const postRow = gridApi.getFocusedCell();
        if (preRow?.rowIndex !== postRow?.rowIndex || preRow?.column === postRow?.column) {
          // We didn't find an editable cell in the same row, or the cell column didn't change
          // implying it was start/end of grid
          break;
        }

        if (focusedCellIsEditable()) {
          const focusedCell = gridApi.getFocusedCell();
          if (focusedCell) {
            const rowNode = gridApi.getDisplayedRowAtIndex(focusedCell.rowIndex);
            const rowId = rowNode?.data?.id;
            if (rowId == null) {
              return false;
            }
            await startCellEditing({ rowId, colId: focusedCell.column.getColId() });
            return true;
          }
        }
      }
      return false;
    },
    [gridApi, startCellEditing],
  );

  const updatingCells = useCallback(
    async (
      props: { selectedRows: GridBaseRow[]; field?: string },
      fnUpdate: (selectedRows: any[]) => Promise<boolean>,
      setSaving?: (saving: boolean) => void,
      tabDirection?: 1 | 0 | -1,
    ): Promise<boolean> => {
      try {
        setSaving?.(true);
        return await gridApiOp(async (gridApi) => {
          const selectedRows = props.selectedRows;

          let ok = false;

          await modifyUpdating(
            props.field ?? '',
            selectedRows.map((data) => data.id),
            async () => {
              // MATT Disabled I don't believe these are needed anymore
              // I've left them here just in case they are
              // Need to refresh to get spinners to work on all rows
              // gridApi.refreshCells({ rowNodes: props.selectedRows as RowNode[], force: true });
              ok = await fnUpdate(selectedRows).catch((ex) => {
                console.error('Exception during modifyUpdating', ex);
                return false;
              });
            },
          );

          // MATT Disabled I don't believe these are needed anymore
          // I've left them here just in case they are
          // async processes need to refresh their own rows
          // gridApi.refreshCells({ rowNodes: selectedRows as RowNode[], force: true });

          if (gridApi.isDestroyed()) {
            return ok;
          }

          if (ok) {
            const cell = gridApi.getFocusedCell();
            if (cell && gridApi.getFocusedCell() == null) {
              !gridApi.isDestroyed && gridApi.setFocusedCell(cell.rowIndex, cell.column);
            }

            // This is needed to trigger postSortRowsHook
            gridApi.refreshClientSideRowModel();
          }

          void (async () => {
            // Only focus next cell if user hasn't already manually changed focus
            const postPopupFocusedCell = gridApi.getFocusedCell();
            if (
              prePopupFocusedCell.current &&
              postPopupFocusedCell &&
              prePopupFocusedCell.current.rowIndex == postPopupFocusedCell.rowIndex &&
              prePopupFocusedCell.current.column.getColId() == postPopupFocusedCell.column.getColId()
            ) {
              if (!tabDirection || !(await selectNextEditableCell(tabDirection))) {
                onBulkEditingComplete();
              }
            } else {
              onBulkEditingComplete();
            }
          })();

          return ok;
        });
      } finally {
        setSaving?.(false);
      }
    },
    [gridApiOp, modifyUpdating, onBulkEditingComplete, selectNextEditableCell],
  );

  const redrawRows: any = useMemo(
    () =>
      debounce((rowNodes?: IRowNode[]) => {
        try {
          gridApi && gridApi.redrawRows(rowNodes ? { rowNodes } : undefined);
        } catch (ex) {
          console.error(ex);
        }
      }, 50),
    [gridApi],
  );

  const onFilterChanged = useMemo(
    () =>
      debounce(() => {
        if (!gridApi || gridApi?.isDestroyed()) {
          return;
        }
        // This is terrible, but there's no other way for me to check whether a filter has changed the grid
        const getDisplayedRowsHash = () => {
          const arr: any[] = [];
          gridApi?.forEachNodeAfterFilter((rowNode) => {
            arr.push(rowNode.id);
          });
          return arr.join('|');
        };

        if (gridApi) {
          const hasFocusedCell = gridApi.getFocusedCell();
          const preHash = hasFocusedCell && getDisplayedRowsHash();
          gridApi.onFilterChanged();
          const postHash = hasFocusedCell && getDisplayedRowsHash();
          // Ag-grid has a bug where if a focused cell comes into view after a filter the filter loses focus
          // So the focus is cleared to prevent this
          preHash !== postHash && gridApi.clearFocusedCell();
        }
      }, 200),
    [gridApi],
  );

  const addExternalFilter = useCallback(
    (filter: GridFilterExternal<TData>) => {
      externalFilters.current.push(filter);
      void onFilterChanged();
    },
    [onFilterChanged],
  );

  const removeExternalFilter = useCallback(
    (filter: GridFilterExternal<TData>) => {
      remove(externalFilters.current, (v) => v === filter);
      void onFilterChanged();
    },
    [onFilterChanged],
  );

  const isExternalFilterPresent = useCallback((): boolean => !isEmpty(externalFilters.current), []);

  const doesExternalFilterPass = useCallback(
    (node: IRowNode): boolean => externalFilters.current.every((filter) => filter(node.data, node)),
    [],
  );

  const getColDef = useCallback(
    (colId?: string): ColDef | undefined => (!!colId && gridApi?.getColumnDef(colId)) || undefined,
    [gridApi],
  );

  const showNoRowsOverlay = useCallback((): void => {
    gridApi?.showNoRowsOverlay();
  }, [gridApi]);

  /**
   * Apply column visibility
   */
  useEffect(() => {
    if (!gridApi || !invisibleColumnIds) return;

    // show all columns that aren't invisible
    const newVisibleColumns = getColumns(
      (col) => !col.lockVisible && col.colId && !invisibleColumnIds.includes(col.colId) && !isGridCellFiller(col),
    );
    // If there's no flex column showing add the filler column if defined
    const visibleColumnsContainsAFlex = newVisibleColumns.some(isFlexColumn);
    if (!visibleColumnsContainsAFlex) {
      const fillerColumn = getColumns(isGridCellFiller)[0];
      fillerColumn && newVisibleColumns.push(fillerColumn);
    }
    gridApi.setColumnsVisible(compact(newVisibleColumns.map(getColId)), true);

    // Hide the filler column if there's already a flex column
    const invisibleColumnIdsWithOptionalFiller = visibleColumnsContainsAFlex
      ? [...invisibleColumnIds, GridCellFillerColId]
      : invisibleColumnIds;
    gridApi.setColumnsVisible(invisibleColumnIdsWithOptionalFiller, false);
  }, [invisibleColumnIds, getColumns, gridApi]);

  /**
   * Download visible columns as a CSV
   */
  const downloadCsv = useCallback(
    (csvExportParams?: CsvExportParams) => {
      if (!gridApi) return;

      const fileName = csvExportParams?.fileName && sanitiseFileName(fnOrVar(csvExportParams.fileName));

      const columnKeys = gridApi
        .getColumnState()
        .filter((cs) => {
          const colDef = gridApi.getColumnDef(cs.colId);
          return !cs.hide && colDef && !isGridCellFiller(colDef) && colDef.headerComponentParams?.exportable !== false;
        })
        .map((cs) => cs.colId);
      gridApi.exportDataAsCsv({
        columnKeys,
        processCellCallback: downloadCsvUseValueFormattersProcessCellCallback,
        ...csvExportParams,
        fileName,
      });
    },
    [gridApi],
  );

  return (
    <GridContext.Provider
      value={{
        gridRenderState,
        getColDef,
        getColumns,
        getColumnIds,
        invisibleColumnIds,
        setInvisibleColumnIds,
        gridReady,
        prePopupOps,
        setApis,
        setQuickFilter,
        selectRowsById,
        selectRowsDiff,
        selectRowsByIdWithFlash,
        selectRowsWithFlashDiff,
        flashRows,
        flashRowsDiff,
        focusByRowById,
        getSelectedRows,
        getFilteredSelectedRows,
        getSelectedRowIds,
        getFilteredSelectedRowIds,
        getFirstRowId,
        editingCells,
        ensureRowVisible,
        ensureSelectedRowIsVisible,
        sizeColumnsToFit,
        autoSizeColumns,
        startCellEditing,
        resetFocusedCellAfterCellEditing,
        updatingCells,
        redrawRows,
        externallySelectedItemsAreInSync,
        setExternallySelectedItemsAreInSync,
        waitForExternallySelectedItemsToBeInSync,
        addExternalFilter,
        removeExternalFilter,
        isExternalFilterPresent,
        doesExternalFilterPass,
        downloadCsv,
        onBulkEditingComplete,
        setOnBulkEditingComplete,
        showNoRowsOverlay,
      }}
    >
      {props.children}
    </GridContext.Provider>
  );
};

/**
 * Aggrid defaults to using getters and ignores formatters.
 * step-ag-grid by default has a valueFormatter for every column that defaults to the getter if no valueFormatter
 * This function uses valueFormatter by default
 */
export const downloadCsvUseValueFormattersProcessCellCallback = (params: ProcessCellForExportParams): string => {
  const encodeToString = (value: any): string => {
    // Convert nullish values to blank
    if (value === '-' || value === '–' || value == null) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value);
  };

  // Try to use valueFormatter
  const colDef = params?.column?.getColDef();
  if (!colDef) return encodeToString(params.value);

  // All columns in step-ag-grid have a default valueFormatter
  // If you have custom a renderer you need to define your own valueFormatter to produce the text value
  const valueFormatter = colDef.valueFormatter;
  // If no valueFormatter then value _must_ be a string
  if (valueFormatter == null) {
    if (params.value != null && typeof params.value !== 'string') {
      console.error(`downloadCsv: valueFormatter missing and getValue is not a string, colId: ${colDef.colId}`);
    }
    return encodeToString(params.value);
  }

  // We don't have access to registered functions, so we can't call them
  if (typeof valueFormatter !== 'function') {
    console.error(
      `downloadCsv: String type (registered) value formatters are unsupported in downloadCsv, colId: ${colDef.colId}`,
    );
    return encodeToString(params.value);
  }

  const result = valueFormatter({ ...params, data: params.node?.data, colDef, node: null });
  // type may not be string due to casting, leave the type check in
  if (params.value != null && typeof result !== 'string') {
    console.error(`downloadCsv: valueFormatter is returning non string values, colDef:", colId: ${colDef.colId}`);
  }
  // We add an extra encodeToString here just in case valueFormatter is returning non string values
  return encodeToString(result);
};

const waitForCondition = async (condition: () => boolean, timeoutMs: number): Promise<boolean> => {
  const endTime = Date.now() + timeoutMs;
  while (Date.now() < endTime) {
    if (condition()) {
      return true;
    }
    await wait(100);
  }
  console.warn('waitForCondition failed');
  return false;
};
