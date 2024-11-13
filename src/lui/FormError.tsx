import "./FormError.scss";

import { ReactElement } from "react";
import { LuiIcon } from "@linzjs/lui";

export interface FormErrorProps {
  helpText?: string;
  error?: ReactElement | string | boolean | null;
}

export const FormError = (props: FormErrorProps) => {
  return (
    <>
      {props.error && (
        <div className="FormError">
          <LuiIcon alt="error" name="ic_error" className="FormError-text-icon" size="sm" status="error" />
          <span className="FormError-error">{props.error}</span>
        </div>
      )}

      {props.helpText && !props.error && <span className={"FormError-helpText"}>{props.helpText}</span>}
    </>
  );
};
