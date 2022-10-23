import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GenericCellRendererColDef, GridGenericCellRendererComponent } from "../gridRender/GridRenderGenericCell";
import { bearingValueFormatter } from "../../utils/bearing";
import { GridCell } from "../GridCell";
import { GridFormEditBearing, GridFormEditBearingProps } from "../gridForm/GridFormEditBearing";
import { BaseGridRow } from "../Grid";
import { GridPopupProps } from "./GridPopover";

export const GridPopoverEditBearing = <RowType extends BaseGridRow>(
  colDef: GenericCellRendererColDef,
  props: GridPopupProps<RowType, GridFormEditBearingProps<RowType>>,
) =>
  GridCell({
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
