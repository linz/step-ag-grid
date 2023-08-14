import { CellEditorSelectorResult } from "ag-grid-community/dist/lib/entities/colDef";
import { ICellEditorParams } from "ag-grid-community/dist/lib/interfaces/iCellEditor";
import { ComponentProps, ReactElement } from "react";

import { GridBaseRow } from "./Grid";
import { ColDefT, GenericCellEditorComponentWrapper, GridCell } from "./GridCell";
import { GridCellMultiSelectClassRules } from "./GridCellMultiSelectClassRules";
import { GenericCellColDef } from "./gridRender";

export const Editor = <FN extends (param: any) => ReactElement>(props: {
  multiEdit: boolean;
  editor: FN;
  editorParams: ComponentProps<FN>;
}): CellEditorSelectorResult => ({
  component: GenericCellEditorComponentWrapper(props.editor),
  params: { ...props.editorParams, multiEdit: props.multiEdit },
});

export interface RowCellEditorParams<RowType extends GridBaseRow> extends ICellEditorParams {
  data: RowType;
}

/**
 * Used to choose between cell editors based in data.
 */
export const GridCellMultiEditor = <RowType extends GridBaseRow>(
  props: GenericCellColDef<RowType>,
  cellEditorSelector: (params: RowCellEditorParams<RowType>) => CellEditorSelectorResult,
): ColDefT<RowType> =>
  GridCell({
    cellClassRules: GridCellMultiSelectClassRules,
    cellEditorSelector,
    editable: props.editable ?? true,
    ...props,
  });
