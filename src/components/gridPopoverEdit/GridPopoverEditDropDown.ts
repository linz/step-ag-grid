import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormDropDown, GridFormPopoutDropDownProps } from "../gridForm/GridFormDropDown";
import { GenericCellColDef } from "@components/gridRender/GridRenderGenericCell";

export const GridPopoverEditDropDown = <RowType extends GridBaseRow, ValueType>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormPopoutDropDownProps<RowType, ValueType>>,
): ColDefT<RowType> =>
  GridCell(
    {
      initialWidth: 65,
      maxWidth: 150,
      ...colDef,
    },
    {
      editor: GridFormDropDown,
      ...props,
      editorParams: {
        // Defaults to medium size container
        className: "GridPopoverEditDropDown-containerMedium",
        ...(props.editorParams as GridFormPopoutDropDownProps<RowType, ValueType>),
      },
    },
  );
