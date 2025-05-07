import { GridBaseRow } from '../Grid';
import { ColDefT, GenericCellEditorProps, GridCell } from '../GridCell';
import { GridFormMessage, GridFormMessageProps } from '../gridForm/GridFormMessage';
import { GenericCellColDef } from '../gridRender/GridRenderGenericCell';

export const GridPopoverMessage = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  props: GenericCellEditorProps<GridFormMessageProps<TData>>,
): ColDefT<TData, TValue> =>
  GridCell<TData, TValue, GridFormMessageProps<TData>>(
    {
      resizable: true,
      ...colDef,
      singleClickEdit: true,
    },
    {
      editor: GridFormMessage,
      ...props,
    },
  );
