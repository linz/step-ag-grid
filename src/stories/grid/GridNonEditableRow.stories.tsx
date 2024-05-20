import "../../styles/GridTheme.scss";
import "../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { Meta, StoryFn } from "@storybook/react";
import { GridPopoverEditDropDown } from "components/gridPopoverEdit/GridPopoverEditDropDown";
import { GridPopoverTextArea } from "components/gridPopoverEdit/GridPopoverTextArea";
import { useMemo, useState } from "react";

import "@linzjs/lui/dist/fonts";

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridFormSubComponentTextArea,
  GridFormSubComponentTextInput,
  GridPopoverMenu,
  GridProps,
  GridUpdatingContextProvider,
  MenuOption,
  wait,
} from "../..";
import { waitForGridReady } from "../../utils/storybookTestUtil";

export default {
  title: "Components / Grids",
  component: Grid,
  args: {
    selectable: true,
    rowSelection: "single",
    autoSelectFirstRow: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1024, height: 400 }}>
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
  desc: string;
}

const GridNonEditableRowTemplate: StoryFn<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
      }),
      GridPopoverEditDropDown(
        {
          field: "position",
          headerName: "Position",
        },
        {
          multiEdit: true,
          editorParams: {
            filtered: "local",
            filterPlaceholder: "Filter",
            options: ["Architect", "Developer", "Product Owner", "Scrum Master", "Tester"],
          },
        },
      ),
      GridCell({
        field: "age",
        headerName: "Age",
      }),
      GridPopoverTextArea(
        {
          field: "desc",
          headerName: "Description",
        },
        {},
      ),
      GridPopoverMenu(
        {},
        {
          multiEdit: true,
          editorParams: {
            options: async (selectedItems) => {
              // Just doing a timeout here to demonstrate deferred loading
              await wait(500);
              return [
                {
                  label: "Single edit only",
                  action: async ({ selectedRows }) => {
                    alert(`Single-edit: ${selectedRows.map((r) => r.id)} rowId(s) selected`);
                    await wait(1500);
                  },
                  disabled: selectedItems.length > 1,
                },
                {
                  label: "Multi-edit",
                  action: async ({ selectedRows }) => {
                    alert(`Multi-edit: ${selectedRows.map((r) => r.id)} rowId(s) selected`);
                    await wait(1500);
                  },
                },
                {
                  label: "Disabled item",
                  disabled: "Disabled for test",
                },
                {
                  label: "Developer Only",
                  hidden: selectedItems.some((x) => x.position != "Developer"),
                },
                {
                  label: "Other (TextInput)",
                  action: async ({ menuOption }) => {
                    // eslint-disable-next-line no-console
                    console.log(`Sub selected value was ${JSON.stringify(menuOption.subValue)}`);
                    await wait(500);
                  },
                  subComponent: () => (
                    <GridFormSubComponentTextInput placeholder={"Other"} maxLength={5} required defaultValue={""} />
                  ),
                },
                {
                  label: "Other (TextArea)",
                  action: async ({ menuOption }) => {
                    // eslint-disable-next-line no-console
                    console.log(`Sub selected value was ${JSON.stringify(menuOption.subValue)}`);
                    await wait(500);
                  },
                  subComponent: () => (
                    <GridFormSubComponentTextArea placeholder={"Other"} maxLength={5} required defaultValue={""} />
                  ),
                },
              ] as MenuOption<ITestRow>[];
            },
          },
        },
      ),
    ],
    [],
  );

  const [rowData] = useState([
    { id: 1000, position: "Tester", age: 30, desc: "Tests application", dd: "1" },
    { id: 1001, position: "Developer", age: 12, desc: "Develops application", dd: "2" },
    { id: 1002, position: "Manager", age: 65, desc: "Manages", dd: "3" },
  ]);

  const defaultColDef: ColDefT<ITestRow> = useMemo(
    () => ({
      editable: ({ data }) => data?.position !== "Manager",
    }),
    [],
  );

  return (
    <Grid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={"autoHeight"}
    />
  );
};

export const _NonEditableRow = GridNonEditableRowTemplate.bind({});
_NonEditableRow.play = waitForGridReady;
