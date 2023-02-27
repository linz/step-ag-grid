import { CellEditorSelectorResult, ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { ICellEditorParams } from "ag-grid-community/dist/lib/interfaces/iCellEditor";
import { ComponentProps } from "react";

import { GridBaseRow } from "./Grid";
import { ColDefT, GenericCellEditorComponentWrapper, GridCellRenderer, suppressCellKeyboardEvents } from "./GridCell";
import { GridCellMultiSelectClassRules } from "./GridCellMultiSelectClassRules";
import { GenericCellColDef } from "./gridRender/GridRenderGenericCell";

export const Editor = <FN extends (param: any) => JSX.Element>(props: {
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

/*
 * All cells should use this
 */
export const GridCellMultiEditor = <RowType extends GridBaseRow>(
  props: GenericCellColDef<RowType>,
  cellEditorSelector: (params: RowCellEditorParams<RowType>) => CellEditorSelectorResult,
): ColDefT<RowType> => {
  return {
    colId: props.colId ?? props.field,
    field: props.field,
    sortable: !!(props?.field || props?.valueGetter),
    resizable: true,
    editable: props.editable ?? true,
    cellClassRules: GridCellMultiSelectClassRules,
    cellEditorSelector,
    suppressKeyboardEvent: suppressCellKeyboardEvents,
    // Default value formatter, otherwise react freaks out on objects
    valueFormatter: (params: ValueFormatterParams) => {
      if (params.value == null) return "–";
      const types = ["number", "boolean", "string"];
      if (types.includes(typeof params.value)) return `${params.value}`;
      else return JSON.stringify(params.value);
    },
    ...props,
    cellRenderer: GridCellRenderer,
    cellRendererParams: {
      originalCellRenderer: props.cellRenderer,
      ...props.cellRendererParams,
    },
  };
};
