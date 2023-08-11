import "../../../styles/GridTheme.scss";
import "../../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { expect, jest } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { userEvent, waitFor } from "@storybook/testing-library";
import { useMemo, useState } from "react";

import "@linzjs/lui/dist/fonts";

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridFormSubComponentTextArea,
  GridFormSubComponentTextInput,
  GridIcon,
  GridPopoverMenu,
  GridPopoverMessage,
  GridProps,
  GridUpdatingContextProvider,
  MenuOption,
  wait,
} from "../../../";

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
  dd: string;
}

const multiEditAction = jest.fn().mockImplementation(async () => {
  await wait(500);
});

const eAction = jest.fn<boolean, []>().mockReturnValue(true);

const GridKeyboardInteractionsTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
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
      }),
      GridPopoverMessage(
        {
          headerName: "Popout message",
          maxWidth: 150,
          cellRenderer: () => <>Single Click me!</>,
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
        maxWidth: 100,
        editable: true,
        valueFormatter: () => "Press E",
        cellRendererParams: {
          rightHoverElement: (
            <GridIcon icon={"ic_launch_modal"} title={"Title text"} className={"GridCell-editableIcon"} />
          ),
          editAction: () => {
            //
          },
          shortcutKeys: {
            e: eAction,
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
                  action: async () => {
                    //
                  },
                  disabled: selectedItems.length > 1,
                },
                {
                  label: "Multi-edit",
                  action: multiEditAction,
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
                  action: async () => {
                    //
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
      GridPopoverMenu(
        {
          editable: () => false,
        },
        {
          editorParams: {
            options: async () => {
              return [];
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

  return (
    <Grid
      {...props}
      selectable={true}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={"autoHeight"}
      autoSelectFirstRow={true}
    />
  );
};

export const GridKeyboardInteractions = GridKeyboardInteractionsTemplate.bind({});
GridKeyboardInteractions.play = async ({ canvasElement }) => {
  multiEditAction.mockReset();
  eAction.mockReset();

  // Ensure first row/cell is selected on render
  await waitFor(async () => {
    const activeCell = canvasElement.ownerDocument.activeElement;
    expect(activeCell).toHaveClass("ag-cell-focus");
    expect(activeCell).toHaveAttribute("aria-colindex", "1");
    expect(activeCell?.parentElement).toHaveAttribute("row-index", "0");
  });
  await userEvent.keyboard("{arrowdown}{arrowdown}");
  await userEvent.keyboard("{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}");

  // Test enter post focus
  const test = async (fn: () => any, colId: string, rowId: string) => {
    await userEvent.keyboard("{Enter}");
    await wait(1000);
    await userEvent.keyboard("{arrowdown}{arrowdown}");
    fn();
    await waitFor(async () => {
      expect(multiEditAction).toHaveBeenCalled();
    });

    await waitFor(async () => {
      const activeCell = canvasElement.ownerDocument.activeElement;
      expect(activeCell).toHaveClass("ag-cell-focus");
      expect(activeCell).toHaveAttribute("aria-colindex", colId);
      expect(activeCell?.parentElement).toHaveAttribute("row-index", rowId);
    });
    await wait(1000);
  };

  await test(() => userEvent.keyboard("{Enter}"), "8", "2");
  await test(() => userEvent.tab(), "9", "2");
  await userEvent.tab({ shift: true });
  await test(() => userEvent.tab({ shift: true }), "6", "2");
  await userEvent.keyboard("{Esc}");
  await userEvent.tab();

  await userEvent.keyboard("{Enter}");
  await wait(250);
  expect(eAction).not.toHaveBeenCalled();

  await userEvent.keyboard("e");
  await waitFor(async () => {
    expect(eAction).toHaveBeenCalled();
  });
};
