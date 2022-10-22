import { BaseGridRow } from "../Grid";

export interface GridPopupProps<RowType extends BaseGridRow, GridFormProps> {
  formProps: GridFormProps;
  multiEdit: boolean;
}
