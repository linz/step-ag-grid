import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormTextInput, GridFormTextInputProps } from "../gridForm/GridFormTextInput";
import { GenericCellColDef } from "../../components/gridRender/GridRenderGenericCell";

export const GridPopoverTextInput = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  params: GenericCellEditorProps<GridFormTextInputProps<RowType>>,
): ColDefT<RowType> => {
  return GridCell(
    {
      maxWidth: 140,
      ...colDef,
    },
    {
      editor: GridFormTextInput,
      ...params,
    },
  );
};
