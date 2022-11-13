import "./TextInputFormatted.scss";

import { DetailedHTMLProps, InputHTMLAttributes } from "react";

import clsx from "clsx";
import { LuiIcon } from "@linzjs/lui";

export interface LuiTextInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  error?: string | boolean | null;

  value: string;
  wrapperClassName?: string;
  helpText?: string;

  placeholder?: string;
  formatted?: string;
}

export const TextInputFormatted = (props: LuiTextInputProps): JSX.Element => {
  return (
    <div className={clsx("LuiTextInput Grid-popoverContainer", props.error && "hasError", props.wrapperClassName)}>
      <span className="LuiTextInput-inputWrapper">
        {/* wrapper div used for error styling */}
        <input
          type={"text"}
          spellCheck={true}
          defaultValue={props.value}
          {...props}
          className={clsx("LuiTextInput-input", props.className)}
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
