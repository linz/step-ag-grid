import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormMultiSelect, GridFormMultiSelectProps } from "../gridForm/GridFormMultiSelect";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoutEditMultiSelect = <RowType extends GridBaseRow, Field extends keyof RowType>(
  colDef: GenericCellColDef<RowType, Field>,
  props: GenericCellEditorProps<GridFormMultiSelectProps<RowType>>,
): ColDefT<RowType, Field> =>
  GridCell<RowType, Field, GridFormMultiSelectProps<RowType>>(colDef, {
    editor: GridFormMultiSelect,
    ...props,
    editorParams: {
      className: "GridMultiSelect-containerMedium",
      ...(props.editorParams as GridFormMultiSelectProps<RowType>),
    },
  });
