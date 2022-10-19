import "./GridFormEditBearing.scss";

import { useCallback, useState } from "react";
import { BaseGridRow } from "./Grid";
import { TextInputFormatted } from "../lui/TextInputFormatted";
import { GridGenericCellEditorFormContextParams } from "./GridGenericCellEditor";
import { bearingNumberParser, bearingStringValidator, convertDDToDMS } from "../utils/bearing";

export interface GridFormEditBearingProps<RowType extends BaseGridRow> {
  placeHolder: string;
  onSave?: (selectedRows: RowType[], value: number | null) => Promise<boolean>;
}

export const GridFormEditBearing = <RowType extends BaseGridRow>(
  props: GridFormEditBearingProps<RowType>,
): JSX.Element => {
  const { saveRef, cellEditorParamsRef, triggerSave } = props as any as GridGenericCellEditorFormContextParams;
  const cellEditorParams = cellEditorParamsRef.current;
  const field = cellEditorParams.colDef.field;
  saveRef.current = async (): Promise<boolean> => true;

  const [value, setValue] = useState<string>(cellEditorParams.value == null ? "" : `${cellEditorParams.value}`);

  saveRef.current = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (bearingStringValidator(value)) return false;
      const parsedValue = bearingNumberParser(value);
      if (props.onSave) {
        await props.onSave(selectedRows, parsedValue);
      } else {
        if (field == null) {
          console.error("field is not defined in ColDef");
        } else {
          selectedRows.forEach((row) => ((row as Record<string, any>)[field] = parsedValue));
        }
      }
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
