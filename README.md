# step-ag-grid

> Reusable [ag-grid](https://www.ag-grid.com/) component for LINZ / Toitū te whenua.

## Features

- [ag-grid-community](https://www.npmjs.com/package/ag-grid-community) based grid with custom popover components
  implemented using a modified [react-menu](https://www.npmjs.com/package/@szhsin/react-menu).
- Default components
  - Text input
  - Text area
  - Drop-down
  - Multi-select
  - Bearing/Bearing Correction
  - Popover message
  - Custom form

_Please note this requires React >=17, ag-grid-community >=27, and sass._

## Install

with npm

```bash
npm install @linz/step-ag-grid
```

or with Yarn

```bash
yarn add @linz/step-ag-grid
```

## Demo

```bash
npm run storybook
```

Storybook demo deployed at: https://linz.github.io/step-ag-grid/

## Usage

Check `src\stories` for more usage examples

```tsx
import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "@linzjs/step-ag-grid/dist/index.css";
// Only required for LINZ themes otherwise import the default theme from ag-grid
import "@linzjs/step-ag-grid/dist/GridTheme.scss";

import { useMemo } from "react";
import {
  GridUpdatingContextProvider,
  GridContextProvider,
  ColDefT,
  GridCell,
  GridPopoverMessage,
  GridPopoverEditDropDown,
} from "@linzjs/step-ag-grid";

const GridDemo = () => {
  interface ITestRow {
    id: number;
    name: number;
    position: string;
  }

  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridCell({
        field: "name",
        headerName: "Name",
        initialWidth: 65,
        maxWidth: 150,
        cellRendererParams: {
          warning: (props) => props.value === "Tester" && "Testers are testing",
          info: (props) => props.value === "Developer" && "Developers are awesome",
        },
      }),
      GridPopoverEditDropDown(
        {
          field: "position",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Position",
        },
        {
          multiEdit: false,
          editorParams: {
            options: ["Architect", "Developer", "Product Owner", "Scrum Master", "Tester", MenuSeparator, "(other)"],
          },
        },
      ),
      GridPopoverMessage(
        {
          headerName: "Popout message",
          cellRenderer: () => <>Click me!</>,
        },
        {
          multiEdit: true,
          editorParams: {
            message: async (formParams) => {
              return `There are ${formParams.selectedRows.length} row(s) selected`;
            },
          },
        },
      ),
    ],
    [],
  );

  const rowData: ITestRow[] = useMemo(
    () => [
      { id: 1000, name: "Tom", position: "Tester" },
      { id: 1001, name: "Sue", position: "Developer" },
    ],
    [],
  );

  return (
    <GridUpdatingContextProvider>
      <GridContextProvider>
        <Grid selectable={true} columnDefs={columnDefs} rowData={rowData} />
      </GridContextProvider>
    </GridUpdatingContextProvider>
  );
};
```

## Writing tests

The following testing calls can be imported from step-ag-grid:

- findRow
- queryRow
- selectRow
- deselectRow
- findCell
- selectCell
- editCell
- findOpenMenu
- queryMenuOption
- findMenuOption
- clickMenuOption
- openAndClickMenuOption
- getMultiSelectOptions
- findMultiSelectOption
- clickMultiSelectOption
- typeOtherInput
- typeOtherTextArea
- closeMenu
- findActionButton
- clickActionButton

```tsx
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { findRow, GridUpdatingContextProvider, openAndClickMenuOption } from "@linzjs/step-ag-grid";

const TestComponent = (): JSX.Element => {
  return (
    <GridUpdatingContextProvider>
      <MyGrid />
    </GridUpdatingContextProvider>
  );
};

test("click Delete menu option removes row from the table", async () => {
  await render(<TestComponent />);
  await screen.findByText("My component header");
  expect((await findRow(12345)).getAttribute("row-index")).toBe("1");
  await openAndClickMenuOption(12345, "actions", "Delete");
  await waitFor(async () => expect((await queryRow(12345)).not.toBeDefined());
});
```
