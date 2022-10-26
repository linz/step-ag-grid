import { useCallback, useRef } from "react";
import { PostSortRowsParams } from "ag-grid-community/dist/lib/entities/iCallbackParams";
import { ColumnState } from "ag-grid-community/dist/lib/columns/columnModel";

interface PostSortRowsHookProps {
  setStaleGrid: (stale: boolean) => void;
}

/**
 * Retains last sort order from via <AgGrid postRowSort>.
 * Then applies this sort until next sort column change.
 * Handles stale sort, when you edit a row but don't want to re-sort.
 */
export const usePostSortRowsHook = ({ setStaleGrid }: PostSortRowsHookProps) => {
  // On first run we need to init the first backed up sort order
  const initialised = useRef(false);

  // Used to detect sort order has changed since last run
  const lastSortOrderHash = useRef<string>("");

  // Used to detect if sort order was the same, has the direction changed
  const previousRowSortIndexRef = useRef<Record<number, number | undefined>>({});

  // stale sort is when there's a sort and user edits a row
  // this applies a class to the div wrapping the grid which in turn adds a * beside the sort arrow
  const sortWasStale = useRef(false);

  // Previous col sort is stored and reapplied if the sort direction changes on the same column and the sort was stale
  // As a sort on a stale row should just resort, not change sort direction
  const previousColSort = useRef<ColumnState[]>([]);

  const previousQuickFilter = useRef("");

  return useCallback(
    ({ api, columnApi, nodes }: PostSortRowsParams) => {
      const previousRowSortIndex = previousRowSortIndexRef.current;

      const copyCurrentSortSettings = (): ColumnState[] =>
        columnApi.getColumnState().map((row) => ({ colId: row.colId, sort: row.sort, sortIndex: row.sortIndex }));

      const backupSortOrder = () => {
        for (const x in previousRowSortIndex) delete previousRowSortIndex[x];
        nodes.forEach((row, index) => (previousRowSortIndex[row.data.id] = index));
      };

      // Check if column is the first sorted column.  Note: column is preconfigured to sort its sortIndex is null not 1
      const isFirstSortColumn = (row: ColumnState) => row.sort && [0, null].includes(row.sortIndex ?? null);

      const isSameColumnAndDifferentSort = (col1: ColumnState | undefined, col2: ColumnState | undefined) =>
        col1 && col2 && col1.colId === col2.colId && col1.sort != col2.sort;

      const restorePreviousSortColumnState = () => columnApi.applyColumnState({ state: previousColSort.current });

      const hasNewRows = () => nodes.some((row) => previousRowSortIndex[row.data.id] == null);

      const sortIsStale = () =>
        !hasNewRows() && nodes.some((row, index) => ![null, index].includes(previousRowSortIndex[row.data.id] ?? null));

      const sortNodesByPreviousSort = () =>
        nodes.sort(
          (a, b) =>
            (previousRowSortIndex[a.data.id] ?? Number.MAX_SAFE_INTEGER) -
            (previousRowSortIndex[b.data.id] ?? Number.MAX_SAFE_INTEGER),
        );

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
        if (sortIsStale()) {
          // If we haven't already processed a stale sort then...
          if (!sortWasStale.current) {
            // backup sort state, so we can restore it when sort is clicked on a stale column
            previousColSort.current = copyCurrentSortSettings();
            sortWasStale.current = true;
            setStaleGrid(true);
          }

          sortNodesByPreviousSort();
        }
        // secondary sort backup as there may be new nodes that didn't have their sort registered
        // which would cause two new rows to sort out of sequence
        backupSortOrder();
      }
    },
    [setStaleGrid],
  );
};
