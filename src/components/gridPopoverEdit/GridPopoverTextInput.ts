import { GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";
import { GridFormTextInput, GridFormTextInputProps } from "../gridForm/GridFormTextInput";

export const GridPopoverTextInput = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType, GridFormTextInputProps<RowType>>,
) => {
  return GridCell<RowType, GridFormTextInputProps<RowType>>({
    maxWidth: 140,
    ...colDef,
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        width: 240,
        ...colDef.cellEditorParams,
        form: GridFormTextInput,
      },
    }),
  });
};
