import { ICellRendererParams } from 'ag-grid-community';
import { SuppressKeyboardEventParams } from 'ag-grid-community';
import { ReactElement } from 'react';

import { ColDefT, GridBaseRow } from '../types';

export interface GenericCellColDef<TData extends GridBaseRow, TValue = any> extends ColDefT<TData, TValue> {
  exportable?: boolean;
}

export interface GenericCellRendererParams<TData extends GridBaseRow> {
  rightHoverElement?: ReactElement | undefined;
  editAction?: (selectedRows: TData[]) => void;
  shortcutKeys?: Record<string, ((params: SuppressKeyboardEventParams) => boolean | void) | undefined>;
  error?: (props: ICellRendererParams<TData>) => string | string[] | boolean | null | undefined;
  warning?: (props: ICellRendererParams<TData>) => string | string[] | boolean | null | undefined;
  info?: (props: ICellRendererParams<TData>) => string | string[] | boolean | null | undefined;
}
