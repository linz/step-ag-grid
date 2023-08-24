import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

import {
  bearingCorrectionRangeValidator,
  bearingCorrectionValueFormatter,
  bearingRangeValidator,
  bearingValueFormatter,
} from "../../utils/bearing";
import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormEditBearing, GridFormEditBearingProps } from "../gridForm/GridFormEditBearing";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

const GridPopoverEditBearingLike = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<GridFormEditBearingProps<RowType>> & {
    editorParams: { formatValue: (value: any) => any };
  },
): ColDefT<RowType> =>
  GridCell(
    {
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
  range: bearingRangeValidator,
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
  range: bearingCorrectionRangeValidator,
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
