import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { useRef } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import {
  GridFormMultiSelect,
  GridFormMultiSelectProps,
  GridFormMultiSelectSaveProps,
  MultiSelectOption,
} from "../../../components/gridForm/GridFormMultiSelect";
import { GridContextProvider } from "../../../contexts/GridContextProvider";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { GridFormSubComponentTextInput } from "../../../components/gridForm/GridFormSubComponentTextInput";
import { userEvent, within } from "@storybook/testing-library";
import { expect, jest } from "@storybook/jest";

export default {
  title: "GridForm / Interactions",
  component: GridFormMultiSelect,
  args: {},
} as ComponentMeta<typeof GridFormMultiSelect>;

const updateValue = jest
  .fn<void, [saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1]>()
  .mockImplementation((saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) => saveFn([]));

const onSave = jest.fn<Promise<boolean>, [GridFormMultiSelectSaveProps<any>]>().mockImplementation(async () => true);

const options = Object.freeze([
  { label: "Zero", value: 0 },
  { label: "One", value: 1 },
  {
    label: "Sub component",
    value: 2,
    subComponent: () => (
      <GridFormSubComponentTextInput placeholder={"Text input"} maxLength={5} required defaultValue={""} />
    ),
  },
]) as MultiSelectOption[];

const Template: ComponentStory<typeof GridFormMultiSelect> = (props) => {
  const config: GridFormMultiSelectProps<any> = {
    filtered: true,
    onSave,
    options,
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
            <GridFormMultiSelect {...props} {...config} />
          </GridPopoverContext.Provider>
        </div>
      </GridContextProvider>
    </div>
  );
};

export const GridFormMultiSelectInteractions_ = Template.bind({});
GridFormMultiSelectInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const getOption = (name: RegExp | string) => canvas.findByRole("menuitem", { name });

  // Check enabled menu handles click
  const zeroMenuOption = await getOption(/Zero/);
  expect(zeroMenuOption).toBeInTheDocument();

  userEvent.click(zeroMenuOption);
  userEvent.keyboard("{Tab}");
  expect(updateValue).toHaveBeenCalled();
  expect(onSave).toHaveBeenCalledWith({ selectedOptions: [options[0]], selectedRows: [] });

  // Check sub menu works
  const subTextInput = await getOption(/Sub component/);
  expect(subTextInput).toBeInTheDocument();

  expect(canvas.queryByPlaceholderText("Text input")).not.toBeInTheDocument();

  userEvent.click(subTextInput);
  const textInput = await canvas.findByPlaceholderText("Text input");
  expect(textInput).toBeInTheDocument();
  expect(await canvas.findByText("Must not be empty")).toBeInTheDocument();

  userEvent.type(textInput, "Hello");
  expect(await canvas.findByText("Press enter or tab to save")).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  onSave.mockClear();
  userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab
  expect(onSave).toHaveBeenCalledWith({
    selectedRows: [],
    selectedOptions: [
      { label: "Zero", value: 0, checked: true },
      { label: "Sub component", value: 2, checked: true, subValue: "Hello", subComponent: expect.anything() },
    ],
  });

  // Test shift+tab to save
  updateValue.mockClear();
  onSave.mockClear();
  userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab
  expect(onSave).toHaveBeenCalled();

  // Test escape to not save
  updateValue.mockClear();
  onSave.mockClear();
  userEvent.type(textInput, "{Escape}");
  expect(updateValue).not.toHaveBeenCalled();
  expect(onSave).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  onSave.mockClear();
  userEvent.clear(textInput);
  userEvent.type(textInput, "{Enter}");
  expect(updateValue).not.toHaveBeenCalled();
  expect(onSave).not.toHaveBeenCalled();
};
