import { sanitiseFileName } from "./util";

describe("sanitiseFileName", () => {
  test("sanitiseFileName", () => {
    expect(sanitiseFileName(" LT 1235/543 &%//*$ ")).toBe("LT_1235-543_&%-$");
    expect(sanitiseFileName(" @filename here!!! ")).toBe("filename_here");
  });
});
