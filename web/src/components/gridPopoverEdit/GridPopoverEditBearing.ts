import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GenericCellColDef, GridGenericCellRendererComponent } from "../gridRender/GridRenderGenericCell";
import { bearingValueFormatter } from "../../utils/bearing";
import { GridCell } from "../GridCell";
import { GridFormEditBearing, GridFormEditBearingProps } from "../gridForm/GridFormEditBearing";
import { BaseGridRow } from "../Grid";
import { GridPopupProps } from "./GridPopover";

export const GridPopoverEditBearing = <RowType extends BaseGridRow>(
  colDef: GenericCellColDef<GridFormEditBearingProps<RowType>>,
) =>
  GridCell({
    initialWidth: 65,
    maxWidth: 150,
    valueFormatter: bearingValueFormatter,
    cellRenderer: GridGenericCellRendererComponent,
    cellClass: colDef.cellEditor?.multiEdit ? GenericMultiEditCellClass : undefined,
    ...colDef,
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        ...colDef.cellEditorParams,
        form: GridFormEditBearing,
      },
    }),
  });
