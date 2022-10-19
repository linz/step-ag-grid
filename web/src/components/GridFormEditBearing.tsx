import "./GridFormEditBearing.scss";

import { useCallback, useState } from "react";
import { wait } from "../utils/util";
import { BaseGridRow } from "./Grid";
import { TextInputFormatted } from "../lui/TextInputFormatted";
import { GridGenericCellEditorFormContextParams } from "./GridGenericCellEditor";
import { bearingNumberParser, bearingStringValidator, convertDDToDMS } from "../utils/bearing";

export interface GridFormEditBearingProps {
  placeHolder: string;
}

export const GridFormEditBearing = (props: GridFormEditBearingProps): JSX.Element => {
  const { saveRef, cellEditorParamsRef, triggerSave } = props as any as GridGenericCellEditorFormContextParams;
  const cellEditorParams = cellEditorParamsRef.current;
  const field = cellEditorParams.colDef.field ?? "fieldNotDefinedInColDef";
  saveRef.current = async (): Promise<boolean> => true;

  const [value, setValue] = useState<string>(cellEditorParams.value == null ? "" : `${cellEditorParams.value}`);

  saveRef.current = useCallback(
    async (selectedRows: BaseGridRow[]): Promise<boolean> => {
      if (bearingStringValidator(value)) return false;
      selectedRows.forEach((row) => ((row as Record<string, any>)[field] = value == "" ? null : parseFloat(value)));
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
