import { ICellRendererParams } from "ag-grid-community";
import { SuppressKeyboardEventParams } from "ag-grid-community/dist/lib/entities/colDef";
import { ReactElement } from "react";

import { GridBaseRow } from "../Grid";
import { ColDefT } from "../GridCell";

export interface GenericCellColDef<RowType extends GridBaseRow, Field extends keyof RowType>
  extends ColDefT<RowType, Field> {
  exportable?: boolean;
}

export interface GenericCellRendererParams<RowType extends GridBaseRow> {
  singleClickEdit?: boolean;
  rightHoverElement?: ReactElement | undefined;
  editAction?: (selectedRows: RowType[]) => void;
  shortcutKeys?: Record<string, ((params: SuppressKeyboardEventParams) => boolean | void) | undefined>;
  warning?: (props: ICellRendererParams<RowType>) => string | string[] | boolean | null | undefined;
  info?: (props: ICellRendererParams<RowType>) => string | string[] | boolean | null | undefined;
}
