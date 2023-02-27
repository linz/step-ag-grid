import { useCallback, useMemo, useState } from "react";

import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { TextAreaInput } from "../../lui/TextAreaInput";
import { TextInputValidator, TextInputValidatorProps } from "../../utils/textValidator";
import { GridBaseRow } from "../Grid";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverHook } from "../GridPopoverHook";

export interface GridFormTextAreaProps<RowType extends GridBaseRow>
  extends TextInputValidatorProps<RowType>,
    CellEditorCommon {
  placeholder?: string;
  width?: string | number;
  onSave?: (props: { selectedRows: RowType[]; value: string }) => Promise<boolean>;
  helpText?: string;
}

export const GridFormTextArea = <RowType extends GridBaseRow>(props: GridFormTextAreaProps<RowType>): JSX.Element => {
  const { field, value: initialVale, data } = useGridPopoverContext<RowType>();

  const initValue = useMemo(() => (initialVale == null ? "" : `${initialVale}`), [initialVale]);
  const [value, setValue] = useState(initValue);

  const helpText = props.helpText ?? "Press tab to save";

  const invalid = useCallback(() => TextInputValidator(props, value, data, {}), [props, value, data]);

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (invalid()) return false;

      const trimmedValue = value.trim();
      // No change, so don't save
      if (initValue === trimmedValue) return true;

      if (props.onSave) {
        return await props.onSave({ selectedRows, value: trimmedValue });
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
    <div className={"subComponent"} style={{ display: "flex", flexDirection: "row", width: props.width ?? 240 }}>
      <TextAreaInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        placeholder={props.placeholder ?? "Type here"}
        helpText={helpText}
      />
    </div>,
  );
};
