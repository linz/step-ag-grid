import { useCallback, useContext, useEffect } from "react";
import { GridSubComponentContext } from "../../contexts/GridSubComponentContext";
import { CellEditorCommon } from "../GridCell";
import clsx from "clsx";
import { TextAreaInput } from "../../lui/TextAreaInput";
import { TextInputValidator, TextInputValidatorProps } from "../../utils/textValidator";

export interface GridSubComponentTextAreaProps extends TextInputValidatorProps, CellEditorCommon {
  placeholder?: string;
  width?: string | number;
  defaultValue: string;
  className?: string;
  helpText?: string;
}

export const GridFormSubComponentTextArea = (props: GridSubComponentTextAreaProps): JSX.Element => {
  const { value, setValue, setValid, triggerSave } = useContext(GridSubComponentContext);

  const helpText = props.helpText ?? "Press tab to save";

  // If is not initialised yet as it's just been created then set the default value
  useEffect(() => {
    if (value == null) setValue(props.defaultValue);
  }, [props.defaultValue, setValue, value]);

  const invalid = useCallback(() => TextInputValidator(props, value), [props]);

  useEffect(() => {
    setValid(value != null && invalid() == null);
  }, [setValid, invalid, value]);

  return (
    <div className={clsx("FreeTextInput LuiDeprecatedForms", props.className)}>
      <TextAreaInput
        className={"free-text-input"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        helpText={helpText}
        autoFocus={true}
        placeholder={props.placeholder}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Tab") {
            !e.shiftKey && triggerSave().then();
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      />
    </div>
  );
};
