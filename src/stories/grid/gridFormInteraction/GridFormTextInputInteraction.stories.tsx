import "../../../react-menu3/styles/index.scss";
import "../../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { expect, jest } from "@storybook/jest";
import { Meta, StoryFn } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";

import { GridContextProvider, GridFormTextInput, GridFormTextInputProps } from "../../..";

export default {
  title: "GridForm / Interactions",
  component: GridFormTextInput,
  args: {},
} as Meta<typeof GridFormTextInput>;

const updateValue = jest.fn();

const Template: StoryFn<typeof GridFormTextInput> = (props: GridFormTextInputProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className={"react-menu-inline-test"}>
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
          <GridFormTextInput {...props} required={true} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>
  );
};

export const GridFormTextInputInteractions_ = Template.bind({});
GridFormTextInputInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByText("Must not be empty")).toBeInTheDocument();

  const inputField = canvas.getByPlaceholderText("Type here");
  await userEvent.type(inputField, "Hello");

  expect(canvas.getByText("Press enter or tab to save")).toBeInTheDocument();

  // Test enter to save
  updateValue.mockClear();
  await userEvent.type(inputField, "{Enter}");
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 0); // 0 = Enter

  // Test tab to save
  updateValue.mockClear();
  await userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab

  // Test shift+tab to save
  updateValue.mockClear();
  await userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test escape not to save
  updateValue.mockClear();
  await userEvent.type(inputField, "{Escape}");
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  await userEvent.clear(inputField);

  expect(canvas.getByText("Must not be empty")).toBeInTheDocument();
  await userEvent.type(inputField, "{Enter}");
  expect(updateValue).not.toHaveBeenCalled();
  await userEvent.tab();
  expect(updateValue).not.toHaveBeenCalled();
  await userEvent.tab({ shift: true });
  expect(updateValue).not.toHaveBeenCalled();
};
