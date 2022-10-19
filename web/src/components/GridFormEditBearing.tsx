import "./GridFormEditBearing.scss";

import { useCallback, useState } from "react";
import { wait } from "../utils/util";
import { BaseGridRow } from "./Grid";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { TextInputFormatted } from "../lui/TextInputFormatted";
import { GridGenericCellEditorFormContextParams } from "./GridGenericCellEditor";
import { convertDDToDMS } from "../utils/bearing";

const bearingValueFormatter = (params: ValueFormatterParams): string => {
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

export interface GridFormEditBearingProps {
  placeHolder: string;
}

export const GridFormEditBearing = (props: GridFormEditBearingProps): JSX.Element => {
  const { saveRef, cellEditorParamsRef, triggerSave } = props as any as GridGenericCellEditorFormContextParams;
  const cellEditorParams = cellEditorParamsRef.current;
  const { field } = cellEditorParams.colDef;
  saveRef.current = async (): Promise<boolean> => true;

  const [value, setValue] = useState<string>(`${cellEditorParams.value}`);

  saveRef.current = useCallback(
    async (selectedRows: BaseGridRow[]): Promise<boolean> => {
      if (bearingStringValidator(value)) return false;
      // eslint-disable-next-line no-console
      console.log("onSave", selectedRows, value);

      selectedRows.forEach((row) => (row[field as keyof BaseGridRow] = value));
      await wait(1000);
      return true;
    },
    [value, field],
  );

  return (
    <div className={"GridFormEditBearing-input"}>
      <TextInputFormatted
        value={value ?? ""}
        onChange={(e) => {
          setValue(e.target.value.trim());
        }}
        inputProps={{
          autoFocus: true,
          placeholder: props.placeHolder,
          disabled: false,
          maxLength: 16,
          onKeyDown: async (e) => e.key === "Enter" && triggerSave().then(),
        }}
        formatted={bearingStringValidator(value) ? "?" : convertDDToDMS(bearingNumberParser(value))}
        error={bearingStringValidator(value)}
      />
    </div>
  );
};
