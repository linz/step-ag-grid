import { useCallback, useEffect } from "react";
import { GridSubComponentProps } from "./gridForm/GridSubComponentProps";
import { TextInputFormatted } from "../lui/TextInputFormatted";

export interface GridSubComponentTextAreaProps extends GridSubComponentProps {
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
  validate: (value: string) => string | null;
}

export const GridSubComponentTextArea = (props: GridSubComponentTextAreaProps): JSX.Element => {
  const { value, setValue, setValid, triggerSave } = props;
  const validate = useCallback(
    (value: string) => {
      if (props.required && value.length === 0) {
        return `Some text is required`;
      }
      if (props.maxlength && value.length > props.maxlength) {
        return `Text must be no longer than ${props.maxlength} characters`;
      }
      if (props.validate) {
        return props.validate(value);
      }
      return null;
    },
    [props],
  );

  useEffect(() => {
    setValid(validate(value) == null);
  }, [setValid, validate, value]);

  return (
    <div className={"FreeTextInput LuiDeprecatedForms"}>
      <TextInputFormatted
        className={"free-text-input"}
        value={value}
        onMouseEnter={(e) => {
          if (document.activeElement != e.currentTarget) {
            e.currentTarget.focus();
            e.currentTarget.selectionStart = e.currentTarget.value.length;
          }
        }}
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
