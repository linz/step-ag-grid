import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";
import { bearingCorrectionValueFormatter, bearingValueFormatter } from "@utils/bearing";
import { GridCell } from "../GridCell";
import { GridFormEditBearing, GridFormEditBearingProps } from "../gridForm/GridFormEditBearing";
import { GridBaseRow } from "../Grid";

export const GridPopoverEditBearingLike = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType, GridFormEditBearingProps<RowType>>,
) =>
  GridCell<RowType, GridFormEditBearingProps<RowType>>({
    initialWidth: 65,
    maxWidth: 150,
    valueFormatter: bearingValueFormatter,
    cellClass: colDef.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
    ...colDef,
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        ...colDef.cellEditorParams,
        form: GridFormEditBearing,
      },
    }),
  });

export const GridPopoverEditBearing = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType, GridFormEditBearingProps<RowType>>,
) => ({
  ...GridPopoverEditBearingLike(colDef),
  valueFormatter: bearingValueFormatter,
  range: (value: number | null) => {
    if (value === null) return "Bearing is required";
    if (value >= 360) return "Bearing must be less than 360 degrees";
    if (value < 0) return "Bearing must not be negative";
    return null;
  },
});

export const GridPopoverEditBearingCorrection = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType, GridFormEditBearingProps<RowType>>,
) => ({
  ...GridPopoverEditBearingLike(colDef),
  valueFormatter: bearingCorrectionValueFormatter,
  range: (value: number | null) => {
    if (value === null) return "Bearing is required";
    if (value >= 360) return "Bearing must be less than 360 degrees";
    if (value <= -180) return "Bearing must be greater then -180 degrees";
    return null;
  },
});
