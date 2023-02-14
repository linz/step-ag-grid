import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import "styles/index.scss";
import "styles/GridTheme.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";

import { useMemo, useState } from "react";

import { Grid, GridProps } from "components/Grid";
import { ColDefT, GridCell } from "components/GridCell";
import { GridContextProvider } from "contexts/GridContextProvider";
import { GridUpdatingContextProvider } from "contexts/GridUpdatingContextProvider";

import { BasicGridFilter } from "./BasicGridFilter.stories";
import { AdvancedGridFilter } from "./AdvancedGridFilter.stories";
import { MultiSelectGridFilter } from "./MultiSelectGridFilter.stories";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { BoundFunctions } from "@testing-library/dom/types/get-queries-for-element";
import * as queries from "@testing-library/dom/types/queries";
import { wait } from "@testing-library/user-event/dist/utils";
import { waitFor } from "@testing-library/dom";

export default {
  title: "Components / Grids / Extra Filters",
  component: Grid,
  args: {
    quickFilter: true,
    quickFilterPlaceholder: "Quick filter...",
    selectable: false,
    rowSelection: "single",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: 400 }}>
        <GridUpdatingContextProvider>
          <GridContextProvider>
            <Story />
          </GridContextProvider>
        </GridUpdatingContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof Grid>;

export interface GridFilterRow {
  id: number;
  position: string;
  age: number;
  desc: string;
}

const GridReadOnlyTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const columnDefs: ColDefT<GridFilterRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
      }),
      GridCell({
        field: "position",
        headerName: "Position",
      }),
      GridCell({
        field: "desc",
        headerName: "Description",
      }),
      GridCell({
        field: "age",
        headerName: "Age",
      }),
    ],
    [],
  );

  const [rowData] = useState<GridFilterRow[]>(
    [
      { position: "Tester", age: 30, desc: "Test" },
      { position: "Developer", age: 35, desc: "Squad A" },
      { position: "Developer", age: 26, desc: "Squad B" },
      { position: "Manager", age: 45, desc: "Manager Team A" },
      { position: "Manager", age: 52, desc: "Manager Team B" },
      { position: "Manager", age: 51, desc: "Manager Team C" },
    ].map((row, index) => ({ ...row, id: index + 1 + 1000 })),
  );

  return <Grid {...props} columnDefs={columnDefs} domLayout="autoHeight" rowData={rowData} />;
};

export const Advanced = GridReadOnlyTemplate.bind({});
Advanced.args = {
  renderExtraFilters: <AdvancedGridFilter />,
};
Advanced.play = async ({ canvasElement }) => {
  const canvas = await waitForGridToBeReady(canvasElement);

  await expectRowsEqualTo(canvas)([
    ["1001", "Tester", "Test", "30"],
    ["1002", "Developer", "Squad A", "35"],
    ["1003", "Developer", "Squad B", "26"],
    ["1004", "Manager", "Manager Team A", "45"],
    ["1005", "Manager", "Manager Team B", "52"],
    ["1006", "Manager", "Manager Team C", "51"],
  ]);

  const input = await canvas.findByPlaceholderText(/Age/);
  userEvent.type(input, "35");
  userEvent.keyboard("{Enter}");
  await wait(1000);

  // expect to only see rows with age below or equal to 35
  await expectRowsEqualTo(canvas)([
    ["1001", "Tester", "Test", "30"],
    ["1002", "Developer", "Squad A", "35"],
    ["1003", "Developer", "Squad B", "26"],
  ]);

  const developer = await canvas.findByText("Developer", {
    selector: "button",
  });
  userEvent.click(developer);
  await wait(1000);

  // expect to only see rows with age below or equal to 35 and with 'Developer' position
  await expectRowsEqualTo(canvas)([
    ["1002", "Developer", "Squad A", "35"],
    ["1003", "Developer", "Squad B", "26"],
  ]);
};

