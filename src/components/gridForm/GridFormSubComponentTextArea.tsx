import { useCallback, useContext, useEffect } from "react";
import { GridSubComponentContext } from "../../contexts/GridSubComponentContext";
import { CellEditorCommon } from "../GridCell";
import clsx from "clsx";
import { TextAreaInput } from "../../lui/TextAreaInput";
import { TextInputValidator, TextInputValidatorProps } from "../../utils/textValidator";
import { GridBaseRow } from "../Grid";

export interface GridSubComponentTextAreaProps<RowType extends GridBaseRow>
  extends TextInputValidatorProps<RowType>,
    CellEditorCommon {
  placeholder?: string;
  width?: string | number;
  defaultValue: string;
  className?: string;
  helpText?: string;
}

export const GridFormSubComponentTextArea = <RowType extends GridBaseRow>(
  props: GridSubComponentTextAreaProps<RowType>,
): JSX.Element => {
  const { value, data, setValue, setValid, context } = useContext(GridSubComponentContext);

  const helpText = props.helpText ?? "Press tab to save";

  // If is not initialised yet as it's just been created then set the default value
  useEffect(() => {
    if (value == null) setValue(props.defaultValue);
  }, [props.defaultValue, setValue, value]);

  const invalid = useCallback(() => TextInputValidator(props, value, data, context), [data, props, value, context]);

  useEffect(() => {
    setValid(value != null && invalid() == null);
  }, [setValid, invalid, value]);

  return (
    <div className={clsx("FreeTextInput", props.className)}>
      <TextAreaInput
        className={"free-text-input"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        helpText={helpText}
        autoFocus={true}
        placeholder={props.placeholder}
      />
    </div>
  );
};
