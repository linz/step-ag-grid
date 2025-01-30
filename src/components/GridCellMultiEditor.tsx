import { CellEditorSelectorResult } from 'ag-grid-community';
import { ICellEditorParams } from 'ag-grid-community';
import { ComponentProps, ReactElement } from 'react';

import { GridBaseRow } from './Grid';
import { ColDefT, GenericCellEditorComponentWrapper, GridCell } from './GridCell';
import { GridCellMultiSelectClassRules } from './GridCellMultiSelectClassRules';
import { GenericCellColDef } from './gridRender';

export const Editor = <FN extends (param: any) => ReactElement>(props: {
  multiEdit: boolean;
  editor: FN;
  editorParams: ComponentProps<FN>;
}): CellEditorSelectorResult => ({
  component: GenericCellEditorComponentWrapper(props.editor),
  params: { ...props.editorParams, multiEdit: props.multiEdit },
});

export interface RowCellEditorParams<TData extends GridBaseRow> extends ICellEditorParams {
  data: TData;
}

/**
 * Used to choose between cell editors based in data.
 */
export const GridCellMultiEditor = <TData extends GridBaseRow, TValue = any>(
  props: GenericCellColDef<TData, TValue>,
  cellEditorSelector: (params: RowCellEditorParams<TData>) => CellEditorSelectorResult,
): ColDefT<TData, TValue> =>
  GridCell<TData, TValue>({
    cellClassRules: GridCellMultiSelectClassRules,
    cellEditorSelector,
    editable: props.editable ?? true,
    ...props,
  });
