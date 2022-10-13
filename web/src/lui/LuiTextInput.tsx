import "./LuiTextInputFormatted.scss";

import { ChangeEventHandler, DetailedHTMLProps, InputHTMLAttributes } from "react";

import clsx from "clsx";
import { LuiIcon } from "@linzjs/lui";

export interface LuiTextInputProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  inputProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  error?: string;
  warning?: string;

  className?: string;
  value: string;

  icon?: JSX.Element;
  placeholder?: string;
  formatted: string;
}

export const LuiTextInput = (props: LuiTextInputProps): JSX.Element => {
  return (
    <div className={clsx("LuiTextInput", props.error && "hasError", props.warning && "hasWarning", props.className)}>
      <span className="LuiTextInput-inputWrapper">
        <input
          type={"text"}
          className={"LuiTextInput-input"}
          min="0"
          value={props.value}
          onChange={props.onChange}
          {...props.inputProps}
        />
        <span className={"LuiTextInput-formatted"}>{props.formatted}</span>
        {props.icon}
      </span>

      {props.error && (
        <span className="LuiTextInput-error">
          <LuiIcon alt="error" name="ic_error" className="LuiTextInput-error-icon" size="sm" status="error" />
          {props.error}
        </span>
      )}

      {props.warning && (
        <span className="LuiTextInput-warning">
          <LuiIcon alt="warning" name="ic_warning" className="LuiTextInput-warning-icon" size="sm" status="warning" />
          {props.warning}
        </span>
      )}
    </div>
  );
};
