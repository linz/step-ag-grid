import { CellMouseDownEvent, CellMouseOverEvent, IRowNode } from 'ag-grid-community';
import { MutableRefObject, RefObject, useCallback, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { GridBaseRow } from '../types';

export interface CellLocation {
  rowId: string;
  colId: string;
  timestamp: number;
}

export interface GridRanges<TData extends GridBaseRow> {
  selectedColIds: string[];
  selectedNodes: IRowNode<TData>[];
}

export const useGridRangeSelection = <TData extends GridBaseRow>({
  enableRangeSelection,
  gridDivRef,
  rangeStartRef,
  rangeEndRef,
  hasSelectedMoreThanOneCellRef,
  rangeSortedNodesRef,
}: {
  enableRangeSelection: boolean;
  gridDivRef: RefObject<HTMLDivElement>;
  rangeStartRef: MutableRefObject<CellLocation | null>;
  rangeEndRef: MutableRefObject<CellLocation | null>;
  hasSelectedMoreThanOneCellRef: MutableRefObject<boolean>;
  rangeSortedNodesRef: MutableRefObject<IRowNode<TData>[] | null>;
}) => {
  const [refreshIntervalEnabled, setRefreshIntervalEnabled] = useState(false);

  const ranges = useCallback((): GridRanges<TData> => {
    const gridElement = gridDivRef.current!;
    const rangeStart = rangeStartRef.current!;
    const rangeEnd = rangeEndRef.current!;
    const rangeSortedNodes = rangeSortedNodesRef.current!;
    if (!gridElement || !rangeStart || !rangeEnd || !rangeSortedNodes) {
      return {
        selectedColIds: [],
        selectedNodes: [],
      };
    }

    const elStyleLeftComparator = (el1: Element, el2: Element) => elStyleLeft(el1) - elStyleLeft(el2);
    const elStyleLeft = (el: Element): number => parseFloat((el as HTMLElement).style.left) ?? 0;

    const getSortedColIds = (): string[] => {
      //
      const leftHeaders = [...gridElement.querySelectorAll('.ag-pinned-left-header .ag-header-cell')].sort(
        elStyleLeftComparator,
      );
      const centerHeaders = [...gridElement.querySelectorAll('.ag-header-viewport .ag-header-cell')].sort(
        elStyleLeftComparator,
      );
      const rightHeaders = [...gridElement.querySelectorAll('.ag-pinned-right-header .ag-header-cell')].sort(
        elStyleLeftComparator,
      );

      return [...leftHeaders, ...centerHeaders, ...rightHeaders].map((el, i) => el.getAttribute('col-id') ?? String(i));
    };

    const sortedColIds = getSortedColIds();

    const startColIndex = sortedColIds.indexOf(rangeStart.colId);
    const endColIndex = sortedColIds.indexOf(rangeEnd.colId);
    const selectedColIds = sortedColIds.slice(
      Math.min(startColIndex, endColIndex),
      Math.max(startColIndex, endColIndex) + 1,
    );

    const startRowIndex = rangeSortedNodes.findIndex((node) => node.data!.id === rangeStart.rowId);
    const endRowIndex = rangeSortedNodes.findIndex((node) => node.data!.id === rangeEnd.rowId);
    const selectedNodes = rangeSortedNodes.slice(
      Math.min(startRowIndex, endRowIndex),
      Math.max(startRowIndex, endRowIndex) + 1,
    );

    return { selectedColIds, selectedNodes };
  }, []);

  const redrawSelectedRanges = useCallback(() => {
    const gridElement = gridDivRef.current!;
    const { selectedColIds, selectedNodes } = ranges();

    selectedColIds.forEach((colId, colIndex) => {
      selectedNodes.forEach((node, rowIndex) => {
        const rowId = node.data!.id;
        const cell = gridElement.querySelector(
          `.ag-row[row-id=${JSON.stringify(String(rowId))}] .ag-cell[col-id=${JSON.stringify(colId)}`,
        );
        cell?.classList.add('rangeSelect');
        if (colIndex === 0) {
          cell?.classList.add('rangeSelectLeft');
        }
        if (colIndex === selectedColIds.length - 1) {
          cell?.classList.add('rangeSelectRight');
        }
        if (rowIndex === 0) {
          cell?.classList.add('rangeSelectTop');
        }
        if (rowIndex === selectedNodes.length - 1) {
          cell?.classList.add('rangeSelectBottom');
        }
      });
    });
  }, []);

  const updateRangeSelectionCellClasses = useCallback(
    (justRefresh?: boolean) => {
      //
      // Get all grid cols, sort by pinned, then style: left
      const gridElement = gridDivRef.current;
      if (!gridElement) {
        return;
      }

      // Clear all selections
      if (!justRefresh) {
        gridElement
          .querySelectorAll('.rangeSelect,.rangeSelectLeft,.rangeSelectTop,.rangeSelectRight,.rangeSelectBottom')
          .forEach((el) => {
            el.classList.remove(
              'rangeSelect',
              'rangeSelectLeft',
              'rangeSelectTop',
              'rangeSelectRight',
              'rangeSelectBottom',
            );
          });
      }

      // if range selection multiple add .Grid-container.rangeSelectingMultiple
      const rangeStart = rangeStartRef.current;
      const rangeEnd = rangeEndRef.current;

      if (
        rangeStart !== null &&
        rangeEnd !== null &&
        (hasSelectedMoreThanOneCellRef.current ||
          rangeStart.colId !== rangeEnd.colId ||
          rangeStart.rowId !== rangeEnd.rowId)
      ) {
        gridElement.classList.add('rangeSelectingMultiple');
        gridElement.querySelectorAll('.ag-cell-focus').forEach((el) => {
          el.classList.remove('ag-cell-focus');
        });
      } else {
        gridElement.classList.remove('rangeSelectingMultiple');
        return;
      }
      const rangeSortedNodes = rangeSortedNodesRef.current;
      if (!rangeSortedNodes) {
        return;
      }

      redrawSelectedRanges();
    },
    [ranges, redrawSelectedRanges],
  );

  // Handle updates after scroll / grid refresh
  useInterval(
    () => {
      updateRangeSelectionCellClasses(true);
    },
    refreshIntervalEnabled ? 150 : null,
  );

  const clearRangeSelection = useCallback(() => {
    hasSelectedMoreThanOneCellRef.current = false;
    setRefreshIntervalEnabled(false);

    hasSelectedMoreThanOneCellRef.current = false;
    rangeStartRef.current = null;
    rangeEndRef.current = null;

    updateRangeSelectionCellClasses();
  }, [updateRangeSelectionCellClasses]);

  const onCellMouseOver = useCallback(
    (e: CellMouseOverEvent, mouseDown?: boolean) => {
      if (!enableRangeSelection) {
        return;
      }
      const button = (e.event as { buttons?: number }).buttons;
      if (button !== 1) {
        // TODO fix this?
        //rangeSortedNodesRef.current = null;
        return;
      }
      rangeEndRef.current = {
        rowId: e.node.data.id,
        colId: e.column.getColId(),
        timestamp: Date.now(),
      };

      if (mouseDown) {
        const sortedNodes: IRowNode<TData>[] = [];
        e.api.forEachNodeAfterFilterAndSort((node: IRowNode<TData>) => sortedNodes.push(node));
        rangeSortedNodesRef.current = sortedNodes;
        setRefreshIntervalEnabled(true);
        rangeStartRef.current = { ...rangeEndRef.current };
      }

      if (
        rangeStartRef.current &&
        rangeEndRef.current &&
        (rangeStartRef.current.rowId !== rangeEndRef.current.rowId ||
          rangeStartRef.current.colId !== rangeEndRef.current.colId)
      ) {
        hasSelectedMoreThanOneCellRef.current = true;
        window.getSelection()?.removeAllRanges();
      }

      updateRangeSelectionCellClasses();
    },
    [enableRangeSelection, updateRangeSelectionCellClasses],
  );

  const onCellMouseDown = useCallback(
    (e: CellMouseDownEvent) => {
      const button = (e.event as { buttons?: number }).buttons;
      if (button === 1) {
        clearRangeSelection();
      }
      onCellMouseOver(e as unknown as CellMouseOverEvent, true);
    },
    [onCellMouseOver],
  );

  return { clearRangeSelection, ranges, onCellMouseDown, onCellMouseOver };
};
