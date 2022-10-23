import { GridGenericCellEditor } from "../GridGenericCellEditor";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { BaseGridRow } from "../Grid";
import { GridPopupProps } from "./GridPopupProps";
import { GenericCellRendererColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverMessage = <RowType extends BaseGridRow>(
  colDef: GenericCellRendererColDef,
  props: GridPopupProps<RowType, GridFormMessageProps<RowType>>,
) => {
  return GridGenericCellEditor({
    maxWidth: 140,
    ...colDef,
    cellRendererParams: colDef.cellRendererParams ?? {
      singleClickEdit: true,
    },
    cellEditorParams: {
      ...colDef.cellEditorParams,
      form: GridFormMessage,
      formProps: props.formProps,
      multiEdit: props.multiEdit,
    },
  });
};
