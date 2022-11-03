import { GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormTextArea, GridFormTextAreaProps } from "../gridForm/GridFormTextArea";
import { ColDef } from "ag-grid-community";

export const GridPopoverTextArea = <RowType extends GridBaseRow>(
  colDef: ColDef,
  params: GenericCellEditorProps<RowType, any, GridFormTextAreaProps<RowType>>,
) => {
  return GridCell<RowType>(
    {
      maxWidth: 260,
      ...colDef,
    },
    { editor: GridFormTextArea, ...params },
  );
};
