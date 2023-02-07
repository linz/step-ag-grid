import "./TextInputFormatted.scss";

import { DetailedHTMLProps, InputHTMLAttributes } from "react";

import clsx from "clsx";
import { omit } from "lodash-es";
import { FormError } from "./FormError";

export interface LuiTextInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  // overrides value in base class to be string type only
  value: string;

  // Custom fields
  helpText?: string;
  error?: JSX.Element | string | boolean | null;
  formatted?: string;
  allowTabToSave?: boolean;
}

export const TextInputFormatted = (props: LuiTextInputProps): JSX.Element => {
  return (
    <div className={clsx("LuiTextInput Grid-popoverContainer", props.error && "hasError", props.className)}>
      <span className="LuiTextInput-inputWrapper">
        {/* wrapper div used for error styling */}
        <input
          type={"text"}
          spellCheck={true}
          defaultValue={props.value}
          {...omit(props, ["error", "value", "helpText", "formatted", "className"])}
          className={"LuiTextInput-input"}
          onMouseEnter={(e) => {
            e.currentTarget.focus();
            props.onMouseEnter && props.onMouseEnter(e);
          }}
          data-allowtabtosave={props.allowTabToSave}
        />
        <span className={"LuiTextInput-formatted"}>{props.formatted}</span>
      </span>

      <FormError error={props.error} helpText={props.helpText} />
    </div>
  );
};
