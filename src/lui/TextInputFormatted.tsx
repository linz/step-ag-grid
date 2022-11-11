import "./TextInputFormatted.scss";

import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FocusEventHandler,
  InputHTMLAttributes,
  MouseEventHandler,
} from "react";

import clsx from "clsx";
import { LuiIcon } from "@linzjs/lui";

export interface LuiTextInputProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  inputProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  error?: string | boolean | null;
  warning?: string | boolean | null;

  className?: string;
  value: string;

  placeholder?: string;
  formatted?: string;
}

export const TextInputFormatted = (props: LuiTextInputProps): JSX.Element => {
  return (
    <div
      className={clsx(
        "LuiTextInput Grid-popoverContainer",
        props.error && "hasError",
        props.warning && "hasWarning",
        props.className,
      )}
    >
      <span className="LuiTextInput-inputWrapper">
        <input
          type={"text"}
          className={"LuiTextInput-input"}
          min="0"
          spellCheck={true}
          defaultValue={props.value}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onClick={props.onClick}
          onMouseEnter={(e) => {
            e.currentTarget.focus();
          }}
          {...props.inputProps}
        />
        <span className={"LuiTextInput-formatted"}>{props.formatted}</span>
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
