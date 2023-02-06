import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridFormTextArea } from "../../../components/gridForm/GridFormTextArea";
import { GridContextProvider } from "../../../contexts/GridContextProvider";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";
import { userEvent, within } from "@storybook/testing-library";
import { expect, jest } from "@storybook/jest";

export default {
  title: "GridForm / Interaction Tests",
  component: GridFormTextArea,
  args: {},
} as ComponentMeta<typeof GridFormTextArea>;

const updateValue = jest.fn();

const Template: ComponentStory<typeof GridFormTextArea> = (props) => {
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
          <GridFormTextArea {...props} required={true} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>
  );
};

export const GridFormTextAreaInteractions_ = Template.bind({});
GridFormTextAreaInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByText("Must not be empty")).toBeInTheDocument();

  const inputField = canvas.getByPlaceholderText("Type here");
  userEvent.type(inputField, "Hello");

  expect(await canvas.findByText("Press tab to save")).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab

  // Test shift+tab to save
  updateValue.mockClear();
  userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test escape not to save
  updateValue.mockClear();
  userEvent.type(inputField, "{Escape}");
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  userEvent.clear(inputField);

  expect(canvas.getByText("Must not be empty")).toBeInTheDocument();
  userEvent.tab();
  expect(updateValue).not.toHaveBeenCalled();
  userEvent.tab({ shift: true });
  expect(updateValue).not.toHaveBeenCalled();
};
