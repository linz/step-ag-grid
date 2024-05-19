import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverMessage = <RowType extends GridBaseRow, Field extends keyof RowType>(
  colDef: GenericCellColDef<RowType, Field>,
  props: GenericCellEditorProps<GridFormMessageProps<RowType>>,
): ColDefT<RowType, Field> =>
  GridCell<RowType, Field, GridFormMessageProps<RowType>>(
    {
      resizable: true,
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
