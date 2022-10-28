import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

export const bearingValueFormatter = (params: ValueFormatterParams): string => {
  const value = params.value;
  if (value == null) {
    return "-";
  }
  return convertDDToDMS(value, false, false);
};

export const bearingCorrectionValueFormatter = (params: ValueFormatterParams): string => {
  const value = params.value;
  if (value == null) {
    return "-";
  }
  if (typeof value === 'string') {
    return convertDDToDMS(bearingNumberParser(value), true, true);
  }
  return convertDDToDMS(value, true, true);
};

export const bearingNumberParser = (value: string): number | null => {
  if (value === "") return null;
  return parseFloat(value);
};

const validMaskForDmsBearing = /^((-)?\d+)?(\.([0-5](\d([0-5](\d(\d+)?)?)?)?)?)?$/;
export const bearingStringValidator = (
  value: string,
  customValidate?: (value: number | null) => string | null,
): string | null => {
  value = value.trim();
  if (value === "") return null;
  const match = value.match(validMaskForDmsBearing);
  if (!match) return "Bearing must be a positive number in D.MMSSS format";
  const decimalPart = match[4];
  if (decimalPart != null && decimalPart.length > 5) {
    return "Bearing has a maximum of 5 decimal places";
  }

  const bearing = parseFloat(value);

  return customValidate ? customValidate(bearing) : null;
};

// Decimal-ish degrees to Degrees Minutes Seconds converter
export const convertDDToDMS = (dd: number | null, showPositiveSymbol = true, addTrailingZeros = true): string => {
  if (dd == null) return "–";

  if (dd === 0) addTrailingZeros = false;

  // toFixed rounds parts up greater than 60, which has to be corrected below
  const [bearingWholeString, bearingDecimalString] = dd.toFixed(5).split(".");

  let bearingWhole = Math.abs(parseInt(bearingWholeString));
  let minNumeric = parseInt(bearingDecimalString?.substring(0, 2));
  let secNumeric = parseInt(bearingDecimalString?.substring(2, 4));

  // If the toFixed caused rounding beyond 60 minutes/seconds then apply the carry
  if (secNumeric >= 60) {
    minNumeric++;
    secNumeric -= 60;
  }
  if (minNumeric >= 60) {
    bearingWhole++;
    minNumeric -= 60;
  }
  if (bearingWhole >= 360) {
    bearingWhole -= 360;
  }

  const minString = minNumeric.toString().padStart(2, "0");
  const secString = secNumeric.toString().padStart(2, "0");
  const deciSecString = bearingDecimalString?.substring(4, 5);

  let dmsString = `${showPositiveSymbol && dd > 0 ? "+" : ""}${dd < 0 ? "-" : ""}${bearingWhole}°`;
  if (addTrailingZeros || deciSecString != "0") {
    dmsString += `\xa0${minString}'\xa0${secString}.${deciSecString}"`; // "\xa0" is here for non-breaking space
  } else if (secNumeric != 0) {
    dmsString += `\xa0${minString}'\xa0${secString}"`;
  } else {
    dmsString += `\xa0${minString}'`;
  }

  return dmsString;
};
