import { isFloat, sanitiseFileName } from "./util";

describe("sanitiseFileName", () => {
  test("isFloat", () => {
    expect(isFloat("")).toBe(false);
    expect(isFloat("x")).toBe(false);
    expect(isFloat("1e10")).toBe(false);
    expect(isFloat("1x")).toBe(false);
    expect(isFloat("1.x")).toBe(false);
    expect(isFloat("x.1")).toBe(false);
    expect(isFloat("1")).toBe(true);
    expect(isFloat("1.")).toBe(true);
    expect(isFloat(".1")).toBe(true);
  });
  test("sanitiseFileName", () => {
    expect(sanitiseFileName(" LT 1235/543 &%//*$ ")).toBe("LT_1235-543_&%-$");
    expect(sanitiseFileName(" @filename here!!! ")).toBe("@filename_here!!!");
  });
});
