import { ChangeEventHandler, InputHTMLAttributes, useState } from "react";
import clsx from "clsx";
import { LuiIcon } from "@linzjs/lui";
import { v4 as uuidv4 } from "uuid";

export const useGenerateOrDefaultId = (idFromProps?: string) => {
  const [id] = useState(idFromProps ? idFromProps : uuidv4());
  return id;
};

export interface LuiTextAreaInputProps {
  label?: JSX.Element | string;
  mandatory?: boolean;
  inputProps?: InputHTMLAttributes<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
  error?: string | boolean | null;
}

export const TextAreaInput = (props: LuiTextAreaInputProps) => {
  const id = useGenerateOrDefaultId(props.inputProps?.id);

  return (
    <div
      className={clsx(
        "LuiTextAreaInput Grid-popoverContainer",
        props.inputProps?.disabled ? "isDisabled" : "",
        props?.error ? "hasError" : "",
      )}
    >
      <label htmlFor={id}>
        {props.mandatory && <span className="LuiTextAreaInput-mandatory">*</span>}
        {props.label && <span className="LuiTextAreaInput-label">{props.label}</span>}
        <div className="LuiTextAreaInput-wrapper">
          {" "}
          {/* wrapper div used for error styling */}
          <textarea
            id={id}
            value={props.value}
            onChange={props.onChange}
            rows={5}
            {...props.inputProps}
            onMouseEnter={(e) => {
              if (document.activeElement != e.currentTarget) {
                e.currentTarget.focus();
                e.currentTarget.selectionStart = e.currentTarget.value.length;
              }
            }}
          />
        </div>
      </label>

      {/* Error message */}
      {props.error && (
        <span className="LuiTextAreaInput-error">
          <LuiIcon alt="error" name="ic_error" className="LuiTextAreaInput-error-icon" size="sm" status="error" />
          {props.error}
        </span>
      )}
    </div>
  );
};
