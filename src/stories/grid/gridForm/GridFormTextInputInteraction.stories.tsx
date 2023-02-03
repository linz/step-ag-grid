import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridFormTextInput } from "../../../components/gridForm/GridFormTextInput";
import { GridContextProvider } from "../../../contexts/GridContextProvider";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";
import { userEvent, within } from "@storybook/testing-library";
import { expect, jest } from "@storybook/jest";

export default {
  title: "GridForm / Interaction Tests",
  component: GridFormTextInput,
  args: {},
} as ComponentMeta<typeof GridFormTextInput>;

const updateValue = jest.fn();

const Template: ComponentStory<typeof GridFormTextInput> = (props) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        <h6 ref={anchorRef}>Test</h6>
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
  userEvent.type(inputField, "Hello");

  expect(canvas.getByText("Press enter or tab to save")).toBeInTheDocument();

  // Test enter to save
  updateValue.mockClear();
  userEvent.type(inputField, "{Enter}");
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 0); // 0 = Enter

  // Test tab to save
  updateValue.mockClear();
  userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab

  // Test shift+tab to save
  updateValue.mockClear();
  userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test shift+tab to save
  updateValue.mockClear();
  userEvent.type(inputField, "{Escape}");
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  userEvent.clear(inputField);

  expect(canvas.getByText("Must not be empty")).toBeInTheDocument();
  userEvent.type(inputField, "{Enter}");
  expect(updateValue).not.toHaveBeenCalled();
  userEvent.tab();
  expect(updateValue).not.toHaveBeenCalled();
  userEvent.tab({ shift: true });
  expect(updateValue).not.toHaveBeenCalled();
};
