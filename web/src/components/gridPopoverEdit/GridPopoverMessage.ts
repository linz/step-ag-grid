import { GridCell } from "../GridCell";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { BaseGridRow } from "../Grid";
import { GenericCellRendererColDef } from "../gridRender/GridRenderGenericCell";
import { GridPopupProps } from "./GridPopover";

export const GridPopoverMessage = <RowType extends BaseGridRow>(
  colDef: GenericCellRendererColDef,
  props: GridPopupProps<RowType, GridFormMessageProps<RowType>>,
) => {
  return GridCell({
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
