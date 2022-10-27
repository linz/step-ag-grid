import { convertDDToDMS } from "./bearing";

describe("convertDDToDMS", () => {
  test("converts decimal-ish degrees to DMS", () => {
    expect(convertDDToDMS(-0.001, false, false)).toBe("-0° 00' 10\"");
    expect(convertDDToDMS(-10.001, false, false)).toBe("-10° 00' 10\"");
    expect(convertDDToDMS(-370.001, false, false)).toBe("-10° 00' 10\"");
    expect(convertDDToDMS(359.595999, false, false)).toBe("0° 00'");
    expect(convertDDToDMS(369.696999, false, false)).toBe("10° 10' 10\"");
    expect(convertDDToDMS(221.555999, false, false)).toBe("221° 56'");
    expect(convertDDToDMS(221.555999, false, true)).toBe("221° 56' 00.0\"");
    expect(convertDDToDMS(5)).toBe("+5° 00' 00.0\"");
    expect(convertDDToDMS(5.0)).toBe("+5° 00' 00.0\"");
    expect(convertDDToDMS(5.00001)).toBe("+5° 00' 00.1\"");
    expect(convertDDToDMS(5.1)).toBe("+5° 10' 00.0\"");
    expect(convertDDToDMS(5.12345)).toBe("+5° 12' 34.5\"");
    expect(convertDDToDMS(5.12345, false)).toBe("5° 12' 34.5\"");

    expect(convertDDToDMS(300)).toBe("+300° 00' 00.0\"");
    expect(convertDDToDMS(300.0)).toBe("+300° 00' 00.0\"");
    expect(convertDDToDMS(300.00001)).toBe("+300° 00' 00.1\"");
    expect(convertDDToDMS(300.1)).toBe("+300° 10' 00.0\"");
    expect(convertDDToDMS(300.12345)).toBe("+300° 12' 34.5\"");
    expect(convertDDToDMS(300.12345, false)).toBe("300° 12' 34.5\"");

    expect(convertDDToDMS(300, false, false)).toBe("300° 00'");
    expect(convertDDToDMS(300.1, false, false)).toBe("300° 10'");
    expect(convertDDToDMS(0, false)).toBe("0° 00'");
  });
});
