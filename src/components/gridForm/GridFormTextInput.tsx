import { useCallback, useState } from "react";
import { GenericCellEditorParams, GridFormProps } from "../GridCell";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { useGridPopoverHook } from "../GridPopoverHook";
import { GridBaseRow } from "../Grid";

export interface GridFormTextInputProps<RowType extends GridBaseRow> extends GenericCellEditorParams<RowType> {
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
  validate?: (value: string) => string | null;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
}

export const GridFormTextInput = <RowType extends GridBaseRow>(props: GridFormProps<RowType>) => {
  const formProps = props.formProps as GridFormTextInputProps<RowType>;
  const [value, setValue] = useState(props.value ?? "");

  const invalid = useCallback(() => {
    if (formProps.required && value.length == 0) {
      return `Some text is required`;
    }
    if (formProps.maxlength && value.length > formProps.maxlength) {
      return `Text must be no longer than ${formProps.maxlength} characters`;
    }
    if (formProps.validate) {
      return formProps.validate(value);
    }
    return null;
  }, [formProps, value]);

  const save = useCallback(
    async (selectedRows: any[]): Promise<boolean> => {
      if (invalid()) return false;

      if (props.value === (value ?? "")) return true;

      if (formProps.onSave) {
        return await formProps.onSave(selectedRows, value);
      }

      const field = props.field;
      if (field == null) {
        console.error("ColDef has no field set");
        return false;
      }
      selectedRows.forEach((row) => (row[field] = value));
      return true;
    },
    [invalid, props.value, props.field, value, formProps],
  );
  const { popoverWrapper, triggerSave } = useGridPopoverHook(props, save);

  return popoverWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: formProps.width ?? 240 }} className={"FormTest"}>
      <TextInputFormatted
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        formatted={""}
        inputProps={{
          style: { width: "100%" },
          placeholder: formProps.placeholder,
          onKeyDown: async (e) => e.key === "Enter" && triggerSave().then(),
        }}
      />
    </div>,
  );
};
