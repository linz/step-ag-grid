import { IRowNode } from "ag-grid-community";
import { ColumnState } from "ag-grid-community";
import { PostSortRowsParams } from "ag-grid-community";
import { isEmpty } from "lodash-es";
import { useCallback, useContext, useRef } from "react";

import { GridContext } from "../contexts/GridContext";

interface PostSortRowsHookProps {
  setStaleGrid: (stale: boolean) => void;
}

/**
 * Retains last sort order from via <AgGrid postRowSort>.
 * Then applies this sort until next sort column change.
 * Handles stale sort, when you edit a row but don't want to re-sort.
 */
export const usePostSortRowsHook = ({ setStaleGrid }: PostSortRowsHookProps) => {
  const { redrawRows } = useContext(GridContext);

  // On first run we need to init the first backed up sort order
  const initialised = useRef(false);

  // Used to detect sort order has changed since last run
  const lastSortOrderHash = useRef<string>("");

  // Used to detect if sort order was the same, has the direction changed
  const previousRowSortIndexRef = useRef<Record<string, { index: number; hash: string } | undefined>>({});

  // stale sort is when there's a sort and user edits a row
  // this applies a class to the div wrapping the grid which in turn adds a * beside the sort arrow
  const sortWasStale = useRef(false);

  // Previous col sort is stored and reapplied if the sort direction changes on the same column and the sort was stale
  // As a sort on a stale row should just resort, not change sort direction
  const previousColSort = useRef<ColumnState[]>([]);

  const previousQuickFilter = useRef("");

  return useCallback(
    ({ api, nodes }: PostSortRowsParams) => {
      // Grid is destroyed
      if (!api) return;

      const previousRowSortIndex = previousRowSortIndexRef.current;

      const hashNode = (node: IRowNode | undefined) => {
        return node ? JSON.stringify(node.data) : "";
      };

      const copyCurrentSortSettings = (): ColumnState[] =>
        api.getColumnState().map((row) => ({ colId: row.colId, sort: row.sort, sortIndex: row.sortIndex }));

      const backupSortOrder = () => {
        for (const x in previousRowSortIndex) delete previousRowSortIndex[x];
        nodes.forEach((node, index) => (previousRowSortIndex[`${node.data.id}`] = { index, hash: hashNode(node) }));
      };

      // Check if column is the first sorted column.  Note: column is preconfigured to sort its sortIndex is null not 1
      const isFirstSortColumn = (row: ColumnState) => row.sort && [0, null].includes(row.sortIndex ?? null);

      const isSameColumnAndDifferentSort = (col1: ColumnState | undefined, col2: ColumnState | undefined) =>
        col1 && col2 && col1.colId === col2.colId && col1.sort != col2.sort;

      const restorePreviousSortColumnState = () => api.applyColumnState({ state: previousColSort.current });

      const sortNodesByPreviousSort = () => {
        nodes.sort(
          (a, b) =>
            (previousRowSortIndex[`${a.data.id}`]?.index ?? Number.MAX_SAFE_INTEGER) -
            (previousRowSortIndex[`${b.data.id}`]?.index ?? Number.MAX_SAFE_INTEGER),
        );
      };

      // On first load copy the current sort
      if (!initialised.current) {
        initialised.current = true;
        previousColSort.current = copyCurrentSortSettings();
      }

      const newSortOrder = JSON.stringify(copyCurrentSortSettings());
      let sortOrderChanged = newSortOrder != lastSortOrderHash.current;

      const quickFilter = (api as any).filterManager.quickFilter;
      if (previousQuickFilter.current != quickFilter) {
        previousQuickFilter.current = quickFilter;
        sortOrderChanged = true;
      }

      if (isEmpty(previousRowSortIndex)) {
        backupSortOrder();
      }

      if (sortOrderChanged) {
        const thisFirstCol = copyCurrentSortSettings().find(isFirstSortColumn);
        const previousFirstCol = previousColSort.current.find(isFirstSortColumn);

        // Change to sort can be: (in the context of stale sort do...)
        // - no sort to sorted (do nothing)
        // - asc to desc       (resort as asc, and remove stale sort)
        // - desc to no sort   (resort as desc, and remove stale sort)
        const wasSortChangedOnSameColumn =
          previousFirstCol && (!thisFirstCol || isSameColumnAndDifferentSort(previousFirstCol, thisFirstCol));

        // if sort was stale, and we're here, someone has clicked a stale sort order (^*) in the column header
        if (sortWasStale.current && wasSortChangedOnSameColumn) {
          // Sort was an existing priority 1 column
          // We want to re-sort with the old sort direction and clear stale sort
          sortWasStale.current = false;
          setStaleGrid(false);

          // trigger a recapture of sort order
          lastSortOrderHash.current = "";
          restorePreviousSortColumnState();
        } else {
          // Sort was on a different column so clear sort and sort like normal
          if (sortWasStale.current) {
            sortWasStale.current = false;
            setStaleGrid(false);
          }
          // Columns were sorted so retain the sort
          backupSortOrder();
          lastSortOrderHash.current = newSortOrder;
        }
      } else {
        let firstChangedNodeIndex = -1;
        let lastNewNode: IRowNode | undefined = undefined;
        let changedRowCount = 0;
        let newRowCount = 0;
        let index = 0;
        for (const node of nodes) {
          const psr = previousRowSortIndex[`${node.data.id}`];
          if (psr) {
            if (psr.hash != hashNode(node)) {
              if (firstChangedNodeIndex === -1) firstChangedNodeIndex = index;
              changedRowCount++;
            }
          } else {
            lastNewNode = node;
            newRowCount++;
          }
          index++;
        }

        let wasStale = false;
        if (changedRowCount === 0 && newRowCount === 1) {
          // insert new row at end
          const newIndex = index - 1;
          previousRowSortIndex[`${lastNewNode?.data.id}`] = { index: newIndex, hash: hashNode(lastNewNode) };
          wasStale = true;
        } else if (changedRowCount === 2 && newRowCount === 0) {
          // This must be a swap rows
          // backupSortOrder();
          wasStale = false;
        } else if (changedRowCount > 1 && newRowCount === 1) {
          // This must be a insert so, insert new row near the row that changed
          previousRowSortIndex[`${lastNewNode?.data.id}`] = {
            index: firstChangedNodeIndex + 0.5,
            hash: hashNode(lastNewNode),
          };
          wasStale = true;
          // For some reason AgGrid mis-positions the inserted row.
          lastNewNode && redrawRows();
        } else if (changedRowCount == 1 && newRowCount === 0) {
          // User edited one row so, do nothing, retain sort
          wasStale = true;
        } else if (changedRowCount !== 0 || newRowCount != 0) {
          // too many rows changed, resort
          backupSortOrder();
        }

        if (wasStale) {
          // Check if the sort order the aggrid passed matches our stale sort order
          const stillStale =
            Object.keys(previousRowSortIndex).length != nodes.length ||
            nodes.some((node, index) => previousRowSortIndex[`${node.data.id}`]?.index !== index);

          // If we haven't already processed a stale sort then...
          if (stillStale && !sortWasStale.current) {
            // backup sort state, so we can restore it when sort is clicked on a stale column
            previousColSort.current = copyCurrentSortSettings();
            sortWasStale.current = true;
            setStaleGrid(true);
          }
        }
        sortNodesByPreviousSort();
      }
    },
    [redrawRows, setStaleGrid],
  );
};
