import { GridGenericCellEditor } from "./GridGenericCellEditor";
import { GridFormMessage, GridFormMessageProps } from "./GridFormMessage";
import { BaseGridRow } from "./Grid";
import { ColDef } from "ag-grid-community";

interface GridPopupMessageProps<RowType extends BaseGridRow> extends ColDef {
  formProps: GridFormMessageProps<RowType>;
  multiEdit: boolean;
}

export const GridPopupMessage = <RowType extends BaseGridRow>(props: GridPopupMessageProps<RowType>) => {
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
