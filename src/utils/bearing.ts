export const bearingValueFormatter = (value: any): string => {
  const safeValue = typeof value === 'string' ? parseFloat(value) : value;
  if (safeValue == null) {
    return '–';
  }
  return convertDDToDMS(safeValue, false);
};

export const bearingCorrectionValueFormatter = (value: any): string => {
  const safeValue = value;
  if (safeValue == null) {
    return '–';
  }
  if (typeof safeValue === 'string') {
    return convertDDToDMS(bearingNumberParser(safeValue), true, 4);
  }
  return convertDDToDMS(safeValue, true, 4);
};

export const bearingNumberParser = (value: string): number | null => {
  if (value === '') return null;
  return parseFloat(value);
};

const validMaskForDmsBearing = /^((-)?\d+)?(\.([0-5](\d([0-5](\d(\d+)?)?)?)?)?)?$/;
export const bearingStringValidator = (
  value: string,
  customInvalid?: (value: number | null) => string | null,
): string | null => {
  value = value.trim();
  if (value === '') return null;
  const match = value.match(validMaskForDmsBearing);
  if (!match) return 'Bearing must be a number in D.MMSSS format';
  const decimalPart = match[4];
  if (decimalPart != null && decimalPart.length > 5) {
    return 'Bearing has a maximum of 5 decimal places';
  }

  const bearing = parseFloat(value);
  return customInvalid ? customInvalid(bearing) : null;
};

/**
 *Decimal-ish degrees to Degrees Minutes Seconds converter
 *
 * @param dd Decimal-ish degrees
 * @param showPositiveSymbol whether the + sign appears before the number
 * @param trailingZeroDp 2 | 4 | 5
 * Example:
 * 2 = 300° 00'
 * 4 = 300° 00' 00"
 * 5 = 300° 00' 00.0"
 * @returns Degrees Minutes Seconds
 */
export const convertDDToDMS = (dd: number | null, showPositiveSymbol = true, trailingZeroDp: 2 | 4 | 5 = 2): string => {
  if (dd == null) return '–';

  // toFixed rounds parts up greater than 60, which has to be corrected below
  const [bearingWholeString, bearingDecimalString] = dd.toFixed(5).split('.');

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

  const minString = minNumeric.toString().padStart(2, '0');
  const secString = secNumeric.toString().padStart(2, '0');
  const deciSecString = bearingDecimalString?.substring(4, 5);

  let dmsString = `${showPositiveSymbol && dd > 0 ? '+' : ''}${dd < 0 ? '-' : ''}${bearingWhole}°`;
  if (trailingZeroDp === 5 || deciSecString != '0') {
    dmsString += `\xa0${minString}'\xa0${secString}.${deciSecString}"`; // "\xa0" is here for non-breaking space
  } else if (trailingZeroDp === 4 || secNumeric != 0) {
    dmsString += `\xa0${minString}'\xa0${secString}"`;
  } else {
    dmsString += `\xa0${minString}'`;
  }
  return dmsString;
};

export const bearingRangeValidator = (value: number | null) => {
  if (value === null) return 'Bearing is required';
  if (value >= 360) return 'Bearing must be less than 360 degrees';
  if (value < 0) return 'Bearing must not be negative';
  return null;
};

export const bearingCorrectionRangeValidator = (value: number | null) => {
  if (value === null) return 'Bearing correction is required';
  if (value >= 360) return 'Bearing correction must be less than 360 degrees';
  if (value <= -180) return 'Bearing correction must be greater then -180 degrees';
  return null;
};
