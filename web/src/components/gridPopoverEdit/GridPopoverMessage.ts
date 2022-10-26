import { GridCell } from "../GridCell";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { GridBaseRow } from "../Grid";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverMessage = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType, GridFormMessageProps<RowType>>,
) => {
  return GridCell<RowType, GridFormMessageProps<RowType>>({
    maxWidth: 140,
    ...colDef,
    cellRendererParams: colDef.cellRendererParams ?? {
      singleClickEdit: true,
    },
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        ...colDef.cellEditorParams,
        form: GridFormMessage,
      },
    }),
  });
};
