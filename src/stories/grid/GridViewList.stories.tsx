import "../../styles/GridTheme.scss";
import "../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { Meta, StoryFn } from "@storybook/react";
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

export default {
  title: "Components / Grids",
  component: Grid,
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
} as Meta<typeof Grid>;

interface ITestRow {
  id: number;
  position: string;
  age: number;
  height: string;
  desc: string;
  dd: string;
}

const GridReadOnlyTemplate: StoryFn<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        lockVisible: true,
        resizable: false,
        lockPosition: "left",
        cellRenderer: (props) => {
          return <a href={"#"}>{props.value}</a>;
        },
      }),
      GridCell({
        field: "position",
        headerName: "Position",
        resizable: false,
        lockPosition: "left",
        cellRendererParams: {
          warning: (props) => props.value === "Tester" && "Testers are testing",
          info: (props) => props.value === "Developer" && "Developers are awesome",
        },
      }),
      GridCell({
        field: "desc",
        headerName: "Description",
        resizable: false,
        lockPosition: "left",
      }),
      GridCell({
        field: "age",
        headerName: "Age",
        resizable: false,
        lockPosition: "left",
      }),
      GridCell({
        field: "height",
        headerName: "Height",
        resizable: false,
        lockPosition: "left",
      }),
    ],
    [],
  );

  const [rowData] = useState<ITestRow[]>([
    { id: 1000, position: "Tester", age: 30, height: `6'4"`, desc: "Tests application", dd: "1" },
    { id: 1001, position: "Developer", age: 12, height: `5'3"`, desc: "Develops application", dd: "2" },
    { id: 1002, position: "Manager", age: 65, height: `5'9"`, desc: "Manages", dd: "3" },
  ]);

  return (
    <GridWrapper maxHeight={400}>
      <Grid
        data-testid={"readonly"}
        {...props}
        selectable={false}
        rowSelection={"single"}
        externalSelectedItems={externalSelectedItems}
        setExternalSelectedItems={setExternalSelectedItems}
        columnDefs={columnDefs}
        rowData={rowData}
        sizeColumns={"fit"}
        theme={"ag-theme-step-view-list-default"}
        contextMenuSelectRow={false}
      />
    </GridWrapper>
  );
};
export const ListViewGrid = GridReadOnlyTemplate.bind({});
