import { GridBaseRow } from "../components/Grid";

export interface TextInputValidatorProps<RowType extends GridBaseRow> {
  required?: boolean;
  maxLength?: number;
  validate?: (value: string, data: RowType) => string | null;
}

export const TextInputValidator = <RowType extends GridBaseRow>(
  props: TextInputValidatorProps<RowType>,
  value: string | null,
  data: RowType,
) => {
  if (value == null) return null;

  // This can happen because subcomponent is invoked without type safety
  if (typeof value !== "string") {
    console.error("Value is not a string", value);
  }
  if (props.required && value.length === 0) {
    return `Some text is required`;
  }
  if (props.maxLength && value.length > props.maxLength) {
    return `Text must be no longer than ${props.maxLength} characters`;
  }
  if (props.validate) {
    return props.validate(value, data);
  }
  return null;
};
