import { GenericCellEditorProps, GridCell } from '../GridCell';
import { GridFormTextInput, GridFormTextInputProps } from '../gridForm/GridFormTextInput';
import { GenericCellColDef } from '../gridRender/GridRenderGenericCell';
import { ColDefT, GridBaseRow } from '../types';

export const GridPopoverTextInput = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  params: GenericCellEditorProps<GridFormTextInputProps<TData>>,
): ColDefT<TData, TValue> =>
  GridCell<TData, TValue, GridFormTextInputProps<TData>>(colDef, {
    editor: GridFormTextInput,
    ...params,
  });
