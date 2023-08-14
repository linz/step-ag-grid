import "../../../react-menu3/styles/index.scss";
import "../../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { expect, jest } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { userEvent, within } from "@storybook/testing-library";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";

import {
  GridContextProvider,
  GridFormDropDown,
  GridFormDropDownProps,
  GridFormSubComponentTextInput,
  GridPopoutEditDropDownSelectedItem,
} from "../../..";

export default {
  title: "GridForm / Interactions",
  component: GridFormDropDown,
  args: {},
} as ComponentMeta<typeof GridFormDropDown>;

const updateValue = jest
  .fn<void, [saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1]>()
  .mockImplementation((saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) => saveFn([]));

const onSelectedItem = jest
  .fn<Promise<void>, [GridPopoutEditDropDownSelectedItem<any>]>()
  .mockImplementation(async () => undefined);

const Template: ComponentStory<typeof GridFormDropDown> = (props: GridFormDropDownProps<any>) => {
  const config: GridFormDropDownProps<any> = {
    filtered: "local",
    onSelectedItem,
    options: [
      { label: "Enabled", value: 1 },
      { label: "Disabled", value: 0, disabled: true },
      {
        label: "Sub menu",
        value: 0,
        subComponent: () => (
          <GridFormSubComponentTextInput placeholder={"Text input"} maxLength={5} required defaultValue={""} />
        ),
      },
    ],
  };
  const anchorRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        <div>
          <h6 ref={anchorRef}>Interaction test</h6>
          <GridPopoverContext.Provider
            value={
              {
                anchorRef: anchorRef,
                updateValue,
                data: { value: "" },
                value: "",
                field: "value",
                selectedRows: [],
              } as any as GridPopoverContextType<any>
            }
          >
            <GridFormDropDown {...props} {...config} />
          </GridPopoverContext.Provider>
        </div>
      </GridContextProvider>
    </div>
  );
};

export const GridFormDropDownInteractions_ = Template.bind({});
GridFormDropDownInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const getOption = (name: string) => canvas.findByRole("menuitem", { name });

  // Check enabled menu handles click
  const enabledMenuOption = await getOption("Enabled");
  expect(enabledMenuOption).toBeInTheDocument();

  await userEvent.click(enabledMenuOption);
  expect(updateValue).toHaveBeenCalled();
  expect(onSelectedItem).toHaveBeenCalled();

  // Check disabled menu ignores click
  updateValue.mockClear();
  onSelectedItem.mockClear();
  const disabledMenuOption = await getOption("Disabled");
  await userEvent.click(disabledMenuOption);
  expect(updateValue).not.toHaveBeenCalled();
  expect(onSelectedItem).not.toHaveBeenCalled();

  // Check sub menu works
  const subTextInput = await getOption("Sub menu...");
  expect(subTextInput).toBeInTheDocument();

  expect(canvas.queryByPlaceholderText("Text input")).not.toBeInTheDocument();

  await userEvent.click(subTextInput);
  const textInput = await canvas.findByPlaceholderText("Text input");
  expect(textInput).toBeInTheDocument();
  expect(await canvas.findByText("Must not be empty")).toBeInTheDocument();

  await userEvent.type(textInput, "Hello");
  expect(await canvas.findByText("Press enter or tab to save")).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  await userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab

  // Test shift+tab to save
  updateValue.mockClear();
  await userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test escape to not save
  updateValue.mockClear();
  await userEvent.type(textInput, "{Escape}");
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  await userEvent.clear(textInput);
  await userEvent.type(textInput, "{Enter}");
  expect(updateValue).not.toHaveBeenCalled();

  // Test filter
  const filterText = await canvas.findByPlaceholderText("Filter...");
  await userEvent.type(filterText, "ena");
  expect(canvas.queryByText("Enabled")).toBeInTheDocument();
  expect(canvas.queryByText("Disabled")).not.toBeInTheDocument();
  expect(canvas.queryByText("Sub menu...")).not.toBeInTheDocument();
};
