# step-ag-grid

> Reusable [ag-grid](https://www.ag-grid.com/) component for LINZ / Toitū te whenua.

Storybook deployed at: https://linz.github.io/step-ag-grid/ (private to LINZ)

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

_Please note this requires React >=17, ag-grid-community >=27, and sass.

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

## Usage

```tsx
import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "@linzjs/step-ag-grid/dist/index.css"
// Only required for LINZ themes otherwise import the default theme from ag-grid
import "@linzjs/step-ag-grid/dist/GridTheme.scss";

import { useMemo } from "react";
import { GridUpdatingContextProvider } from "@contexts/GridUpdatingContextProvider";
import { GridContextProvider } from "@contexts/GridContextProvider";
import { ColDefT, GridCell } from "@components/GridCell";
import { GridPopoverMessage } from "@components/gridPopoverEdit/GridPopoverMessage";

const GridDemo = () => {
  interface ITestRow {
    id: number;
    position: string;
    age: number;
  };
  
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridCell({
        field: "position",
        headerName: "Position",
        initialWidth: 65,
        maxWidth: 150,
        cellRendererParams: {
          warning: (props) => props.value === "Tester" && "Testers are testing",
          info: (props) => props.value === "Developer" && "Developers are awesome",
        },
      }),
      GridPopoverMessage(
        {
          headerName: "Popout message",
          cellRenderer: () => <>Click me!</>,
        },
        {
          multiEdit: true,
          editorParams: {
            message: async (formParams): Promise<string> => {
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
        { id: 1000, position: "Tester", age: 30, desc: "Tests application", dd: "1" },
        { id: 1001, position: "Developer", age: 12, desc: "Develops application", dd: "2" },
    ],
    [],
  );

  return (
    <GridUpdatingContextProvider>
      <GridContextProvider>
        <Grid
          selectable={true}
          columnDefs={columnDefs}
          rowData={rowData}
        />
      </GridContextProvider>
    </GridUpdatingContextProvider>
  );
};
```
