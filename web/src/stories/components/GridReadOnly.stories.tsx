import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridContextProvider } from "../../contexts/GridContextProvider";
import { Grid, GridProps } from "../../components/Grid";
import { useMemo, useState } from "react";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { wait } from "../../utils/util";
import { ICellRendererParams } from "ag-grid-community";
import { GridPopoutMenu } from "../../components/GridPopoutMenu";
import { GridGenericCell } from "../../components/GridGenericCellRenderer";
import { FormMessage } from "./FormMessage";
import { GridGenericCellEditor } from "../../components/GridGenericCellEditor";

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
          <GridContextProvider>
            <Story />
          </GridContextProvider>
        </UpdatingContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof Grid>;

interface ITestRow {
  id: number;
  position: string;
  age: number;
  desc: string;
  dd: string;
}

const GridReadOnlyTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = useMemo(
    () => [
      GridGenericCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridGenericCell({
        field: "position",
        headerName: "Position",
        initialWidth: 65,
        maxWidth: 150,
        cellRendererParams: {
          warning: (props: ICellRendererParams) => props.value === "Tester" && "Testers are testing",
          info: (props: ICellRendererParams) => props.value === "Developer" && "Developers are awesome",
        },
      }),
      GridGenericCell({
        field: "age",
        headerName: "Age",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridGenericCell({
        field: "desc",
        headerName: "Description",
        initialWidth: 150,
        maxWidth: 200,
      }),
      GridGenericCellEditor({
        field: "dd",
        headerName: "Popout message",
        maxWidth: 140,
        cellRendererParams: {
          singleClickEdit: true,
          info: () => "I do popups",
        },
        cellEditorParams: {
          form: FormMessage,
          formProps: {
            a: "x",
          },
          multiEdit: false,
        },
      }),
      GridPopoutMenu<ITestRow>({
        field: "menu",
        headerName: "Menu",
        cellEditorParams: {
          options: async () => {
            // Just doing a timeout here to demonstrate deferred loading
            await wait(500);
            return [
              {
                label: "Single edit",
                action: async (selectedRows) => {
                  alert(`Single-edit: ${selectedRows.length} rows`);
                  await wait(1500);
                  return true;
                },
                multiEdit: false,
              },
              {
                label: "Multi-edit",
                action: async (selectedRows) => {
                  alert(`Multi-edit: ${selectedRows.length} rows`);
                  await wait(1500);
                  return true;
                },
                multiEdit: true,
              },
            ];
          },
        },
      }),
      GridPopoutMenu<ITestRow>({
        field: "menu",
        headerName: "Menu disabled",
        editable: false,
        cellEditorParams: {
          options: async () => {
            return [];
          },
        },
      }),
    ],
    [],
  );

  const rowData = useMemo(
    () =>
      [
        { id: 1000, position: "Tester", age: 30, desc: "Tests application", dd: "1" },
        { id: 1001, position: "Developer", age: 12, desc: "Develops application", dd: "2" },
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

export const ReadOnly = GridReadOnlyTemplate.bind({});
