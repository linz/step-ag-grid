import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormMultiSelectGrid, GridFormMultiSelectGridProps } from "../gridForm/GridFormMultiSelectGrid";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoutEditMultiSelectGrid = <RowType extends GridBaseRow, Field extends keyof RowType>(
  colDef: GenericCellColDef<RowType, Field>,
  props: GenericCellEditorProps<GridFormMultiSelectGridProps<RowType>>,
): ColDefT<RowType, Field> =>
  GridCell<RowType, Field, GridFormMultiSelectGridProps<RowType>>(colDef, {
    editor: GridFormMultiSelectGrid,
    ...props,
    editorParams: {
      className: "GridMultiSelect-containerMedium",
      ...(props.editorParams as GridFormMultiSelectGridProps<RowType>),
    },
  });
