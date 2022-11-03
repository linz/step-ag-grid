import { useCallback, useState } from "react";
import { TextAreaInput } from "../../lui/TextAreaInput";
import { useGridPopoverHook } from "../GridPopoverHook";
import { GridBaseRow } from "../Grid";
import { CellParams } from "@components/GridCell";

export interface GridFormTextAreaProps<RowType extends GridBaseRow> {
  multiEdit?: boolean;
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
  validate?: (value: string) => string | null;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
}

export const GridFormTextArea = <RowType extends GridBaseRow>(
  props: GridFormTextAreaProps<RowType> & CellParams<RowType>,
) => {
  const [value, setValue] = useState(props.value ?? "");

  const invalid = useCallback(() => {
    if (props.required && value.length == 0) {
      return `Some text is required`;
    }
    if (props.maxlength && value.length > props.maxlength) {
      return `Text must be no longer than ${props.maxlength} characters`;
    }
    if (props.validate) {
      return props.validate(value);
    }
    return null;
  }, [props, value]);

  const save = useCallback(
    async (selectedRows: any[]): Promise<boolean> => {
      if (invalid()) return false;

      if (props.value === (value ?? "")) return true;

      if (props.onSave) {
        return await props.onSave(selectedRows, value);
      }

      const field = props.field;
      if (field == null) {
        console.error("ColDef has no field set");
        return false;
      }
      selectedRows.forEach((row) => (row[field] = value));
      return true;
    },
    [props, invalid, value],
  );
  const { popoverWrapper } = useGridPopoverHook({ save });
  return popoverWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: props.width ?? 240 }} className={"FormTest"}>
      <TextAreaInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        inputProps={{ placeholder: props.placeholder }}
      />
    </div>,
  );
};
