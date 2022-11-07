import { useCallback, useState } from "react";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { useGridPopoverHook } from "../GridPopoverHook";
import { GridBaseRow } from "../Grid";
import { CellEditorCommon, CellParams } from "../GridCell";

export interface GridFormTextInputProps<RowType extends GridBaseRow> extends CellEditorCommon {
  placeholder?: string;
  units?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
  // Return null for ok, otherwise an error string
  validate?: (value: string, data: RowType) => string | null;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
}

export const GridFormTextInput = <RowType extends GridBaseRow>(_props: GridFormTextInputProps<RowType>) => {
  const props = _props as GridFormTextInputProps<RowType> & CellParams<RowType>;
  const initValue = props.value == null ? "" : `${props.value}`;
  const [value, setValue] = useState(initValue);

  const invalid = useCallback(() => {
    const trimmedValue = value.trim();
    if (props.required && trimmedValue.length == 0) {
      return `Some text is required`;
    }
    if (props.maxlength && trimmedValue.length > props.maxlength) {
      return `Text must be no longer than ${props.maxlength} characters`;
    }
    if (props.validate) {
      return props.validate(trimmedValue, props.data);
    }
    return null;
  }, [props, value]);

  const save = useCallback(
    async (selectedRows: any[]): Promise<boolean> => {
      if (invalid()) return false;
      const trimmedValue = value.trim();
      if (initValue === trimmedValue) return true;

      if (props.onSave) {
        return await props.onSave(selectedRows, trimmedValue);
      }

      const field = props.field;
      if (field == null) {
        console.error("ColDef has no field set");
        return false;
      }
      selectedRows.forEach((row) => (row[field] = trimmedValue));
      return true;
    },
    [invalid, value, initValue, props],
  );
  const { popoverWrapper, triggerSave } = useGridPopoverHook({ className: props.className, save });

  return popoverWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: props.width ?? 240 }} className={"FormTest"}>
      <TextInputFormatted
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        formatted={props.units}
        onMouseEnter={(e) => {
          if (document.activeElement != e.currentTarget) {
            e.currentTarget.focus();
            e.currentTarget.selectionStart = e.currentTarget.value.length;
          }
        }}
        inputProps={{
          style: { width: "100%" },
          placeholder: props.placeholder,
          onKeyDown: async (e) => e.key === "Enter" && triggerSave().then(),
        }}
      />
    </div>,
  );
};
