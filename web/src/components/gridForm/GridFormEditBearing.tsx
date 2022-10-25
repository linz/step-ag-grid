import "./GridFormEditBearing.scss";

import { useCallback, useState } from "react";
import { BaseGridRow } from "../Grid";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { bearingNumberParser, bearingStringValidator, convertDDToDMS } from "../../utils/bearing";
import { MyFormProps } from "../GridCell";
import { useGridPopoutHook } from "../GridPopoutHook";

export interface GridFormEditBearingProps<RowType extends BaseGridRow> {
  placeHolder: string;
  onSave?: (selectedRows: RowType[], value: number | null) => Promise<boolean>;
}

export const GridFormEditBearing = <RowType extends BaseGridRow>(props: MyFormProps) => {
  const { colDef } = props.cellEditorParams;
  const formProps: GridFormEditBearingProps<RowType> = colDef.cellEditorParams;
  const field = colDef.field;
  const [value, setValue] = useState<string>(
    props.cellEditorParams?.value == null ? "" : `${props.cellEditorParams.value}`,
  );

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (bearingStringValidator(value)) return false;
      const parsedValue = bearingNumberParser(value);
      // Value didn't change so don't save just cancel
      if (parsedValue === props.cellEditorParams?.value) {
        return true;
      }
      if (formProps.onSave) {
        return await formProps.onSave(selectedRows, parsedValue);
      } else {
        if (field == null) {
          console.error("field is not defined in ColDef");
        } else {
          selectedRows.forEach((row) => ((row as Record<string, any>)[field] = parsedValue));
        }
      }
      return true;
    },
    [field, formProps, value],
  );
  const { popoutWrapper, triggerSave } = useGridPopoutHook(props, save);

  return popoutWrapper(
    <div className={"GridFormEditBearing-input"}>
      <TextInputFormatted
        value={value ?? ""}
        onChange={(e) => {
          setValue(e.target.value.trim());
        }}
        inputProps={{
          autoFocus: true,
          placeholder: formProps.placeHolder,
          disabled: false,
          maxLength: 16,
          onKeyDown: async (e) => e.key === "Enter" && triggerSave().then(),
        }}
        formatted={bearingStringValidator(value) ? "?" : convertDDToDMS(bearingNumberParser(value))}
        error={bearingStringValidator(value)}
      />
    </div>,
  );
};
