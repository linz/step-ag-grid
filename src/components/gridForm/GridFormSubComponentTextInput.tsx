import { useCallback, useContext, useEffect } from "react";
import { GridSubComponentContext } from "../../contexts/GridSubComponentContext";
import { TextInputFormatted } from "../../lui/TextInputFormatted";

export interface GridFormSubComponentTextInputProps {
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  width?: string | number;
  validate?: (value: string) => string | null;
  defaultValue: string;
  className?: string;
  helpText?: string;
}

export const GridFormSubComponentTextInput = (props: GridFormSubComponentTextInputProps): JSX.Element => {
  const { value, setValue, setValid, triggerSave } = useContext(GridSubComponentContext);

  const helpText = props.helpText ?? "Press enter or tab to save";

  // If is not initialised yet as it's just been created then set the default value
  useEffect(() => {
    if (value == null) setValue(props.defaultValue);
  }, [props.defaultValue, setValue, value]);

  const validate = useCallback(
    (value: string | null) => {
      if (value == null) return null;
      // This can happen because subcomponent is invoked without type safety
      if (typeof value !== "string") {
        console.error("Value is not a string", value);
      }
      if (props.required && value.length === 0) {
        return `Some text is required`;
      }
      if (props.maxLength && value.length > props.maxLength) {
        return `Text must be no longer than ${props.maxLength} characters`;
      }
      if (props.validate) {
        return props.validate(value);
      }
      return null;
    },
    [props],
  );

  useEffect(() => {
    setValid(value != null && validate(value) == null);
  }, [setValid, validate, value]);

  return (
    <TextInputFormatted
      value={value}
      error={validate(value)}
      onChange={(e) => setValue(e.target.value)}
      helpText={helpText}
      autoFocus={true}
      onKeyUp={(e) => {
        if (e.key === "Enter" || (e.key == "Tab" && !e.shiftKey)) {
          e.preventDefault();
          e.stopPropagation();
          triggerSave().then();
        }
      }}
      placeholder={props.placeholder}
      style={{
        width: "100%",
      }}
    />
  );
};
