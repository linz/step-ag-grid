import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormTextInput, GridFormTextInputProps } from "../gridForm/GridFormTextInput";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverTextInput = <RowType extends GridBaseRow, Field extends keyof RowType>(
  colDef: GenericCellColDef<RowType, Field>,
  params: GenericCellEditorProps<GridFormTextInputProps<RowType>>,
): ColDefT<RowType, Field> =>
  GridCell<RowType, Field, GridFormTextInputProps<RowType>>(colDef, {
    editor: GridFormTextInput,
    ...params,
  });
