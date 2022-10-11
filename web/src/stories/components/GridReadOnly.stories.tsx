import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useMemo, useState } from "react";
import { GridPopoutMessage } from "../../components/GridPopoutMessage";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { wait } from "../../utils/util";
import { ICellRendererParams } from "ag-grid-community";

export default {
  title: "Components / Grids",
  component: AgGrid,
  args: {
    externalSelectedItems: [],
    setExternalSelectedItems: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1200, height: 400, display: "flex" }}>
        <UpdatingContextProvider>
          <AgGridContextProvider>
            <Story />
          </AgGridContextProvider>
        </UpdatingContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof AgGrid>;

interface ITestRow {
  id: number;
  position: string;
  age: number;
  desc: string;
  dd: string;
}

const GridReadOnlyTemplate: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = [
    {
      field: "id",
      headerName: "Id",
      initialWidth: 65,
      maxWidth: 85,
    },
    {
      field: "position",
      headerName: "Position",
      initialWidth: 65,
      maxWidth: 150,
      cellRendererParams: {
        warning: (props: ICellRendererParams) => (props.value == "Tester" ? "Testers are testing" : ""),
        info: (props: ICellRendererParams) => (props.value == "Developer" ? "Developers are awesome" : ""),
      },
    },
    {
      field: "age",
      headerName: "Age",
      initialWidth: 65,
      maxWidth: 85,
    },
    {
      field: "desc",
      headerName: "Description",
      initialWidth: 150,
      maxWidth: 200,
    },
    GridPopoutMessage<ITestRow>({
      field: "dd",
      headerName: "Popout message",
      maxWidth: 120,
      cellEditorParams: {
        message: async (data) => {
          // Just doing a timeout here to demonstrate deferred loading
          await wait(1000);
          return <span>This cell contains the value: {JSON.stringify(data.dd)}</span>;
        },
      },
    }),
  ];

  const rowData = useMemo(
    () =>
      [
        { id: 1000, position: "Tester", age: 30, desc: "Tests application", dd: "1" },
        { id: 1001, position: "Developer", age: 12, desc: "Develops application", dd: "2" },
      ] as ITestRow[],
    [],
  );

  return (
    <AgGrid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
    />
  );
};

export const ReadOnly = GridReadOnlyTemplate.bind({});
