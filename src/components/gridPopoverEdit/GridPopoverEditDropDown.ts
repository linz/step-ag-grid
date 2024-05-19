import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormDropDown, GridFormDropDownProps } from "../gridForm/GridFormDropDown";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverEditDropDown = <RowType extends GridBaseRow, Field extends keyof RowType>(
  colDef: GenericCellColDef<RowType, Field>,
  props: GenericCellEditorProps<GridFormDropDownProps<RowType>>,
): ColDefT<RowType, Field> =>
  GridCell<RowType, Field, GridFormDropDownProps<RowType>>(colDef, {
    editor: GridFormDropDown,
    ...props,
    editorParams: {
      // Defaults to large size container
      className: "GridPopoverEditDropDown-containerLarge",
      ...(props.editorParams as GridFormDropDownProps<RowType>),
    },
  });
