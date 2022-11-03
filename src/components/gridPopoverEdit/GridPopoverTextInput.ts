import { GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";
import { GridFormTextInput, GridFormTextInputProps } from "../gridForm/GridFormTextInput";
import { ColDef } from "ag-grid-community";

export const GridPopoverTextInput = <RowType extends GridBaseRow>(
  colDef: ColDef,
  params: { editorParams: GridFormTextInputProps<RowType> },
) => {
  return GridCell<RowType>(
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