export const Basic = GridReadOnlyTemplate.bind({});
Basic.args = {
  renderExtraFilters: <BasicGridFilter />,
};
Basic.play = async ({ canvasElement }) => {
  const canvas = await waitForGridToBeReady(canvasElement);

  // expect to see all rows
  await expectRowsEqualTo(canvas)([
    ["1001", "Tester", "Test", "30"],
    ["1002", "Developer", "Squad A", "35"],
    ["1003", "Developer", "Squad B", "26"],
    ["1004", "Manager", "Manager Team A", "45"],
    ["1005", "Manager", "Manager Team B", "52"],
    ["1006", "Manager", "Manager Team C", "51"],
  ]);

  const position = await canvas.findByTitle("Position");
  expect(position).toBeInTheDocument();

  // expect to only see rows with 'Developer' position
  userEvent.selectOptions(position, "Developer");
  await expectRowsEqualTo(canvas)([
    ["1002", "Developer", "Squad A", "35"],
    ["1003", "Developer", "Squad B", "26"],
  ]);

  // expect to only see row with 'Developer' position and 'Squad B' description
  const quickFilter = await canvas.findByPlaceholderText("Quick filter...");
  userEvent.type(quickFilter, "Squad B");
  await expectRowsEqualTo(canvas)([["1003", "Developer", "Squad B", "26"]]);

  // expect to only see row with 'Tester' position
  userEvent.selectOptions(position, "Tester");
  userEvent.clear(quickFilter);
  await expectRowsEqualTo(canvas)([["1001", "Tester", "Test", "30"]]);
};

export const MultiSelect = GridReadOnlyTemplate.bind({});
MultiSelect.args = {
  renderExtraFilters: <MultiSelectGridFilter />,
};
MultiSelect.play = async ({ canvasElement }) => {
  const canvas = await waitForGridToBeReady(canvasElement);

  await expectRowsEqualTo(canvas)([
    ["1001", "Tester", "Test", "30"],
    ["1002", "Developer", "Squad A", "35"],
    ["1003", "Developer", "Squad B", "26"],
    ["1004", "Manager", "Manager Team A", "45"],
    ["1005", "Manager", "Manager Team B", "52"],
    ["1006", "Manager", "Manager Team C", "51"],
  ]);

  const developerCheckbox = await canvas.findByLabelText(/Developer/);
  userEvent.click(developerCheckbox);
  await wait(1000);

  await expectRowsEqualTo(canvas)([
    ["1002", "Developer", "Squad A", "35"],
    ["1003", "Developer", "Squad B", "26"],
  ]);

  const testerCheckbox = await canvas.findByLabelText(/Tester/);
  userEvent.click(testerCheckbox);
  await wait(1000);

  await expectRowsEqualTo(canvas)([
    ["1001", "Tester", "Test", "30"],
    ["1002", "Developer", "Squad A", "35"],
    ["1003", "Developer", "Squad B", "26"],
  ]);
};

const waitForGridToBeReady = async (canvasElement: HTMLElement): Promise<BoundFunctions<typeof queries>> => {
  const canvas = within(canvasElement);
  const table = await canvas.findByRole("table");
  await waitFor(async () => {
    // need to wait for Grid to be ready to ensure expected rows are rendered
    expect(table).toHaveClass("Grid-ready");
  });
  return canvas;
};

const expectRowsEqualTo = (canvas: BoundFunctions<typeof queries>) => async (expected: string[][]) => {
  const rows = (await canvas.findAllByRole("row")).filter((row) => !row.classList.contains("ag-header-row"));

  const rowsCells = rows
    .sort((rowA, rowB) => {
      /**
       * need to manually sort rows here because there's no guarantee that the order of elements found in the canvas is the same order as what's actually rendered.
       */
      const rowAIndex = Number(rowA.getAttribute("row-index"));
      const rowBIndex = Number(rowB.getAttribute("row-index"));
      return rowAIndex - rowBIndex;
    })
    .map(async (row) => {
      const cells = await within(row).findAllByRole("gridcell");
      return cells.map((cell) => cell.innerText);
    });

  expect(expected).toEqual(await Promise.all(rowsCells));
};
