import { useCallback, useState } from "react";
import { TextAreaInput } from "../../lui/TextAreaInput";
import { useGridPopoverHook } from "../GridPopoverHook";
import { GridBaseRow } from "../Grid";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";

export interface GridFormTextAreaProps<RowType extends GridBaseRow> extends CellEditorCommon {
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  width?: string | number;
  validate?: (value: string) => string | null;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
  helpText?: string;
}

export const GridFormTextArea = <RowType extends GridBaseRow>(props: GridFormTextAreaProps<RowType>) => {
  const { field, value: initialVale } = useGridPopoverContext<RowType>();
  const [value, setValue] = useState(initialVale != null ? `${initialVale}` : "");

  const helpText = props.helpText ?? "Press ctrl+enter or tab to save";

  const invalid = useCallback(() => {
    if (props.required && value.length == 0) {
      return `Some text is required`;
    }
    if (props.maxLength && value.length > props.maxLength) {
      return `Text must be no longer than ${props.maxLength} characters`;
    }
    if (props.validate) {
      return props.validate(value);
    }
    return null;
  }, [props, value]);

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (invalid()) return false;

      if (initialVale === (value ?? "")) return true;

      if (props.onSave) {
        return await props.onSave(selectedRows, value);
      }

      if (field == null) {
        console.error("ColDef has no field set");
        return false;
      }
      selectedRows.forEach((row) => {
        row[field] = value as any;
      });
      return true;
    },
    [invalid, initialVale, value, props, field],
  );
  const { popoverWrapper, triggerSave } = useGridPopoverHook({ className: props.className, save });
  return popoverWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: props.width ?? 240 }}>
      <TextAreaInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        placeholder={props.placeholder}
        helpText={helpText}
        onKeyDown={(e) => {
          if ((e.key === "Enter" && e.ctrlKey) || e.key == "Tab") {
            triggerSave().then();
          }
        }}
      />
    </div>,
  );
};
