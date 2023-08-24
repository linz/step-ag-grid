import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormMultiSelectGrid, GridFormMultiSelectGridProps } from "../gridForm/GridFormMultiSelectGrid";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoutEditMultiSelectGrid = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormMultiSelectGridProps<RowType>>,
): ColDefT<RowType> =>
  GridCell(colDef, {
    editor: GridFormMultiSelectGrid,
    ...props,
    editorParams: {
      className: "GridMultiSelect-containerMedium",
      ...(props.editorParams as GridFormMultiSelectGridProps<RowType>),
    },
  });
