import { useCallback, useContext, useEffect } from "react";
import { GridSubComponentContext } from "../../contexts/GridSubComponentContext";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { TextInputValidator, TextInputValidatorProps } from "../../utils/textValidator";
import { CellEditorCommon } from "../GridCell";

export interface GridFormSubComponentTextInputProps extends TextInputValidatorProps, CellEditorCommon {
  placeholder?: string;
  width?: string | number;
  defaultValue: string;
  helpText?: string;
}

export const GridFormSubComponentTextInput = (props: GridFormSubComponentTextInputProps): JSX.Element => {
  const { value, setValue, setValid, triggerSave } = useContext(GridSubComponentContext);

  const helpText = props.helpText ?? "Press enter or tab to save";

  // If is not initialised yet as it's just been created then set the default value
  useEffect(() => {
    if (value == null) setValue(props.defaultValue);
  }, [props.defaultValue, setValue, value]);

  const invalid = useCallback(() => TextInputValidator(props, value), [props, value]);

  useEffect(() => {
    setValid(value != null && invalid() == null);
  }, [setValid, invalid, value]);

  return (
    <TextInputFormatted
      value={value}
      error={invalid()}
      onChange={(e) => setValue(e.target.value)}
      helpText={helpText}
      autoFocus={true}
      onKeyDown={(e) => {
        if (e.key === "Tab" || e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          e.stopPropagation();
          !e.shiftKey && triggerSave().then();
        } else if (e.key === "Enter") {
          triggerSave().then();
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      placeholder={props.placeholder}
      style={{
        width: "100%",
      }}
    />
  );
};
