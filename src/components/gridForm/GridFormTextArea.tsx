import { useCallback, useState } from "react";
import { TextAreaInput } from "../../lui/TextAreaInput";
import { useGridPopoverHook } from "../GridPopoverHook";
import { GridBaseRow } from "../Grid";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { TextInputValidator, TextInputValidatorProps } from "../../utils/textValidator";

export interface GridFormTextAreaProps<RowType extends GridBaseRow> extends TextInputValidatorProps, CellEditorCommon {
  placeholder?: string;
  width?: string | number;
  onSave?: (selectedRows: RowType[], value: string) => Promise<boolean>;
  helpText?: string;
}

export const GridFormTextArea = <RowType extends GridBaseRow>(props: GridFormTextAreaProps<RowType>) => {
  const { field, value: initialVale } = useGridPopoverContext<RowType>();
  const [value, setValue] = useState(initialVale != null ? `${initialVale}` : "");

  const helpText = props.helpText ?? "Press tab to save";

  const invalid = useCallback(() => TextInputValidator(props, value), [props, value]);

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
  const { popoverWrapper, lastInputKeyboardEventHandlers } = useGridPopoverHook({ className: props.className, save });
  return popoverWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: props.width ?? 240 }}>
      <TextAreaInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        placeholder={props.placeholder}
        helpText={helpText}
        {...lastInputKeyboardEventHandlers}
      />
    </div>,
  );
};
