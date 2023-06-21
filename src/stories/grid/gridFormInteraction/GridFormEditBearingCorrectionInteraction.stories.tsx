import { expect, jest } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { userEvent, within } from "@storybook/testing-library";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import { GridContextProvider, GridFormEditBearing, GridPopoverEditBearingCorrectionEditorParams } from "../../..";

export default {
  title: "GridForm / Interactions",
  component: GridFormEditBearing,
  args: {},
} as ComponentMeta<typeof GridFormEditBearing>;

const updateValue = jest.fn();

const Template: ComponentStory<typeof GridFormEditBearing> = (props) => {
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
          <GridFormEditBearing {...props} {...GridPopoverEditBearingCorrectionEditorParams} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>
  );
};

export const GridFormEditBearingCorrectionInteractions_ = Template.bind({});
GridFormEditBearingCorrectionInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByText("Press enter or tab to save")).toBeInTheDocument();

  const inputField = canvas.getByPlaceholderText("Enter bearing correction");

  // Test formatting null
  expect(await canvas.findByText("–")).toBeInTheDocument();

  // Test formatting a bearing
  expect(inputField).toBeInTheDocument();
  userEvent.type(inputField, "1.2345");
  expect(await canvas.findByText("+1° 23' 45\"")).toBeInTheDocument();

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

  // Test escape not to save
  updateValue.mockClear();
  userEvent.type(inputField, "{Escape}");
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  userEvent.type(inputField, "xxx");
  expect(await canvas.findByText("?")).toBeInTheDocument();

  expect(canvas.getByText("Bearing must be a number in D.MMSSS format")).toBeInTheDocument();
  userEvent.type(inputField, "{Enter}");
  expect(updateValue).not.toHaveBeenCalled();
  userEvent.tab();
  expect(updateValue).not.toHaveBeenCalled();
  userEvent.tab({ shift: true });
  expect(updateValue).not.toHaveBeenCalled();
};
