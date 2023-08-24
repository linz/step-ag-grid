import "../../../react-menu3/styles/index.scss";
import "../../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { expect, jest } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { userEvent, within } from "@storybook/testing-library";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";

import { GridContextProvider, GridFormTextInput, GridFormTextInputProps } from "../../..";

export default {
  title: "GridForm / Interactions",
  component: GridFormTextInput,
  decorators: [(storyFn) => <div style={{ width: 600, height: 400 }}>{storyFn()}</div>],
  args: {},
} as ComponentMeta<typeof GridFormTextInput>;

const updateValue = jest.fn();

const Template: ComponentStory<typeof GridFormTextInput> = (props: GridFormTextInputProps<any>) => {
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
        <GridFormTextInput {...props} required={true} />
      </GridPopoverContext.Provider>
    </GridContextProvider>
  );
};

export const GridFormTextInputInteractions_ = Template.bind({});
GridFormTextInputInteractions_.play = async () => {
  const canvas = within(document.body);

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
