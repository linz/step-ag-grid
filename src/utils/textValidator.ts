import { GridBaseRow } from "../components/Grid";

export interface TextInputValidatorProps<RowType extends GridBaseRow> {
  required?: boolean;
  maxLength?: number;
  maxBytes?: number;
  invalid?: (value: string, data: RowType) => string | null;
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
  if (props.maxBytes && new TextEncoder().encode(value).length > props.maxBytes) {
    return `Text must be no longer than ${props.maxLength} bytes`;
  }
  if (props.invalid) {
    return props.invalid(value, data);
  }
  return null;
};
