import "../../styles/GridFormEditBearing.scss";

import { useCallback, useMemo, useState } from "react";
import { GridBaseRow } from "../Grid";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { bearingNumberParser, bearingStringValidator, convertDDToDMS } from "../../utils/bearing";
import { useGridPopoverHook } from "../GridPopoverHook";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";

export interface GridFormEditBearingProps<RowType extends GridBaseRow> extends CellEditorCommon {
  placeHolder?: string;
  range?: (value: number | null) => string | null;
  onSave?: (selectedRows: RowType[], value: number | null) => Promise<boolean>;
}

export const GridFormEditBearing = <RowType extends GridBaseRow>(props: GridFormEditBearingProps<RowType>) => {
  const { field, value: initialValue } = useGridPopoverContext<RowType>();

  // This clears out any scientific precision
  const defaultValue = useMemo(
    () => (initialValue == null ? "" : parseFloat(parseFloat(initialValue).toFixed(10)).toString()),
    [initialValue],
  );

  const [value, setValue] = useState<string>(defaultValue);

  const invalid = useCallback(() => bearingStringValidator(value, props.range), [props.range, value]);

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      const parsedValue = bearingNumberParser(value);
      // Value didn't change so don't save just cancel
      if (parsedValue === bearingNumberParser(defaultValue)) {
        return true;
      }

      if (props.onSave) {
        return await props.onSave(selectedRows, parsedValue);
      } else {
        if (field == null) {
          console.error("field is not defined in ColDef");
        } else {
          selectedRows.forEach((row) => {
            row[field] = parsedValue as any;
          });
        }
      }
      return true;
    },
    [defaultValue, field, props, value],
  );
  const { popoverWrapper, onlyInputKeyboardEventHandlers } = useGridPopoverHook({
    className: props.className,
    invalid,
    save,
  });

  return popoverWrapper(
    <div className={"GridFormEditBearing-input Grid-popoverContainer"}>
      <TextInputFormatted
        value={defaultValue}
        onChange={(e) => {
          setValue(e.target.value.trim());
        }}
        autoFocus={true}
        placeholder={props.placeHolder}
        {...onlyInputKeyboardEventHandlers}
        formatted={bearingStringValidator(value, props.range) ? "?" : convertDDToDMS(bearingNumberParser(value))}
        error={bearingStringValidator(value, props.range)}
        helpText={"Press enter or tab to save"}
      />
    </div>,
  );
};
