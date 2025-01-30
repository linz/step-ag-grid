import clsx from 'clsx';

import { GridBaseRow } from '../Grid';
import { ColDefT, GenericCellEditorProps, GridCell } from '../GridCell';
import { GridFormMultiSelectGrid, GridFormMultiSelectGridProps } from '../gridForm/GridFormMultiSelectGrid';
import { GenericCellColDef } from '../gridRender/GridRenderGenericCell';

export const GridPopoutEditMultiSelectGrid = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  props: GenericCellEditorProps<GridFormMultiSelectGridProps<TData>>,
): ColDefT<TData, TValue> =>
  GridCell<TData, TValue, GridFormMultiSelectGridProps<TData>>(colDef, {
    editor: GridFormMultiSelectGrid,
    ...props,
    editorParams: {
      ...(props.editorParams as GridFormMultiSelectGridProps<TData>),
      className: clsx('GridMultiSelect-containerMedium', props.editorParams?.className),
    },
  });
