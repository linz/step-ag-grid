import { ReactElement } from "react";

import { GridBaseRow } from "../components/Grid";
import { isFloat, stringByteLengthIsInvalid } from "./util";

export interface TextInputValidatorProps<RowType extends GridBaseRow> {
  required?: boolean;
  maxLength?: number;
  maxBytes?: number;
  invalid?: (value: string, data: RowType, context: any) => ReactElement | string | null;
  numberFormat?: {
    precision?: number;
    scale?: number;
    gtMin?: number;
    geMin?: number;
    ltMax?: number;
    leMax?: number;
    notZero?: boolean;
  };
}

export const TextInputValidator = <RowType extends GridBaseRow>(
  props: TextInputValidatorProps<RowType>,
  value: string | null,
  data: RowType,
  context: any,
) => {
  if (value == null) return null;

  // This can happen because subcomponent is invoked without type safety
  if (typeof value !== "string") {
    return "Value is not a string";
  }
  if (props.required && value.trim() == "") {
    return "Must not be empty";
  }
  if (props.maxLength && value.length > props.maxLength) {
    return `Must be no longer than ${props.maxLength} characters`;
  }
  if (props.maxBytes && stringByteLengthIsInvalid(value, props.maxBytes)) {
    return `Must be no longer than ${props.maxBytes} bytes`;
  }
  const nf = props.numberFormat;
  if (nf) {
    if (value != "" && !isFloat(value)) {
      return `Must be a valid number`;
    }
    if (value != "") {
      const number = parseFloat(value);
      if (nf.notZero && number === 0) {
        return `Must not be 0`;
      }
      if (nf.gtMin != null && number <= nf.gtMin) {
        return `Must be greater than ${nf.gtMin.toLocaleString()}`;
      }
      if (nf.geMin != null && number < nf.geMin) {
        return `Must not be less than ${nf.geMin.toLocaleString()}`;
      }
      if (nf.ltMax != null && number >= nf.ltMax) {
        return `Must be less than ${nf.ltMax.toLocaleString()}`;
      }
      if (nf.leMax != null && number > nf.leMax) {
        return `Must not be greater than ${nf.leMax.toLocaleString()}`;
      }

      if (nf.precision != null && value != "") {
        if (parseFloat(number.toPrecision(nf.precision)) != number) {
          return `Must have no more than ${nf.precision} digits precision`;
        }
      }

      if (nf.scale != null && value != "") {
        if (parseFloat(number.toFixed(nf.scale)) != number) {
          return nf.scale == 0 ? `Must be a whole number` : `Must have no more than ${nf.scale} decimal places`;
        }
      }
    }
  }
  if (props.invalid) {
    return props.invalid(value, data, context);
  }
  return null;
};
