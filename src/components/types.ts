import { ColDef, EditableCallback, ICellRendererParams, ValueFormatterFunc, ValueGetterFunc } from 'ag-grid-community';
import { ReactElement } from 'react';

export interface GridBaseRow {
  id: string | number;
}

export interface GridOnRowDragEndProps<TData extends GridBaseRow> {
  movedRow: TData;
  targetRow: TData;
  direction: -1 | 1;
}

// This is so that typescript retains the row type to pass to the GridCells
export interface ColDefT<TData extends GridBaseRow, ValueType = any> extends ColDef<TData, ValueType> {
  editable?: boolean | EditableCallback<TData, ValueType>;
  valueGetter?: string | ValueGetterFunc<TData, ValueType>;
  valueFormatter?: string | ValueFormatterFunc<TData, ValueType>;
  cellRenderer?:
    | ((props: ICellRendererParams<TData, ValueType>) => ReactElement | string | false | null | undefined)
    | string;
  cellRendererParams?: {
    rightHoverElement?: ReactElement;
    originalCellRenderer?: any;
    editAction?: (selectedRows: TData[]) => void;
    shortcutKeys?: Record<string, () => void>;
    error?: (props: ICellRendererParams<TData, ValueType>) => ReactElement | string | false | null | undefined;
    warning?: (props: ICellRendererParams<TData, ValueType>) => ReactElement | string | false | null | undefined;
    info?: (props: ICellRendererParams<TData, ValueType>) => ReactElement | string | false | null | undefined;
  };
  editor?: (editorProps: any) => ReactElement;
}
