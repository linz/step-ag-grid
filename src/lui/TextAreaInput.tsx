import { InputHTMLAttributes, useState } from "react";
import clsx from "clsx";
import { v4 as uuidVersion4 } from "uuid";
import { omit } from "lodash-es";
import { FormError } from "./FormError";

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
  error?: JSX.Element | string | boolean | null;
  allowTabToSave?: boolean;
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
            {...omit(props, ["error", "value", "helpText", "formatted", "className", "allowTabToSave"])}
            id={id}
            value={props.value ?? ""}
            spellCheck={true}
            onMouseEnter={(e) => {
              if (document.activeElement != e.currentTarget) {
                e.currentTarget.focus();
                e.currentTarget.selectionStart = e.currentTarget.value.length;
              }
              props.onMouseEnter && props.onMouseEnter(e);
            }}
            data-allowtabtosave={props.allowTabToSave}
          >
            {props.value}
          </textarea>
        </div>
      </label>

      <FormError error={props.error} helpText={props.helpText} />
    </div>
  );
};
