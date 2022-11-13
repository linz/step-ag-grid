import { useCallback, useState } from "react";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { useGridPopoverHook } from "../GridPopoverHook";
import { GridBaseRow } from "../Grid";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";

export interface GridFormTextInputProps<RowType extends GridBaseRow> extends CellEditorCommon {
  placeholder?: string;
  units?: string;
  required?: boolean;
  maxLength?: number;
  width?: string | number;
  // Return null for ok, otherwise an error string
  validate?: (value: string, data: RowType) => string | null;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
}

export const GridFormTextInput = <RowType extends GridBaseRow>(props: GridFormTextInputProps<RowType>) => {
  const { field, data, value: initialVale } = useGridPopoverContext<RowType>();

  const initValue = initialVale == null ? "" : `${initialVale}`;
  const [value, setValue] = useState(initValue);

  const invalid = useCallback(() => {
    const trimmedValue = value.trim();
    if (props.required && trimmedValue.length == 0) {
      return `Some text is required`;
    }
    if (props.maxLength && trimmedValue.length > props.maxLength) {
      return `Text must be no longer than ${props.maxLength} characters`;
    }
    if (props.validate) {
      return props.validate(trimmedValue, data);
    }
    return null;
  }, [data, props, value]);

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (invalid()) return false;
      const trimmedValue = value.trim();
      if (initValue === trimmedValue) return true;

      if (props.onSave) {
        return await props.onSave(selectedRows, trimmedValue);
      }

      if (field == null) {
        console.error("ColDef has no field set");
        return false;
      }
      selectedRows.forEach((row) => {
        row[field] = trimmedValue as any;
      });
      return true;
    },
    [invalid, value, initValue, props, field],
  );
  const { popoverWrapper, triggerSave } = useGridPopoverHook({ className: props.className, save });

  return popoverWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: props.width ?? 240 }} className={"FormTest"}>
      <TextInputFormatted
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        formatted={props.units}
        style={{ width: "100%" }}
        placeholder={props.placeholder}
        onKeyDown={(e) => e.key === "Enter" && triggerSave().then()}
      />
    </div>,
  );
};
