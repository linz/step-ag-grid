import "./GridPopoutEditGenericInput.scss";

import { GenericMultiEditCellClass } from "./GenericCellClass";
import { GenericCellRendererParams, GridGenericCellRendererComponent } from "./GridGenericCellRenderer";
import { bearingValueFormatter } from "../utils/bearing";
import { GridGenericCellEditor } from "./GridGenericCellEditor";
import { GridFormEditBearing, GridFormEditBearingProps } from "./gridForm/GridFormEditBearing";
import { BaseGridRow } from "./Grid";

interface ICellEditorParams<RowType extends BaseGridRow> {
  multiEdit: boolean;
  formProps: GridFormEditBearingProps<RowType>;
}

export const GridPopoutEditBearing = <RowType extends BaseGridRow>(props: {
  field: keyof RowType;
  headerName: string;
  cellRendererParams: GenericCellRendererParams;
  cellEditorParams: ICellEditorParams<RowType>;
}) =>
  GridGenericCellEditor({
    field: props.field as string,
    headerName: props.headerName,
    initialWidth: 65,
    maxWidth: 150,
    valueFormatter: bearingValueFormatter,
    cellRenderer: GridGenericCellRendererComponent,
    cellRendererParams: props.cellRendererParams,
    cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
    cellEditorParams: {
      ...props.cellEditorParams,
      form: GridFormEditBearing,
    },
  });
