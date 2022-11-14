import { LuiIcon } from "@linzjs/lui";

export interface FormErrorProps {
  helpText?: string;
  error?: string | boolean | null;
}

export const FormError = (props: FormErrorProps) => {
  return (
    <>
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
    </>
  );
};
