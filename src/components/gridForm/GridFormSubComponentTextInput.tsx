import { useCallback, useContext, useEffect } from "react";
import { GridSubComponentContext } from "../../contexts/GridSubComponentContext";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { TextInputValidator, TextInputValidatorProps } from "../../utils/textValidator";
import { CellEditorCommon } from "../GridCell";
import { GridBaseRow } from "../Grid";

export interface GridFormSubComponentTextInputProps<RowType extends GridBaseRow>
  extends TextInputValidatorProps<RowType>,
    CellEditorCommon {
  placeholder?: string;
  width?: string | number;
  defaultValue: string;
  helpText?: string;
}

export const GridFormSubComponentTextInput = <RowType extends GridBaseRow>(
  props: GridFormSubComponentTextInputProps<RowType>,
): JSX.Element => {
  const { value, setValue, setValid, data, context } = useContext(GridSubComponentContext);

  const helpText = props.helpText ?? "Press enter or tab to save";

  // If is not initialised yet as it's just been created then set the default value
  useEffect(() => {
    if (value == null) setValue(props.defaultValue);
  }, [props.defaultValue, setValue, value]);

  const invalid = useCallback(() => TextInputValidator(props, value, data, context), [context, data, props, value]);

  useEffect(() => {
    setValid(value != null && invalid() == null);
  }, [setValid, invalid, value]);

  return (
    <TextInputFormatted
      value={value}
      error={invalid()}
      onChange={(e) => setValue(e.target.value)}
      helpText={helpText}
      placeholder={props.placeholder}
      style={{ width: "100%" }}
      allowTabToSave={true}
    />
  );
};
