import { GridCell } from "../GridCell";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { GridBaseRow } from "../Grid";
import { ColDef } from "ag-grid-community";

export const GridPopoverMessage = <RowType extends GridBaseRow>(
  colDef: ColDef,
  props: { editorParams: GridFormMessageProps<RowType> },
) => {
  return GridCell<RowType>(
    {
      maxWidth: 140,
      ...colDef,
      cellRendererParams: colDef.cellRendererParams ?? {
        singleClickEdit: true,
      },
    },
    {
      editor: GridFormMessage,
      ...props,
    },
  );
};
