import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { Grid, AgGridProps } from "../../components/Grid";
import { useMemo, useState } from "react";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { wait } from "../../utils/util";
import { ICellRendererParams } from "ag-grid-community";
import { GridPopoutEditBearing } from "../../components/GridPopoutEditBearing";

export default {
  title: "Components / Grids",
  component: Grid,
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
} as ComponentMeta<typeof Grid>;

interface ITestRow {
  id: number;
  bearing: number | null;
}

const GridReadOnlyTemplate: ComponentStory<typeof Grid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = useMemo(
    () => [
      {
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      },
      GridPopoutEditBearing({
        field: "bearing",
        headerName: "Bearing",
        initialWidth: 65,
        maxWidth: 150,
        cellRendererParams: {
          warning: (props: ICellRendererParams) => props.data.id == 1002 && "Testers are testing",
          info: (props: ICellRendererParams) => props.data.id == 1001 && "Developers are developing",
        },
        cellEditorParams: {
          placeHolder: "Enter Bearing",
          multiEdit: false,
        },
      }),
      GridPopoutEditBearing<ITestRow, number | null>({
        field: "bearing",
        headerName: "Bearing callback",
        initialWidth: 65,
        maxWidth: 150,
        cellRendererParams: {
          warning: (props: ICellRendererParams) => props.data.id == 1002 && "Testers are testing",
          info: (props: ICellRendererParams) => props.data.id == 1001 && "Developers are developing",
        },
        cellEditorParams: {
          placeHolder: "Enter bearing correction...",
          multiEdit: true,
          onSave: async (selectedRows, value) => {
            await wait(1000);
            // eslint-disable-next-line no-console
            console.log({ selectedRows, value });
            return true;
          },
        },
      }),
    ],
    [],
  );

  const rowData = useMemo(
    () =>
      [
        { id: 1000, bearing: 1.234 },
        { id: 1001, bearing: 1.565 },
        { id: 1002, bearing: null },
      ] as ITestRow[],
    [],
  );

  return (
    <Grid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
    />
  );
};

export const Bearings = GridReadOnlyTemplate.bind({});
