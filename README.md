# step-ag-grid

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
> Reusable [ag-grid](https://www.ag-grid.com/) component for LINZ / Toitū te whenua.

## Features

- [ag-grid-community](https://www.npmjs.com/package/ag-grid-community) based grid with custom popover components
  implemented using a modified [react-menu](https://www.npmjs.com/package/@szhsin/react-menu).
- Default components
  - Text input
  - Text area
  - Drop-down
  - Multi-select
  - Multi-select-grid
  - Bearing/Bearing Correction
  - Popover message
  - Custom form

_Please note this requires React >=17, ag-grid-community >=27, and sass._

## Install

with npm

```bash
npm install @linzjs/step-ag-grid
```

or with Yarn

```bash
yarn add @linzjs/step-ag-grid
```

## Demo

```bash
npm run storybook
```

Storybook demo deployed at: https://linz.github.io/step-ag-grid/

## Usage

Check `src\stories` for more usage examples

```tsx
import { useMemo } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";
import {
  ColDefT,
  GridCell,
  GridContextProvider,
  GridPopoverEditDropDown,
  GridPopoverMessage,
  GridUpdatingContextProvider,
  GridWrapper,
  GridFilters,
  GridFilterQuick,
  GridFilterButtons
} from "@linzjs/step-ag-grid";
// Only required for LINZ themes otherwise import the default theme from ag-grid
import "@linzjs/step-ag-grid/dist/GridTheme.scss";
import "@linzjs/step-ag-grid/dist/index.css";
import { GridFilterDownloadCsvButton } from "./GridFilterDownloadCsvButton";

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
        export: false,
      }),
      GridCell({
        field: "name",
        headerName: "Name",
        cellRendererParams: {
          warning: ({ value }) => value === "Tester" && "Testers are testing",
          info: ({ value }) => value === "Developer" && "Developers are awesome",
        },
      }),
      GridPopoverEditDropDown(
        {
          field: "position",
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
            message: async ({selectedRows}) => {
              return `There are ${selectedRows.length} row(s) selected`;
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
        <GridWrapper>
          <GridFilters>
            <GridFilterQuick/>
            <GridFilterButtons<ITestRow>
              options={[
                {
                  label: "All",
                },
                {
                  label: "Developers",
                  filter: (row) => row.position === "Developer",
                },
                {
                  label: "Testers",
                  filter: (row) => row.position === "Tester",
                },
              ]}
            />
            <GridFilterColumnsToggle/>
            <GridFilterDownloadCsvButton fileName={"exportFile"}/>
          </GridFilters>
          <Grid selectable={true}
                columnDefs={columnDefs}
                rowData={rowData}
                onContentSize={({ width }) => setPanelSize(width)} />
        </GridWrapper>
      </GridContextProvider>
    </GridUpdatingContextProvider>
  );
};
```

## Bulk editing
If you are editing a cell and tab out of the cell, the grid will edit the next editable cell.

At this point you can send the change to the back-end immediately and then wait for an update response
_OR_
you could cache the required change, update then cell locally, and then wait for the callback
```<Grid onCellEditingComplete={fn}/>``` which will get invoked when the grid cannot find any
more editable cells on the grid row, which will speed up editing.

## Grid sizing
Grid uses ```<Grid sizeColumns="auto"/>``` which sizes by cell content by default.
To ignore cell content use "fit", to disable use "none".

If you are within a resizable window/dialog/container there is a callback parameter
```<Grid onContentSize={({ width }) => setPanelSize(width)}/>```
to receive the recommended container width.

## CSV Download
CSV download relies on column valueFormatters vs ag-grid's default valueGetter implementation.
If you use a customRenderer for a column be sure to include a valueFormatter.
To disable this behaviour pass undefined to processCellCallback.
```<GridFilterDownloadCsvButton processCellCallback={undefined}/>```

To exclude a column from CSV download add ```export: false``` to the GridCell definition. 

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
- validateMenuOptions
- queryMenuOption
- findMenuOption
- clickMenuOption
- openAndClickMenuOption
- getMultiSelectOptions
- findMultiSelectOption
- clickMultiSelectOption
- typeOnlyInput
- typeInputByLabel
- typeInputByPlaceholder
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

## Playwright support

If your grid has a data-testid a global will be exposed in window with the helper scrollRowIntoViewById.
This will throw an exception if the row id is not found.

```tsx
window.__stepAgGrid.grids[dataTestId].scrollRowIntoViewById("1000")
```

