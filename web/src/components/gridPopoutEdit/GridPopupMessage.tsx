import { GridGenericCellEditor } from "../GridGenericCellEditor";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { BaseGridRow } from "../Grid";
import { ColDef } from "ag-grid-community";
import { GridPopupProps } from "./GridPopupProps";

export const GridPopupMessage = <RowType extends BaseGridRow>(
  props: ColDef & GridPopupProps<RowType, GridFormMessageProps<RowType>>,
) => {
  return GridGenericCellEditor({
    maxWidth: 140,
    ...props,
    cellRendererParams: props.cellRendererParams ?? {
      singleClickEdit: true,
    },
    cellEditorParams: {
      ...props.cellEditorParams,
      form: GridFormMessage,
      formProps: props.formProps,
      multiEdit: props.multiEdit,
    },
  });
};
