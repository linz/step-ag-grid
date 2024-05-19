import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormTextArea, GridFormTextAreaProps } from "../gridForm/GridFormTextArea";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverTextArea = <RowType extends GridBaseRow, Field extends keyof RowType>(
  colDef: GenericCellColDef<RowType, Field>,
  params: GenericCellEditorProps<GridFormTextAreaProps<RowType>>,
): ColDefT<RowType, Field> =>
  GridCell<RowType, Field, GridFormTextAreaProps<RowType>>(colDef, { editor: GridFormTextArea, ...params });
