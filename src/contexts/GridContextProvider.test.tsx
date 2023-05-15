import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

import { downloadCsvUseValueFormattersProcessCellCallback as Dpcc } from "./GridContextProvider";

describe("downloadCsvUseValueFormattersProcessCellCallback", () => {
  test("each type of value for conversion to string", async () => {
    expect(Dpcc({ value: undefined } as any)).toBe("undefined");
    expect(Dpcc({ value: null } as any)).toBe("null");
    expect(Dpcc({ value: false } as any)).toBe("false");
    expect(Dpcc({ value: "x" } as any)).toBe("x");
    expect(Dpcc({ value: 123 } as any)).toBe("123");
    expect(Dpcc({ value: {} } as any)).toBe("[object Object]");
    expect(Dpcc({ value: {}, column: { getColDef: () => undefined } } as any)).toBe("[object Object]");
    expect(Dpcc({ value: {}, column: { getColDef: () => ({ valueFormatter: undefined }) } } as any)).toBe(
      "[object Object]",
    );
    expect(
      Dpcc({
        value: {},
        column: { getColDef: () => ({ valueFormatter: "registeredValueFormatter" }) },
      } as any),
    ).toBe("[object Object]");

    expect(
      Dpcc({
        value: { a: 2 },
        column: {
          getColDef: () => ({
            valueFormatter: (params: ValueFormatterParams) => {
              return "xxx" + params.value.a;
            },
          }),
        },
      } as any),
    ).toBe("xxx2");
  });
});
