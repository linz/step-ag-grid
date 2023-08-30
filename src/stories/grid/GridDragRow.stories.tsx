import "../../styles/GridTheme.scss";
import "../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useMemo, useState } from "react";

import "@linzjs/lui/dist/fonts";

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
} from "../..";
import { waitForGridReady } from "../../utils/storybookTestUtil";

export default {
  title: "Components / Grids",
  component: Grid,
  args: {
    quickFilter: true,
    quickFilterValue: "",
    quickFilterPlaceholder: "Quick filter...",
    selectable: false,
    rowSelection: "single",
  },
  // Storybook hangs otherwise
  parameters: {
    docs: {
      source: {
        type: "code",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1024, height: 400, display: "flex", flexDirection: "column" }}>
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
  age: number;
  height: number;
  desc: string;
  dd: string;
}

const GridDragRowTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        lockVisible: true,
      }),
      GridCell({
        field: "position",
        headerName: "Position",
        cellRendererParams: {
          warning: (props) => props.value === "Tester" && "Testers are testing",
          info: (props) => props.value === "Developer" && "Developers are awesome",
        },
      }),
      GridCell({
        field: "age",
        headerName: "Age",
      }),
      GridCell({
        field: "height",
        headerName: "Height",
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
    { id: 1000, position: "Tester", age: 30, height: `6'4"`, desc: "Tests application", dd: "1" },
    { id: 1001, position: "Developer", age: 12, height: `5'3"`, desc: "Develops application", dd: "2" },
    { id: 1002, position: "Manager", age: 65, height: `5'9"`, desc: "Manages", dd: "3" },
    { id: 1003, position: "BA", age: 42, height: `5'7"`, desc: "BAs", dd: "4" },
  ]);

  return (
    <GridWrapper maxHeight={300}>
      <Grid
        data-testid={"readonly"}
        {...props}
        selectable={true}
        rowSelection="multiple"
        animateRows={true}
        columnDefs={columnDefs}
        defaultColDef={{ sortable: false }}
        rowData={rowData}
        onRowDragEnd={(row, _, targetIndex) => {
          alert(`Row ${row.id} request to be moved to index ${targetIndex}.`);
        }}
        rowDragText={(params) => `${params.rowNode?.data.id} - ${params.rowNode?.data.position}`}
      />
    </GridWrapper>
  );
};

export const DragRowSingleSelection = GridDragRowTemplate.bind({});
DragRowSingleSelection.play = waitForGridReady;
