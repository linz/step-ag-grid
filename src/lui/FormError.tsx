import "./FormError.scss";

import { ReactElement } from "react";

export interface FormErrorProps {
  helpText?: string;
  error?: ReactElement | string | boolean | null;
}

export const FormError = (props: FormErrorProps) => {
  return (
    <>
      {props.error && (
        <span className="LuiTextInput-error" style={{ paddingLeft: 0 }}>
          {props.error}
        </span>
      )}

      {props.helpText && !props.error && <span className={"FormError-helpText"}>{props.helpText}</span>}
    </>
  );
};
