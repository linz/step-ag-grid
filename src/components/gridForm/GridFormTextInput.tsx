import { useCallback, useState } from "react";
import { GenericCellEditorParams, GridFormProps } from "../GridCell";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { useGridPopoverHook } from "../GridPopoverHook";
import { GridBaseRow } from "../Grid";

export interface GridFormTextInputProps<RowType extends GridBaseRow> extends GenericCellEditorParams<RowType> {
  placeholder?: string;
  units?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
  // Return null for ok, otherwise an error string
  validate?: (value: string, data: RowType) => string | null;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
}

export const GridFormTextInput = <RowType extends GridBaseRow>(props: GridFormProps<RowType>) => {
  const formProps = props.formProps as GridFormTextInputProps<RowType>;
  const initValue = props.value == null ? "" : `${props.value}`;
  const [value, setValue] = useState(initValue);

  const invalid = useCallback(() => {
    const trimmedValue = value.trim();
    if (formProps.required && trimmedValue.length == 0) {
      return `Some text is required`;
    }
    if (formProps.maxlength && trimmedValue.length > formProps.maxlength) {
      return `Text must be no longer than ${formProps.maxlength} characters`;
    }
    if (formProps.validate) {
      return formProps.validate(trimmedValue, props.data);
    }
    return null;
  }, [formProps, value]);

  const save = useCallback(
    async (selectedRows: any[]): Promise<boolean> => {
      if (invalid()) return false;
      const trimmedValue = value.trim();
      if (initValue === trimmedValue) return true;

      if (formProps.onSave) {
        return await formProps.onSave(selectedRows, trimmedValue);
      }

      const field = props.field;
      if (field == null) {
        console.error("ColDef has no field set");
        return false;
      }
      selectedRows.forEach((row) => (row[field] = trimmedValue));
      return true;
    },
    [invalid, value, initValue, formProps, props.field],
  );
  const { popoverWrapper, triggerSave } = useGridPopoverHook(props, save);

  return popoverWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: formProps.width ?? 240 }} className={"FormTest"}>
      <TextInputFormatted
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        formatted={formProps.units}
        inputProps={{
          style: { width: "100%" },
          placeholder: formProps.placeholder,
          onKeyDown: async (e) => e.key === "Enter" && triggerSave().then(),
        }}
      />
    </div>,
  );
};
