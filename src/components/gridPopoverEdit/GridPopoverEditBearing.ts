import { ValueFormatterParams } from "ag-grid-community";

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

const GridPopoverEditBearingLike = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  props: GenericCellEditorProps<GridFormEditBearingProps<TData>> & {
    editorParams: { formatValue: (value: any) => any };
  },
): ColDefT<TData, TValue> =>
  GridCell<TData, TValue, GridFormEditBearingProps<TData>>(
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

export const GridPopoverEditBearing = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  props: GenericCellEditorProps<GridFormEditBearingProps<TData>>,
): ColDefT<TData, TValue> =>
  GridPopoverEditBearingLike<TData, TValue>(colDef, {
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

export const GridPopoverEditBearingCorrection = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  props: GenericCellEditorProps<GridFormEditBearingProps<TData>>,
): ColDefT<TData, TValue> =>
  GridPopoverEditBearingLike<TData, TValue>(colDef, {
    multiEdit: !!props.multiEdit,
    editorParams: {
      ...GridPopoverEditBearingCorrectionEditorParams,
      ...props.editorParams,
    },
  });
