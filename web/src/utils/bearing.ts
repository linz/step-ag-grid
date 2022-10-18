// Decimal-ish degrees to Degrees Minutes Seconds converter
export const convertDDToDMS = (dd: number | null, showPositiveSymbol = true, addTrailingZeros = true): string => {
  if (dd == null) return "–";

  if (dd === 0) addTrailingZeros = true;

  // toFixed rounds parts up greater than 60, which has to be corrected below
  const [bearingWholeString, beringDecimalString] = dd.toFixed(5).split(".");

  let bearingWhole = Math.abs(parseInt(bearingWholeString));
  let minNumeric = parseInt(beringDecimalString?.substring(0, 2));
  let secNumeric = parseInt(beringDecimalString?.substring(2, 4));

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
  const deciSecString = beringDecimalString?.substring(4, 5);

  let dmsString = `${showPositiveSymbol && dd > 0 ? "+" : ""}${dd < 0 ? "-" : ""}${bearingWhole}°`;
  if (addTrailingZeros || deciSecString != "0") {
    dmsString += `\xa0${minString}'\xa0${secString}.${deciSecString}"`; // "\xa0" is here for non-breaking space
  } else if (secNumeric != 0) {
    dmsString += `\xa0${minString}'\xa0${secString}"`;
  } else if (minNumeric != 0) {
    dmsString += `\xa0${minString}'`;
  }

  return dmsString;
};
