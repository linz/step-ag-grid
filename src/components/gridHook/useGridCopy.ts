import { useShowLUIMessage } from '@linzjs/lui';
import { CellContextMenuEvent, IRowNode } from 'ag-grid-community';
import { compact } from 'lodash-es';
import { ClipboardEvent as ReactClipboardEvent, MutableRefObject, useCallback } from 'react';

import { useGridContext } from '../../contexts/GridContext';
import { CopyOptionsContext, GridRangeSelectContextMenu } from '../GridRangeSelectContextMenu';
import { agGridSelectRowColId, GridBaseRow } from '../types';
import { useGridContextMenu } from './useGridContextMenu';
import { CopyOptionsKey, gridCopyOptions, useGridCopySettings } from './useGridCopySettings';
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
  const showToast = useShowLUIMessage();
  const { getSelectedRowIds } = useGridContext<TData>();
  const { getColDef, getCellValue } = useGridContext<TData>();
  const { copyType, setCopyType } = useGridCopySettings();

  const onCopy = useCallback(
    (type: CopyOptionsKey = copyType) => {
      const rangeStart = rangeStartRef.current;
      const rangeEnd = rangeEndRef.current;
      if (rangeStart === null || rangeEnd === null || !hasSelectedMoreThanOneCellRef.current) {
        return;
      }

      if (rangeStart.rowId === rangeEnd.rowId && rangeStart.colId === rangeEnd.colId) {
        type = 'html';
      }

      const json = type === 'json';
      const { selectedColIds, selectedNodes } = ranges();
      const filteredSelectedColIds = selectedColIds.filter(
        (colId) =>
          colId === agGridSelectRowColId ||
          (colId !== 'gridCellFiller' && getColDef(colId)?.headerComponentParams?.exportable !== false),
      );

      const selectedRowIds = getSelectedRowIds();
      const formatters = compact(
        filteredSelectedColIds.map((colKey) => {
          return (rowNode: IRowNode): string | number | boolean | null | undefined => {
            if (colKey === agGridSelectRowColId) {
              return selectedRowIds.includes(rowNode.data.id);
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
      const headers = filteredSelectedColIds.map((colId) => {
        if (colId === agGridSelectRowColId) return type === 'json' ? 'selected' : 'Selected';
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
      if (type === 'csv' || type === 'html') {
        rows.push(headers);
      }
      selectedNodes.forEach((node) => {
        const row: string[] = [];
        rows.push(row);
        formatters.forEach((formatter, i) => {
          const colId = filteredSelectedColIds[i];
          let value = formatter(node);
          if (typeof value === 'string') {
            value = value.replaceAll('\xa0', ' ');
          }
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
      let html = `<table style="
            font-family: 'Open Sans', system-ui, sans-serif;
            font-size: 10px;
            line-height: 10px;
            border: 1px solid #d1d9e0;
            border-collapse: collapse;
          ">`;
      if (json) {
        result += '[\n';
      }
      rows.forEach((row, rowIndex) => {
        if (json) {
          result += '  { ';
        }
        if (rowIndex == 1) {
          html += '<tbody style="font-weight: 400;">';
        }
        if (rowIndex == 0) {
          html += '<thead style="font-weight: 600;">';
        }
        if (rowIndex === 0 || (rowIndex & 1) === 1) {
          html += '<tr>';
        } else {
          html += '<tr style="background-color: #f6f8fa;">';
        }
        if (rowIndex === 1 && type === 'html') {
          Object.values(maxCellLength).forEach((maxLength) => {
            result += '|' + '-'.repeat(maxLength + 2);
          });
          result += '|\n';
        }
        row.forEach((cell, i) => {
          switch (type) {
            case 'csv':
              if (i !== 0) {
                result += ', ';
              }
              result += cell;
              break;
            case 'html':
              if (i === 0) {
                result += '|';
              }
              const colId = filteredSelectedColIds[i];
              result += ' ' + cell.padEnd(maxCellLength[colId], ' ') + ' ';
              result += '|';
              html +=
                rowIndex === 0
                  ? '<th style="border: 1px solid #d1d9e0; padding:6px 13px; text-align: left;">'
                  : '<td style="border: 1px solid #d1d9e0; padding:6px 13px;">';
              html += cell;
              html += rowIndex === 0 ? '</th>' : '</td>';
              break;
            case 'json':
              if (i !== 0) {
                result += ', ';
              }
              result += JSON.stringify(headers[i]) + ': ' + cell;
              break;
          }
        });
        html += '</tr>';
        if (rowIndex == 0) {
          html += '</thead>';
        }
        if (rowIndex == rows.length - 1) {
          html += '</tbody>';
        }
        if (json) {
          result += ' }';
        }
        result += '\n';
      });
      if (json) {
        result += ']\n';
      }
      html += '</table>';

      showToast({
        message: `${gridCopyOptions[type].text} copied`,
        messageType: 'toast',
        messageLevel: 'info',
      });

      if (type === 'html') {
        const clipboardItem = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([result], { type: 'text/plain' }), // fallback
        });

        void navigator.clipboard.write([clipboardItem]).catch((err) => console.error('Failed to copy: ', err));
      } else {
        void navigator.clipboard.writeText(result).catch((err) => console.error('Failed to copy: ', err));
      }
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
