import "./GridFormEditBearing.scss";

import { useCallback, useContext, useState } from "react";
import { BaseGridRow } from "../Grid";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { bearingNumberParser, bearingStringValidator, convertDDToDMS } from "../../utils/bearing";
import { GridContext } from "../../contexts/GridContext";
import { MyFormProps } from "../GridCell";
import { useGridPopoutHook } from "../GridPopoutHook";

export interface GridFormEditBearingProps<RowType extends BaseGridRow> {
  placeHolder: string;
  onSave?: (selectedRows: RowType[], value: number | null) => Promise<boolean>;
}

export const GridFormEditBearing = <RowType extends BaseGridRow>(props: MyFormProps) => {
  const { colDef } = props.cellEditorParams;
  const formProps: GridFormEditBearingProps<RowType> = colDef.cellEditorParams.formProps;
  const { getSelectedRows } = useContext(GridContext);
  const field = colDef.field;
  const [value, setValue] = useState<string>(
    props.cellEditorParams?.value == null ? "" : `${props.cellEditorParams.value}`,
  );

  const save = useCallback(async (): Promise<boolean> => {
    return await props.updateValue(async () => {
      if (bearingStringValidator(value)) return false;
      const parsedValue = bearingNumberParser(value);
      if (formProps.onSave) {
        return await formProps.onSave(getSelectedRows(), parsedValue);
      } else {
        if (field == null) {
          console.error("field is not defined in ColDef");
        } else {
          getSelectedRows().forEach((row) => ((row as Record<string, any>)[field] = parsedValue));
        }
      }
      return true;
    });
  }, [field, formProps, getSelectedRows, props, value]);
  const { popoutWrapper } = useGridPopoutHook(props.cellEditorParams, save);

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
          onKeyDown: async (e) => e.key === "Enter" && save().then(),
        }}
        formatted={bearingStringValidator(value) ? "?" : convertDDToDMS(bearingNumberParser(value))}
        error={bearingStringValidator(value)}
      />
    </div>,
  );
};
