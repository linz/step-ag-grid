import { GenericMultiEditCellClass } from "../GenericCellClass";
import { bearingCorrectionValueFormatter, bearingValueFormatter } from "@utils/bearing";
import { GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormEditBearing, GridFormEditBearingProps } from "../gridForm/GridFormEditBearing";
import { GridBaseRow } from "../Grid";
import { ColDef } from "ag-grid-community";

export const GridPopoverEditBearingLike = <RowType extends GridBaseRow>(
  colDef: ColDef,
  props: GenericCellEditorProps<RowType, any, GridFormEditBearingProps<RowType>>,
) => {
  return GridCell(
    {
      initialWidth: 65,
      maxWidth: 150,
      valueFormatter: bearingValueFormatter,
      cellClass: props.editorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
      ...colDef,
    },
    {
      editor: GridFormEditBearing,
      editorParams: props.editorParams,
    },
  );
};

export const GridPopoverEditBearing = <RowType extends GridBaseRow>(
  colDef: ColDef,
  props: GenericCellEditorProps<RowType, any, GridFormEditBearingProps<RowType>>,
) => {
  return GridPopoverEditBearingLike(
    { valueFormatter: bearingValueFormatter, ...colDef },
    {
      editorParams: {
        placeHolder: "Enter bearing correction",
        multiEdit: !!props.editorParams?.multiEdit,
        range: (value: number | null) => {
          if (value === null) return "Bearing correction is required";
          if (value >= 360) return "Bearing correction must be less than 360 degrees";
          if (value < 0) return "Bearing correction must not be negative";
          return null;
        },
        ...props.editorParams,
      },
    },
  );
};

export const GridPopoverEditBearingCorrection = <RowType extends GridBaseRow>(
  colDef: ColDef,
  props: GenericCellEditorProps<RowType, any, GridFormEditBearingProps<RowType>>,
) => {
  return GridPopoverEditBearingLike(
    { valueFormatter: bearingCorrectionValueFormatter, ...colDef },
    {
      editorParams: {
        placeHolder: "Enter bearing correction",
        multiEdit: !!props.editorParams?.multiEdit,
        range: (value: number | null) => {
          if (value === null) return "Bearing is required";
          if (value >= 360) return "Bearing must be less than 360 degrees";
          if (value <= -180) return "Bearing must be greater then -180 degrees";
          return null;
        },
        ...props.editorParams,
      },
    },
  );
};
