import { useCallback, useMemo, useState } from "react";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { useGridPopoverHook } from "../GridPopoverHook";
import { GridBaseRow } from "../Grid";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { TextInputValidator, TextInputValidatorProps } from "../../utils/textValidator";

export interface GridFormTextInputProps<RowType extends GridBaseRow>
  extends TextInputValidatorProps<RowType>,
    CellEditorCommon {
  placeholder?: string;
  units?: string;
  width?: string | number;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
  helpText?: string;
}

export const GridFormTextInput = <RowType extends GridBaseRow>(props: GridFormTextInputProps<RowType>) => {
  const { field, value: initialVale, data } = useGridPopoverContext<RowType>();

  const helpText = props.helpText ?? "Press enter or tab to save";

  const initValue = useMemo(() => (initialVale == null ? "" : `${initialVale}`), [initialVale]);
  const [value, setValue] = useState(initValue);

  const invalid = useCallback(() => TextInputValidator<RowType>(props, value, data, {}), [data, props, value]);

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (invalid()) return false;

      const trimmedValue = value.trim();
      // No change, so don't save
      if (initValue === trimmedValue) return true;

      if (props.onSave) {
        return await props.onSave(selectedRows, trimmedValue);
      }

      selectedRows.forEach((row) => (row[field] = trimmedValue as any));
      return true;
    },
    [invalid, value, initValue, props, field],
  );
  const { popoverWrapper } = useGridPopoverHook({
    className: props.className,
    invalid,
    save,
  });

  return popoverWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: props.width ?? 240 }} className={"FormTest"}>
      <TextInputFormatted
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        formatted={props.units}
        style={{ width: "100%" }}
        placeholder={props.placeholder}
        helpText={helpText}
      />
    </div>,
  );
};
