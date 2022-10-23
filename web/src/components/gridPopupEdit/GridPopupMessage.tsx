import { GridGenericCellEditor } from "../GridGenericCellEditor";
import { GridFormMessage, GridFormMessageProps } from "../gridForm/GridFormMessage";
import { BaseGridRow } from "../Grid";
import { ColDef } from "ag-grid-community";
import { GridPopupProps } from "./GridPopupProps";

export const GridPopupMessage = <RowType extends BaseGridRow>(
  colDef: ColDef,
  props: GridPopupProps<RowType, GridFormMessageProps<RowType>>,
) => {
  return GridGenericCellEditor({
    maxWidth: 140,
    ...props,
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
