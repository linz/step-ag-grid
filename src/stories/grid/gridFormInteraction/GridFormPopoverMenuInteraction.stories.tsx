import { expect, jest } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { userEvent, within } from "@storybook/testing-library";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import {
  GridBaseRow,
  GridContextProvider,
  GridFormPopoverMenu,
  GridFormSubComponentTextArea,
  GridFormSubComponentTextInput,
  PopoutMenuSeparator,
  SelectedMenuOptionResult,
} from "../../..";

export default {
  title: "GridForm / Interactions",
  component: GridFormPopoverMenu,
  decorators: [(storyFn) => <div style={{ width: 600, height: 400 }}>{storyFn()}</div>],
  args: {},
} as ComponentMeta<typeof GridFormPopoverMenu>;

const updateValue = jest
  .fn<void, [saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1]>()
  .mockImplementation(async (saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) => {
    await saveFn([]);
  });

const enabledAction = jest
  .fn<Promise<void>, [{ selectedRows: GridBaseRow[]; menuOption: SelectedMenuOptionResult<GridBaseRow> }]>()
  .mockResolvedValue(undefined);

const disabledAction = jest
  .fn<Promise<void>, [{ selectedRows: GridBaseRow[]; menuOption: SelectedMenuOptionResult<GridBaseRow> }]>()
  .mockResolvedValue(undefined);

const Template: ComponentStory<typeof GridFormPopoverMenu> = (props) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);

  return (
    <GridContextProvider>
      <h6 ref={anchorRef}>Interaction Test</h6>
      <GridPopoverContext.Provider
        value={
          {
            anchorRef,
            value: null,
            updateValue,
          } as any as GridPopoverContextType<any>
        }
      >
        <GridFormPopoverMenu
          {...props}
          options={async () => [
            { label: "Enabled", value: 1, action: enabledAction },
            PopoutMenuSeparator,
            { label: "Disabled", value: 0, disabled: true, action: disabledAction },
            {
              label: "Sub text input",
              value: 0,
              subComponent: () => (
                <GridFormSubComponentTextInput placeholder={"Text input"} maxLength={5} required defaultValue={""} />
              ),
            },
            {
              label: "Sub text area",
              value: 0,
              subComponent: () => (
                <GridFormSubComponentTextArea placeholder={"Text area"} maxLength={5} required defaultValue={""} />
              ),
            },
            { label: "ERROR! this should be hidden", value: 3, hidden: true },
          ]}
        />
      </GridPopoverContext.Provider>
    </GridContextProvider>
  );
};

export const GridFormPopoverMenuInteractions_ = Template.bind({});
GridFormPopoverMenuInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement.ownerDocument.body);

  const getOption = (name: string) => canvas.findByRole("menuitem", { name });

  const enabledMenuOption = await getOption("Enabled");
  expect(enabledMenuOption).toBeInTheDocument();
  userEvent.click(enabledMenuOption);
  expect(enabledAction).toHaveBeenCalled();

  enabledAction.mockClear();
  const disabledMenuOption = await getOption("Disabled");
  expect(disabledMenuOption).toBeInTheDocument();
  userEvent.click(disabledMenuOption);
  expect(disabledAction).not.toHaveBeenCalled();

  // Sub input tests
  const subTextInput = await getOption("Sub text input");
  expect(subTextInput).toBeInTheDocument();
  expect(canvas.queryByPlaceholderText("Text input")).not.toBeInTheDocument();

  const subTextArea = await getOption("Sub text area");
  expect(subTextArea).toBeInTheDocument();
  expect(canvas.queryByPlaceholderText("Text area")).not.toBeInTheDocument();

  userEvent.click(subTextInput);
  const textInput = await canvas.findByPlaceholderText("Text input");
  expect(textInput).toBeInTheDocument();
  expect(await canvas.findByText("Must not be empty")).toBeInTheDocument();
  expect(canvas.queryByPlaceholderText("Text area")).not.toBeInTheDocument();

  userEvent.type(textInput, "Hello");
  expect(await canvas.findByText("Press enter or tab to save")).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab

  // Test shift+tab to save
  updateValue.mockClear();
  userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test escape to not save
  updateValue.mockClear();
  userEvent.type(textInput, "{Escape}");
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  userEvent.clear(textInput);
  userEvent.type(textInput, "{Enter}");
  expect(updateValue).not.toHaveBeenCalled();

  // Sub text area tests
  subTextArea.click();

  const textArea = await canvas.findByPlaceholderText("Text area");
  expect(textArea).toBeInTheDocument();
  expect(await canvas.findByText("Must not be empty")).toBeInTheDocument();
  expect(canvas.queryByPlaceholderText("Text input")).not.toBeInTheDocument();

  userEvent.type(textArea, "Hello");
  expect(await canvas.findByText("Press tab to save")).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab

  // Test shift+tab to save
  updateValue.mockClear();
  userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test escape to not save
  updateValue.mockClear();
  userEvent.type(textArea, "{Escape}");
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  userEvent.clear(textArea);
  userEvent.type(textArea, "{Enter}");
  expect(updateValue).not.toHaveBeenCalled();
};
