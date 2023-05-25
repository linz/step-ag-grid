import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useCallback, useMemo, useState } from "react";

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
  GridFormSubComponentTextArea,
  GridFormSubComponentTextInput,
  GridIcon,
  GridPopoverMenu,
  GridPopoverMessage,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
  useGridFilter,
  wait,
} from "../..";
import { GridFilterColumnsToggle } from "../../components";
import { GridFilterDownloadCsvButton } from "../../components";
import "../../styles/GridTheme.scss";
import "../../styles/index.scss";

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
  desc: string;
  dd: string;
}

const GridReadOnlyTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
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
        field: "desc",
        headerName: "Description",
        flex: 1,
      }),
      GridPopoverMessage(
        {
          headerName: "Popout message",
          cellRenderer: () => <>Single Click me!</>,
          exportable: false,
        },
        {
          multiEdit: true,
          editorParams: {
            message: async (selectedRows): Promise<string> => {
              await wait(1000);
              return `There are ${selectedRows.length} row(s) selected`;
            },
          },
        },
      ),
      GridCell({
        headerName: "Custom edit",
        editable: true,
        valueFormatter: () => "Press E",
        cellRendererParams: {
          rightHoverElement: (
            <GridIcon icon={"ic_launch_modal"} title={"Title text"} className={"GridCell-editableIcon"} />
          ),
          editAction: (selectedRows) => {
            alert(`Custom edit ${selectedRows.map((r) => r.id)} rowId(s) selected`);
          },
          shortcutKeys: {
            e: () => {
              alert("Hi");
            },
          },
        },
      }),
      GridPopoverMenu(
        {},
        {
          multiEdit: true,
          editorParams: {
            defaultAction: async ({ menuOption }) => {
              // eslint-disable-next-line no-console
              console.log("clicked", { menuOption });
            },
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
              ];
            },
          },
        },
      ),
    ],
    [],
  );

  const [rowData] = useState([
    { id: 1000, position: "Tester", age: 30, desc: "Tests application", dd: "1" },
    {
      id: 1001,
      position: "Developer",
      age: 12,
      desc: "Develops application extra text extra text extra text extra text extra textextra text extra text extra text extra text extra textextra text extra text extra text extra text extra textextra text extra text extra text extra text extra text",
      dd: "2",
    },
    { id: 1002, position: "Manager", age: 65, desc: "Manages", dd: "3" },
  ]);

  return (
    <GridWrapper maxHeight={300}>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterLessThan text="Age <" field={"age"} />
        <GridFilterButtons<ITestRow>
          luiButtonProps={{ style: { whiteSpace: "nowrap" } }}
          options={[
            {
              label: "All",
            },
            {
              label: "< 30",
              filter: (row) => row.age < 30,
            },
          ]}
        />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={"readOnlyGrid"} />
      </GridFilters>
      <Grid
        data-testid={"readonly"}
        {...props}
        selectable={true}
        autoSelectFirstRow={true}
        externalSelectedItems={externalSelectedItems}
        setExternalSelectedItems={setExternalSelectedItems}
        columnDefs={columnDefs}
        rowData={rowData}
        sizeColumns={"auto"}
      />
    </GridWrapper>
  );
};

const GridFilterLessThan = (props: { field: keyof ITestRow; text: string }): JSX.Element => {
  const [value, setValue] = useState<number>();

  const filter = useCallback(
    (data: ITestRow): boolean => value == null || data[props.field] < value,
    [props.field, value],
  );

  useGridFilter(filter);

  const updateValue = (newValue: string) => {
    try {
      setValue(newValue.trim() == "" ? undefined : parseInt(newValue));
    } catch {
      // ignore number parse exception
    }
  };

  return (
    <div className={"GridFilter-container flex-row-center"}>
      <div style={{ whiteSpace: "nowrap" }}>{props.text}</div>
      &#160;
      <input type={"text"} defaultValue={value} onChange={(e) => updateValue(e.target.value)} style={{ width: 64 }} />
    </div>
  );
};

export const ReadOnlySingleSelection = GridReadOnlyTemplate.bind({});
