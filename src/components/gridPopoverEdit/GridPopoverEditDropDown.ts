import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormDropDown, GridFormDropDownProps } from "../gridForm/GridFormDropDown";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverEditDropDown = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormDropDownProps<RowType>>,
): ColDefT<RowType> =>
  GridCell(colDef, {
    editor: GridFormDropDown,
    ...props,
    editorParams: {
      // Defaults to large size container
      className: "GridPopoverEditDropDown-containerLarge",
      ...(props.editorParams as GridFormDropDownProps<RowType>),
    },
  });
