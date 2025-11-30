import { CellContextMenuEvent, IRowNode } from 'ag-grid-community';
import { compact } from 'lodash-es';
import { ClipboardEvent as ReactClipboardEvent, MutableRefObject, useCallback } from 'react';

import { useGridContext } from '../../contexts/GridContext';
import { CopyOptionsContext, GridRangeSelectContextMenu } from '../GridRangeSelectContextMenu';
import { GridBaseRow } from '../types';
import { useGridContextMenu } from './useGridContextMenu';
import { useGridCopySettings } from './useGridCopySettings';
import { CellLocation, GridRanges } from './useGridRangeSelection';

export const useGridCopy = <TData extends GridBaseRow>({
  ranges,
  rangeStartRef,
  rangeEndRef,
  hasSelectedMoreThanOneCellRef,
  cellContextMenu,
}: {
  ranges: () => GridRanges<TData>;
  rangeStartRef: MutableRefObject<CellLocation | null>;
  rangeEndRef: MutableRefObject<CellLocation | null>;
  hasSelectedMoreThanOneCellRef: MutableRefObject<boolean>;
  cellContextMenu: (event: CellContextMenuEvent) => void;
}) => {
  const { getSelectedRowIds } = useGridContext<TData>();
  const { getColDef, getCellValue } = useGridContext<TData>();
  const { copyType, setCopyType } = useGridCopySettings();

  const onCopy = useCallback(
    (type = copyType) => {
      const rangeStart = rangeStartRef.current;
      const rangeEnd = rangeEndRef.current;
      if (rangeStart === null || rangeEnd === null || !hasSelectedMoreThanOneCellRef.current) {
        return;
      }

      if (rangeStart.rowId === rangeEnd.rowId && rangeStart.colId === rangeEnd.colId) {
        type = 'plain_text';
      }

      const json = type === 'json';
      const { selectedColIds, selectedNodes } = ranges();
      const filteredSelectedColIds = selectedColIds.filter((colId) => colId !== 'gridCellFiller');

      const selectedRowIds = getSelectedRowIds();
      const formatters = compact(
        filteredSelectedColIds.map((colKey) => {
          return (rowNode: IRowNode): string | number | boolean | null | undefined => {
            if (colKey === 'ag-Grid-SelectionColumn') {
              const selected = selectedRowIds.includes(rowNode.data.id);
              if (type === 'json') {
                return selected;
              }
              return selected ? 'Y' : 'N';
            } else {
              const v = getCellValue({ rowNode, colKey });
              if (json && v !== undefined) {
                return v;
              }
              const f = getCellValue({ rowNode, colKey, useFormatter: true });
              // If it's a number, and it matches value return the original type
              return v == f ? v : f;
            }
          };
        }),
      );

      // Get and apply headers
      const headers = selectedColIds.map((colId) => {
        if (colId === 'ag-Grid-SelectionColumn') return type === 'json' ? 'selected' : 'Selected';
        if (json) {
          return colId;
        }
        return getColDef(colId)?.headerName ?? '?';
      });
      const maxCellLength: Record<string, number> = {};
      headers.forEach((headerName, i) => {
        const colId = filteredSelectedColIds[i];
        maxCellLength[colId] = headerName.length;
      });

      const rows: string[][] = [];
      if (type === 'csv' || type === 'markdown') {
        rows.push(headers);
      }
      selectedNodes.forEach((node) => {
        const row: string[] = [];
        rows.push(row);
        formatters.forEach((formatter, i) => {
          const colId = filteredSelectedColIds[i];
          let value = formatter(node);
          if (!json) {
            if (value === '-' || value === '–' || value == null) {
              value = '';
            }
            value = String(value);
            if (value === '-' || value === '–') {
              value = '';
            }
            maxCellLength[colId] = Math.max(maxCellLength[colId], value.length);
          }

          switch (type) {
            case 'plain_text':
              break;
            case 'json':
              value =
                value === 'undefined' || (value !== null && typeof value === 'object') || typeof value === 'string'
                  ? JSON.stringify(value)
                  : value;
              break;
            case 'markdown':
              value = encodeMarkdownValue(value as string);
              break;
            case 'csv':
              value = encodeCSVValue(value as string);
              break;
          }
          row.push(String(value));
        });
      });

      let result = '';
      if (json) {
        result += '[\n';
      }
      rows.forEach((row, i) => {
        if (json) {
          result += '  { ';
        }
        if (i === 1 && type === 'markdown') {
          Object.values(maxCellLength).forEach((maxLength) => {
            result += '|' + '-'.repeat(maxLength + 2);
          });
          result += '|\n';
        }
        row.forEach((cell, i) => {
          switch (type) {
            case 'plain_text':
            case 'csv':
              if (i !== 0) {
                result += ', ';
              }
              result += cell;
              break;
            case 'markdown':
              if (i === 0) {
                result += '|';
              }
              const colId = filteredSelectedColIds[i];
              result += ' ' + cell.padEnd(maxCellLength[colId], ' ') + ' ';
              result += '|';
              break;
            case 'json':
              if (i !== 0) {
                result += ', ';
              }
              result += JSON.stringify(headers[i]) + ': ' + cell;
              break;
          }
        });
        if (json) {
          result += ' }';
        }
        result += '\n';
      });
      if (json) {
        result += ']\n';
      }

      navigator.clipboard.writeText(result).catch((err) => console.error('Failed to copy: ', err));
    },
    [getCellValue, ranges, copyType],
  );

  const onCopyEvent = useCallback(
    (e: ReactClipboardEvent<HTMLDivElement>) => {
      const rangeStart = rangeStartRef.current;
      const rangeEnd = rangeEndRef.current;
      if (
        rangeStart === null ||
        rangeEnd === null ||
        (rangeStart.colId === rangeEnd.colId &&
          rangeStart.rowId === rangeEnd.rowId &&
          !hasSelectedMoreThanOneCellRef.current)
      ) {
        return;
      }

      e.preventDefault();

      onCopy();
    },
    [onCopy],
  );

  const { cellContextMenu: rangeSelectContextMenu, contextMenuComponent: rangeSelectContextMenuComponent } =
    useGridContextMenu<TData, CopyOptionsContext>({
      contextMenu: GridRangeSelectContextMenu<TData>,
      context: { onCopy, copyType, setCopyType },
    });

  const rangeSelectInterceptContextMenu = useCallback(
    (event: CellContextMenuEvent<TData>) =>
      rangeStartRef.current == null ? cellContextMenu(event) : rangeSelectContextMenu(event),
    [cellContextMenu, rangeSelectContextMenu],
  );

  return {
    onCopyEvent,
    rangeSelectInterceptContextMenu,
    rangeSelectContextMenuComponent,
  };
};

const encodeMarkdownValue = (value: string): string => {
  return value.replaceAll('|', '\\|');
};

const encodeCSVValue = (value: string): string => {
  let str = String(value);

  // Check if it needs quoting
  if (/[",\n]/.test(str)) {
    // Escape double quotes by doubling them
    str = '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
};
