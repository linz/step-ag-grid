import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormMultiSelect, GridFormMultiSelectProps } from "../gridForm/GridFormMultiSelect";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoutEditMultiSelect = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormMultiSelectProps<RowType>>,
): ColDefT<RowType> =>
  GridCell(colDef, {
    editor: GridFormMultiSelect,
    ...props,
    editorParams: {
      className: "GridMultiSelect-containerMedium",
      ...(props.editorParams as GridFormMultiSelectProps<RowType>),
    },
  });
