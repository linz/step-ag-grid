import { GridBaseRow } from '../Grid';
import { ColDefT, GenericCellEditorProps, GridCell } from '../GridCell';
import { GridFormTextArea, GridFormTextAreaProps } from '../gridForm/GridFormTextArea';
import { GenericCellColDef } from '../gridRender/GridRenderGenericCell';

export const GridPopoverTextArea = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  params: GenericCellEditorProps<GridFormTextAreaProps<TData>>,
): ColDefT<TData, TValue> =>
  GridCell<TData, TValue, GridFormTextAreaProps<TData>>(colDef, { editor: GridFormTextArea, ...params });
