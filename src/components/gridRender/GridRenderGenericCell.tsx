import { ICellRendererParams } from "ag-grid-community";
import { GridBaseRow } from "../Grid";
import { ColDefT } from "../GridCell";
import { EditableCallbackParams, SuppressKeyboardEventParams } from "ag-grid-community/dist/lib/entities/colDef";

export interface RowICellRendererParams<RowType extends GridBaseRow> extends ICellRendererParams {
  data: RowType;
}

export interface RowEditableCallbackParams<RowType extends GridBaseRow> extends EditableCallbackParams {
  data: RowType;
}

export interface GenericCellColDef<RowType extends GridBaseRow> extends ColDefT<RowType> {
  cellRendererParams?: GenericCellRendererParams<RowType>;
  editable?: boolean | ((params: RowEditableCallbackParams<RowType>) => boolean);
}

export interface GenericCellRendererParams<RowType extends GridBaseRow> {
  singleClickEdit?: boolean;
  rightHoverElement?: JSX.Element | undefined;
  editAction?: (selectedRows: RowType[]) => void;
  shortcutKeys?: Record<string, ((params: SuppressKeyboardEventParams) => boolean | void) | undefined>;
  warning?: (props: RowICellRendererParams<RowType>) => string | boolean | null | undefined;
  info?: (props: RowICellRendererParams<RowType>) => string | boolean | null | undefined;
}
