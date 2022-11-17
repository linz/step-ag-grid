import "./FormError.scss";

export interface FormErrorProps {
  helpText?: string;
  error?: string | boolean | null;
}

export const FormError = (props: FormErrorProps) => {
  return (
    <>
      {props.error && (
        <span className="LuiTextInput-error" style={{ paddingLeft: 0 }}>
          {props.error}
        </span>
      )}

      {props.helpText && !props.error && <span className={"helpText"}>{props.helpText}</span>}
    </>
  );
};
