import { GridBaseRow } from "./Grid";
import { generateFilterGetter, SAValueGetterParams } from "./GridCell";

describe("GridCell", () => {
  test("generateFilterGetter returns passed filterValueGetter", () => {
    const filterValueGetter = () => "a";
    expect(generateFilterGetter(undefined, filterValueGetter, () => "b")).toBe(filterValueGetter);
    expect(generateFilterGetter("xxx", filterValueGetter, undefined)).toBe(filterValueGetter);
    expect(generateFilterGetter(undefined, filterValueGetter, undefined)).toBe(filterValueGetter);
  });

  test("generateFilterGetter", () => {
    expect(generateFilterGetter("xxx", undefined, undefined)).toBeUndefined();

    const tests = [
      { formatted: "f1", value: "v1", expected: "f1 v1" },
      { formatted: "f2", value: {}, expected: "f2" },
      { formatted: "", value: "v3", expected: "v3" },
    ];

    tests.forEach((test) => {
      const field = "xxx";
      const valueFormatter = test.formatted == null ? undefined : () => test.formatted;
      const filterGetter = generateFilterGetter(field, undefined, valueFormatter);
      expect(typeof filterGetter).toBe("function");
      if (typeof filterGetter !== "function") return;
      expect(filterGetter({ getValue: () => test.value } as any as SAValueGetterParams<GridBaseRow>)).toBe(
        test.expected,
      );
    });
  });
});
