import { bearingCorrectionValueFormatter, bearingValueFormatter } from "../../utils/bearing";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormEditBearing, GridFormEditBearingProps } from "../gridForm/GridFormEditBearing";
import { GridBaseRow } from "../Grid";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

const GridPopoverEditBearingLike = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormEditBearingProps<RowType>> & {
    editorParams: { formatValue: (value: any) => any };
  },
): ColDefT<RowType> =>
  GridCell(
    {
      initialWidth: 65,
      maxWidth: 150,
      valueFormatter: (params: ValueFormatterParams) => props.editorParams?.formatValue(params.value) ?? "",
      ...colDef,
    },
    {
      editor: GridFormEditBearing,
      ...props,
    },
  );

export const GridPopoverEditBearingEditorParams = {
  placeHolder: "Enter bearing",
  formatValue: bearingValueFormatter,
  range: (value: number | null) => {
    if (value === null) return "Bearing is required";
    if (value >= 360) return "Bearing must be less than 360 degrees";
    if (value < 0) return "Bearing must not be negative";
    return null;
  },
};

export const GridPopoverEditBearing = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormEditBearingProps<RowType>>,
): ColDefT<RowType> =>
  GridPopoverEditBearingLike(colDef, {
    multiEdit: !!props.multiEdit,
    editorParams: {
      ...GridPopoverEditBearingEditorParams,
      ...props.editorParams,
    },
  });

export const GridPopoverEditBearingCorrectionEditorParams = {
  placeHolder: "Enter bearing correction",
  formatValue: bearingCorrectionValueFormatter,
  range: (value: number | null) => {
    if (value === null) return "Bearing correction is required";
    if (value >= 360) return "Bearing correction must be less than 360 degrees";
    if (value <= -180) return "Bearing correction must be greater then -180 degrees";
    return null;
  },
};

export const GridPopoverEditBearingCorrection = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormEditBearingProps<RowType>>,
): ColDefT<RowType> =>
  GridPopoverEditBearingLike(colDef, {
    multiEdit: !!props.multiEdit,
    editorParams: {
      ...GridPopoverEditBearingCorrectionEditorParams,
      ...props.editorParams,
    },
  });
