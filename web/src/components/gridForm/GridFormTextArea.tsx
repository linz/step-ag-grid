import { useCallback, useState } from "react";
import { GridFormProps } from "../GridCell";
import { TextAreaInput } from "../../lui/TextArea";
import { useGridPopoutHook } from "../GridPopoutHook";
import { GridBaseRow } from "../Grid";

export interface GridFormTextAreaProps<RowType> {
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
}

export const GridFormTextArea = <RowType extends GridBaseRow>(props: GridFormProps<RowType>) => {
  const formProps = props.formProps as GridFormTextAreaProps<RowType>;
  const [value, setValue] = useState(props.value ?? "");

  const invalid = useCallback(() => {
    if (formProps.required && value.length == 0) {
      return `Some text is required`;
    }
    if (formProps.maxlength && value.length > formProps.maxlength) {
      return `Text must be no longer than ${formProps.maxlength} characters`;
    }
  }, [formProps.maxlength, formProps.required, value.length]);

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
    [formProps, invalid, props.field, props.value, value],
  );
  const { popoutWrapper } = useGridPopoutHook(props, save);

  return popoutWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: formProps.width ?? 240 }} className={"FormTest"}>
      <TextAreaInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        inputProps={{ placeholder: formProps.placeholder }}
      />
    </div>,
  );
};
