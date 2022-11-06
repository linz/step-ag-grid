import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormTextArea, GridFormTextAreaProps } from "../gridForm/GridFormTextArea";
import { GenericCellColDef } from "../../components/gridRender/GridRenderGenericCell";

export const GridPopoverTextArea = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  params: GenericCellEditorProps<GridFormTextAreaProps<RowType>>,
): ColDefT<RowType> =>
  GridCell(
    {
      maxWidth: 260,
      ...colDef,
    },
    { editor: GridFormTextArea, ...params },
  );
