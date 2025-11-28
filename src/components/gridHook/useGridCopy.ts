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
  cellContextMenu,
}: {
  ranges: () => GridRanges<TData>;
  rangeStartRef: MutableRefObject<CellLocation | null>;
  rangeEndRef: MutableRefObject<CellLocation | null>;
  cellContextMenu: (event: CellContextMenuEvent) => void;
}) => {
  const { getColDef, getCellValue } = useGridContext<TData>();
  const { copyType, setCopyType } = useGridCopySettings();

  const onCopy = useCallback(
    (type = copyType) => {
      const rangeStart = rangeStartRef.current;
      const rangeEnd = rangeEndRef.current;
      if (
        rangeStart === null ||
        rangeEnd === null ||
        (rangeStart.colId === rangeEnd.colId && rangeStart.rowId === rangeEnd.rowId)
      ) {
        return;
      }

      const { selectedColIds, selectedNodes } = ranges();
      const filteredSelectedColIds = selectedColIds.filter((colId) => colId !== 'gridCellFiller');

      const formatters = compact(
        filteredSelectedColIds.map((colKey) => {
          return (rowNode: IRowNode): string | number | null | undefined => {
            const v = getCellValue({ rowNode, colKey });
            const f = getCellValue({ rowNode, colKey, useFormatter: true });
            if (v == f) return v;
            return f;
          };
        }),
      );

      // Get and apply headers
      const headers = selectedColIds.map((colId) => getColDef(colId)?.headerName ?? '?');
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
          if (value === '-' || value === '–' || value == null) {
            value = '';
          }
          value = String(value);
          if (value === '-' || value === '–') {
            value = '';
          }
          maxCellLength[colId] = Math.max(maxCellLength[colId], value.length);

          switch (type) {
            case 'plain_text':
              break;
            case 'markdown':
              value = encodeMarkdownValue(value);
              break;
            case 'csv':
              value = encodeCSVValue(value);
              break;
          }
          row.push(String(value));
        });
      });

      console.log(maxCellLength);
      let result = '';
      rows.forEach((row, i) => {
        if (i === 1 && type === 'markdown') {
          Object.values(maxCellLength).forEach((maxLength) => {
            result += '-'.repeat(maxLength + 3);
          });
          result += '-\n';
        }
        row.forEach((cell, i) => {
          switch (type) {
            case 'plain_text':
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
              // TODO we can't use cell length here as it will be encoded
              console.log(cell, maxCellLength[colId], cell.length);
              result += ' ' + cell.padEnd(maxCellLength[colId], ' ') + ' ';
              result += '|';
              break;
            case 'csv':
              if (i !== 0) {
                result += ', ';
              }
              result += cell;
              break;
          }
        });
        result += '\n';
      });

      console.log(result);
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
        (rangeStart.colId === rangeEnd.colId && rangeStart.rowId === rangeEnd.rowId)
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
