import { InputHTMLAttributes, useState } from "react";
import clsx from "clsx";
import { LuiIcon } from "@linzjs/lui";
import { v4 as uuidVersion4 } from "uuid";
import { omit } from "lodash-es";

export const useGenerateOrDefaultId = (idFromProps?: string) => {
  const [id] = useState(idFromProps ? idFromProps : uuidVersion4());
  return id;
};

export interface LuiTextAreaInputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  // overrides value in base class to be string type only
  value: string;

  // Custom fields
  label?: JSX.Element | string;
  mandatory?: boolean;
  helpText?: string;
  error?: string | boolean | null;
}

export const TextAreaInput = (props: LuiTextAreaInputProps) => {
  const id = useGenerateOrDefaultId(props?.id);

  return (
    <div
      className={clsx(
        "LuiTextAreaInput Grid-popoverContainer",
        props.disabled ? "isDisabled" : "",
        props.error ? "hasError" : "",
        props.className,
      )}
    >
      <label htmlFor={id}>
        {props.mandatory != null && <span className="LuiTextAreaInput-mandatory">*</span>}
        {props.label != null && <span className="LuiTextAreaInput-label">{props.label}</span>}
        <div className="LuiTextAreaInput-wrapper">
          {/* wrapper div used for error styling */}
          <textarea
            rows={5}
            {...omit(props, ["error", "value", "helpText", "formatted", "className"])}
            id={id}
            value={props.value}
            spellCheck={true}
            onMouseEnter={(e) => {
              if (document.activeElement != e.currentTarget) {
                e.currentTarget.focus();
                e.currentTarget.selectionStart = e.currentTarget.value.length;
              }
              props.onMouseEnter && props.onMouseEnter(e);
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
