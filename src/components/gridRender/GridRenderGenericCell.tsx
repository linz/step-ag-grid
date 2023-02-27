import { ICellRendererParams } from "ag-grid-community";
import {
  EditableCallbackParams,
  SuppressKeyboardEventParams,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community/dist/lib/entities/colDef";

import { GridBaseRow } from "../Grid";
import { ColDefT } from "../GridCell";

export interface RowICellRendererParams<RowType extends GridBaseRow> extends ICellRendererParams {
  data: RowType;
}

export interface RowEditableCallbackParams<RowType extends GridBaseRow> extends EditableCallbackParams {
  data: RowType;
}

export interface RowValueFormatterParams<RowType extends GridBaseRow> extends ValueFormatterParams {
  data: RowType;
}
export interface RowValueGetterParams<RowType extends GridBaseRow> extends ValueGetterParams {
  data: RowType;
}

export interface RowValueGetterParams<RowType extends GridBaseRow> extends ValueGetterParams {
  data: RowType;
}

export interface GenericCellColDef<RowType extends GridBaseRow> extends ColDefT<RowType> {
  cellRenderer?: (params: RowICellRendererParams<RowType>) => any;
  cellRendererParams?: GenericCellRendererParams<RowType>;
  valueGetter?: string | ((params: RowValueGetterParams<RowType>) => any);
  valueFormatter?: string | ((params: RowValueFormatterParams<RowType>) => string);
  filterValueGetter?: string | ((params: RowValueGetterParams<RowType>) => string);
  editable?: boolean | ((params: RowEditableCallbackParams<RowType>) => boolean);
}

export interface GenericCellRendererParams<RowType extends GridBaseRow> {
  singleClickEdit?: boolean;
  rightHoverElement?: JSX.Element | undefined;
  editAction?: (selectedRows: RowType[]) => void;
  shortcutKeys?: Record<string, ((params: SuppressKeyboardEventParams) => boolean | void) | undefined>;
  warning?: (props: RowICellRendererParams<RowType>) => string | string[] | boolean | null | undefined;
  info?: (props: RowICellRendererParams<RowType>) => string | string[] | boolean | null | undefined;
}
