import { GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";
import { GridFormTextArea, GridFormTextAreaProps } from "../gridForm/GridFormTextArea";

export const GridPopoverTextArea = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType, GridFormTextAreaProps<RowType>>,
) => {
  return GridCell<RowType, GridFormTextAreaProps<RowType>>({
    maxWidth: 260,
    ...colDef,
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        width: 260,
        ...colDef.cellEditorParams,
        form: GridFormTextArea,
      },
    }),
  });
};
