import "../../styles/GridFormEditBearing.scss";

import { useCallback, useState } from "react";
import { GridBaseRow } from "../Grid";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { bearingNumberParser, bearingStringValidator, convertDDToDMS } from "../../utils/bearing";
import { useGridPopoverHook } from "../GridPopoverHook";
import { CellEditorCommon, CellParams } from "../../components/GridCell";

export interface GridFormEditBearingProps<RowType extends GridBaseRow> extends CellEditorCommon {
  placeHolder?: string;
  range?: (value: number | null) => string | null;
  onSave?: (selectedRows: RowType[], value: number | null) => Promise<boolean>;
}

export const GridFormEditBearing = <RowType extends GridBaseRow>(_props: GridFormEditBearingProps<RowType>) => {
  const props = _props as GridFormEditBearingProps<RowType> & CellParams<RowType>;
  const [value, setValue] = useState<string>(`${props.value ?? ""}`);
  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (bearingStringValidator(value)) return false;
      const parsedValue = bearingNumberParser(value);
      // Value didn't change so don't save just cancel
      if (parsedValue === props.value) {
        return true;
      }

      if (props.onSave) {
        return await props.onSave(selectedRows, parsedValue);
      } else {
        const field = props.field;
        if (field == null) {
          console.error("field is not defined in ColDef");
        } else {
          selectedRows.forEach((row) => ((row as Record<string, any>)[field] = parsedValue));
        }
      }
      return true;
    },
    [props, value],
  );
  const { triggerSave, popoverWrapper } = useGridPopoverHook({ className: props.className, save });

  return popoverWrapper(
    <div className={"GridFormEditBearing-input Grid-popoverContainer"}>
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
        formatted={bearingStringValidator(value, props.range) ? "?" : convertDDToDMS(bearingNumberParser(value))}
        error={bearingStringValidator(value, props.range)}
      />
    </div>,
  );
};
