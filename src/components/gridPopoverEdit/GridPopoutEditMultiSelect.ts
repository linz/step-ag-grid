import clsx from "clsx";
import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormMultiSelect, GridFormMultiSelectProps } from "../gridForm/GridFormMultiSelect";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoutEditMultiSelect = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  props: GenericCellEditorProps<GridFormMultiSelectProps<TData>>,
): ColDefT<TData, TValue> =>
  GridCell<TData, TValue, GridFormMultiSelectProps<TData>>(colDef, {
    editor: GridFormMultiSelect,
    ...props,
    editorParams: {
      ...(props.editorParams as GridFormMultiSelectProps<TData>),
      className: clsx("GridMultiSelect-containerMedium", props.editorParams?.className),
    },
  });
