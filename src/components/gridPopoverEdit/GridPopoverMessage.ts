import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverMessage = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormMessageProps<RowType>>,
): ColDefT<RowType> =>
  GridCell(
    {
      resizable: false,
      ...colDef,
      cellRendererParams: {
        singleClickEdit: true,
        ...colDef.cellRendererParams,
      },
    },
    {
      editor: GridFormMessage,
      ...props,
    },
  );
