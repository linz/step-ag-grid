import "../GridPopoutEditGenericInput.scss";

import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GenericCellRendererColDef, GridGenericCellRendererComponent } from "../gridRender/GridRenderGenericCell";
import { bearingValueFormatter } from "../../utils/bearing";
import { GridGenericCellEditor } from "../GridGenericCellEditor";
import { GridFormEditBearing, GridFormEditBearingProps } from "../gridForm/GridFormEditBearing";
import { BaseGridRow } from "../Grid";
import { GridPopupProps } from "./GridPopupProps";

export const GridPopoverEditBearing = <RowType extends BaseGridRow>(
  colDef: GenericCellRendererColDef,
  props: GridPopupProps<RowType, GridFormEditBearingProps<RowType>>,
) =>
  GridGenericCellEditor({
    initialWidth: 65,
    maxWidth: 150,
    valueFormatter: bearingValueFormatter,
    cellRenderer: GridGenericCellRendererComponent,
    cellClass: props.multiEdit ? GenericMultiEditCellClass : undefined,
    cellEditorParams: {
      ...colDef.cellEditorParams,
      form: GridFormEditBearing,
      formProps: props.formProps,
      multiEdit: props.multiEdit,
    },
    ...colDef,
  });
