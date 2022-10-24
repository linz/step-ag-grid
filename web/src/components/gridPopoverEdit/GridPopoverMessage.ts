import { GridCell } from "../GridCell";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { BaseGridRow } from "../Grid";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverMessage = <RowType extends BaseGridRow>(
  colDef: GenericCellColDef<GridFormMessageProps<RowType>>,
) => {
  return GridCell({
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
