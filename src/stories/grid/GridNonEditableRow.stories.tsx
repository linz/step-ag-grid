import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../styles/index.scss";
import "../../styles/GridTheme.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridUpdatingContextProvider } from "../../contexts/GridUpdatingContextProvider";
import { GridContextProvider } from "../../contexts/GridContextProvider";
import { Grid, GridProps } from "../../components/Grid";
import { useMemo, useState } from "react";
import { wait } from "../../utils/util";
import { GridPopoverMenu } from "../../components/gridPopoverEdit/GridPopoverMenu";
import { ColDefT, GridCell } from "../../components/GridCell";
import { MenuOption } from "../../components/gridForm/GridFormPopoverMenu";
import { GridFormSubComponentTextInput } from "../../components/gridForm/GridFormSubComponentTextInput";
import { GridFormSubComponentTextArea } from "../../components/gridForm/GridFormSubComponentTextArea";
import { GridPopoverTextArea } from "components/gridPopoverEdit/GridPopoverTextArea";
import { GridPopoverEditDropDown } from "components/gridPopoverEdit/GridPopoverEditDropDown";
import { ColDef } from "ag-grid-community";

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
} as ComponentMeta<typeof Grid>;

interface ITestRow {
  id: number;
  position: string;
  age: number;
  desc: string;
}

const GridNonEditableRowTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridPopoverEditDropDown(
        {
          field: "position",
          initialWidth: 65,
          maxWidth: 150,
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
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridPopoverTextArea(
        {
          field: "desc",
          headerName: "Description",
          initialWidth: 150,
          maxWidth: 200,
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
                  action: async (selectedRows) => {
                    alert(`Single-edit: ${selectedRows.map((r) => r.id)} rowId(s) selected`);
                    await wait(1500);
                  },
                  disabled: selectedItems.length > 1,
                },
                {
                  label: "Multi-edit",
                  action: async (selectedRows) => {
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
                  action: async (_, menuOptionResult) => {
                    // eslint-disable-next-line no-console
                    console.log(`Sub selected value was ${JSON.stringify(menuOptionResult.subValue)}`);
                    await wait(500);
                  },
                  subComponent: () => (
                    <GridFormSubComponentTextInput placeholder={"Other"} maxLength={5} required defaultValue={""} />
                  ),
                },
                {
                  label: "Other (TextArea)",
                  action: async (_, menuOptionResult) => {
                    // eslint-disable-next-line no-console
                    console.log(`Sub selected value was ${JSON.stringify(menuOptionResult.subValue)}`);
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

  const defaultColDef: ColDef = useMemo(
    () => ({
      editable: (params) => (params.data as ITestRow).position !== "Manager",
    }),
    [],
  );

  return (
    <Grid
      {...props}
      selectable={true}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={"autoHeight"}
      autoSelectFirstRow={true}
      readOnly={false}
    />
  );
};

export const NonEditableRow = GridNonEditableRowTemplate.bind({});
