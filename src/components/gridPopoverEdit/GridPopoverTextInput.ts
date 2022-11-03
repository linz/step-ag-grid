import { GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormTextInput, GridFormTextInputProps } from "../gridForm/GridFormTextInput";
import { ColDef } from "ag-grid-community";

export const GridPopoverTextInput = <RowType extends GridBaseRow>(
  colDef: ColDef,
  params: GenericCellEditorProps<RowType, any, GridFormTextInputProps<RowType>>,
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
