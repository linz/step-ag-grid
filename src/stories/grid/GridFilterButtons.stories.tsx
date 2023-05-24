import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useMemo, useState } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridFilterButtons,
  GridFilterQuick,
  GridFilters,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
} from "../..";
import "../../styles/GridTheme.scss";
import "../../styles/index.scss";

export default {
  title: "Components / Grids",
  component: Grid,
  decorators: [
    (Story) => (
      <div
        style={{
          border: "1px solid #eee",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxHeight: 500,
          maxWidth: "100%",
          minWidth: "480px",
          padding: "1em",
        }}
      >
        <GridUpdatingContextProvider>
          <GridContextProvider>
            <Story />
          </GridContextProvider>
        </GridUpdatingContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof Grid>;

interface ITestRow {
  id: number;
  position: string;
  desc: string;
}

const GridFilterButtonsTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        width: 100,
        suppressSizeToFit: true,
      }),
      GridCell({
        field: "position",
        headerName: "Position",
        width: 100,
        suppressSizeToFit: true,
      }),
      GridCell({
        field: "desc",
        headerName: "Description",
        flex: 1,
      }),
    ],
    [],
  );

  const [rowData] = useState([
    {
      id: 1000,
      position: "Tester",
      age: 30,
      desc: "Integration testerIntegration testerIntegration testerIntegration testerIntegration testerIntegration testerIntegration testerIntegration tester",
    },
    { id: 1001, position: "Developer", age: 12, desc: "Frontend developer" },
    { id: 1002, position: "Manager", age: 65, desc: "Technical Manager" },
    { id: 1003, position: "Tester", age: 30, desc: "E2E tester" },
    { id: 1004, position: "Developer", age: 12, desc: "Fullstack Developer" },
    { id: 1005, position: "Developer", age: 12, desc: "Backend Developer" },
    { id: 1006, position: "Architect", age: 30, desc: "Architect" },
  ]);

  return (
    <GridWrapper>
      <GridFilters>
        <GridFilterQuick quickFilterPlaceholder={"Custom placeholder..."} />
        <GridFilterButtons<ITestRow>
          luiButtonProps={{ style: { whiteSpace: "nowrap" } }}
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
      </GridFilters>
      <Grid {...props} columnDefs={columnDefs} rowData={rowData} sizeColumns={"fit"} />
    </GridWrapper>
  );
};

export const FilterButtonsExample = GridFilterButtonsTemplate.bind({});
