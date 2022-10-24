import "@szhsin/react-menu/dist/index.css";

import { BaseGridRow } from "../Grid";

export interface GridPopoutCellEditorParams {
  canClose?: () => Promise<boolean> | boolean;
  children: JSX.Element;
}

export interface GridPopupProps<RowType extends BaseGridRow, GridFormProps> {
  formProps: GridFormProps;
  multiEdit: boolean;
}
