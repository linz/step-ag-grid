import "./GridPopoutEditGenericInput.scss";

import { ColDef } from "ag-grid-community";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./Grid";
import { GridGenericCellRendererComponent } from "./GridGenericCellRenderer";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridPopoutEditGenericInputColDef, GridPopoutEditGenericInputComp } from "./GridPopoutEditGenericInput";
import { convertDDToDMS } from "../utils/bearing";

const bearingValueFormatter = (params: ValueFormatterParams): string => {
  const value = params.value;
  if (value == null) {
    return "-";
  }
  return convertDDToDMS(value);
};

const bearingNumberFormatter = (params: ValueFormatterParams): string => {
  const value = params.value;
  if (value == null) {
    return "-";
  }
  return convertDDToDMS(value);
};

const bearingNumberParser = (value: string): number | null => {
  if (value === "") return null;
  return parseFloat(value);
};

const validMaskForDmsBearing = /^(\d+)?(\.([0-5](\d([0-5](\d(\d+)?)?)?)?)?)?$/;
const bearingStringValidator = (value: string): string | undefined => {
  value = value.trim();
  if (value === "") return undefined;
  const match = value.match(validMaskForDmsBearing);
  if (!match) return "Bearing must be a positive number in D.MMSSS format";
  const decimalPart = match[3];
  if (decimalPart != null && decimalPart.length > 5) {
    return "Bearing has a maximum of 5 decimal places";
  }

  const bearing = parseFloat(value);
  if (bearing >= 360) return "Bearing must be between 0 and 360 inclusive";
};

/**
 * For editing a text area.
 */
export const GridPopoutEditBearing = <RowType extends BaseAgGridRow, ValueType>(
  props: GridPopoutEditGenericInputColDef<RowType>,
): ColDef => ({
  ...props,
  valueFormatter: bearingValueFormatter,
  cellRenderer: GridGenericCellRendererComponent,
  cellRendererParams: {
    ...props.cellRendererParams,
  },
  editable: props.editable ?? true,
  cellEditor: GridPopoutEditGenericInputComp,
  cellEditorParams: {
    formatter: bearingNumberFormatter,
    parser: bearingNumberParser,
    validator: bearingStringValidator,
    ...props?.cellEditorParams,
  },
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});
