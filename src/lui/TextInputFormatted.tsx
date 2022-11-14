import "./TextInputFormatted.scss";

import { DetailedHTMLProps, InputHTMLAttributes } from "react";

import clsx from "clsx";
import { LuiIcon } from "@linzjs/lui";
import { omit } from "lodash-es";

export interface LuiTextInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  // overrides value in base class to be string type only
  value: string;

  // Custom fields
  helpText?: string;
  error?: string | boolean | null;
  formatted?: string;
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
        />
        <span className={"LuiTextInput-formatted"}>{props.formatted}</span>
      </span>

      {props.error && (
        <span className="LuiTextInput-error">
          <LuiIcon alt="error" name="ic_error" className="LuiTextInput-error-icon" size="sm" status="error" />
          {props.error}
        </span>
      )}

      {props.helpText && !props.error && (
        <span
          style={{
            fontSize: "0.7rem",
          }}
        >
          {props.helpText}
        </span>
      )}
    </div>
  );
};
