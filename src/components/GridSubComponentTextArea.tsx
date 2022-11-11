import { useCallback, useContext, useEffect } from "react";
import { TextInputFormatted } from "../lui/TextInputFormatted";
import { GridSubComponentContext } from "../contexts/GridSubComponentContext";

export interface GridSubComponentTextAreaProps {
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  width?: string | number;
  validate?: (value: string) => string | null;
  defaultValue: string;
}

export const GridSubComponentTextArea = (props: GridSubComponentTextAreaProps): JSX.Element => {
  const { value, setValue, setValid, triggerSave } = useContext(GridSubComponentContext);

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
    <div className={"FreeTextInput LuiDeprecatedForms"}>
      <TextInputFormatted
        className={"free-text-input"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={validate(value)}
        inputProps={{
          autoFocus: true,
          placeholder: props.placeholder,
          onKeyDown: async (e) => e.key === "Enter" && triggerSave().then(),
        }}
      />
    </div>
  );
};
