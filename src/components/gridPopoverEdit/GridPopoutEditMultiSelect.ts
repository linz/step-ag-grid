import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormMultiSelect, GridFormMultiSelectProps } from "../gridForm/GridFormMultiSelect";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoutEditMultiSelect = <RowType extends GridBaseRow, ValueType>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormMultiSelectProps<RowType, ValueType>>,
): ColDefT<RowType> =>
  GridCell(
    {
      initialWidth: 65,
      maxWidth: 150,
      ...colDef,
    },
    {
      editor: GridFormMultiSelect,
      ...props,
      editorParams: {
        className: "GridMultiSelect-containerMedium",
        ...(props.editorParams as GridFormMultiSelectProps<RowType, ValueType>),
      },
    },
  );
