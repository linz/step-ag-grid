import { GridBaseRow } from "../components/Grid";
import { TextInputValidator, TextInputValidatorProps } from "./textValidator";

describe("TextInputValidator", () => {
  test("number format", () => {
    const validate = [
      {
        numberFormat: {},
        tests: [
          ["x", "Must be a valid number"],
          ["1.2e6", "Must be a valid number"],
          ["", null],
          ["1", null],
          ["1.2", null],
          [".2", null],
          ["-1.2", null],
          ["-.2", null],
          ["-.2", null],
        ],
      },
      {
        numberFormat: { geMin: 0, leMax: 10 },
        tests: [
          ["x", "Must be a valid number"],
          ["", null],
          ["1", null],
          ["0", null],
          ["-1", "Must not be less than 0"],
          ["10", null],
          ["10.1", "Must not be greater than 10"],
        ],
      },
      {
        numberFormat: { gtMin: 0, ltMax: 10 },
        tests: [
          ["x", "Must be a valid number"],
          ["", null],
          ["1", null],
          ["0", "Must be greater than 0"],
          ["10", "Must be less than 10"],
        ],
      },
      {
        numberFormat: { precision: 3 },
        tests: [
          ["x", "Must be a valid number"],
          ["", null],
          ["1.22", null],
          ["0.122", null],
          ["1.123", "Must have no more than 3 digits precision"],
          ["0.1234", "Must have no more than 3 digits precision"],
        ],
      },
      {
        numberFormat: { scale: 2 },
        tests: [
          ["x", "Must be a valid number"],
          ["", null],
          ["1.22", null],
          ["0.122", "Must have no more than 2 decimal places"],
          ["1.123", "Must have no more than 2 decimal places"],
        ],
      },
      {
        numberFormat: { scale: 0 },
        tests: [
          ["1", null],
          ["1.1", "Must be a whole number"],
        ],
      },
      {
        required: true,
        tests: [
          ["xx", null],
          ["", "Must not be empty"],
          ["\t", "Must not be empty"],
          ["\n", "Must not be empty"],
          ["\r", "Must not be empty"],
          [" ", "Must not be empty"],
        ],
      },
    ] as (TextInputValidatorProps<GridBaseRow> & { tests: [string, string | undefined][] })[];

    validate.forEach((v, i) => {
      for (const test of v.tests) {
        expect(
          TextInputValidator(v, test[0], { id: 0 }, {}),
          `Test ${i}: "${test[0]}" should return "${test[1]}"`,
        ).toBe(test[1]);
      }
    });
  });

  test("validator is called", () => {
    const fn = jest.fn();
    TextInputValidator({ invalid: fn }, "", { id: 0 }, {});
    expect(fn).toHaveBeenCalled();
  });

  test("maxLength", () => {
    expect(TextInputValidator({ maxLength: 2 }, "", { id: 0 }, {})).toBeNull();
    expect(TextInputValidator({ maxLength: 2 }, "aa", { id: 0 }, {})).toBeNull();
    expect(TextInputValidator({ maxLength: 2 }, "aaa", { id: 0 }, {})).toBe("Must be no longer than 2 characters");
  });

  test("maxBytes", () => {
    expect(TextInputValidator({ maxBytes: 2 }, "", { id: 0 }, {})).toBeNull();
    expect(TextInputValidator({ maxBytes: 2 }, "aa", { id: 0 }, {})).toBeNull();
    expect(TextInputValidator({ maxBytes: 2 }, "a–", { id: 0 }, {})).toBe("Must be no longer than 2 bytes");
  });
});
