import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import {
  GridFormDropDown,
  GridFormDropDownProps,
  GridPopoutEditDropDownSelectedItem,
} from "../../../components/gridForm/GridFormDropDown";
import { GridContextProvider } from "../../../contexts/GridContextProvider";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";
import { GridFormSubComponentTextInput } from "../../../components/gridForm/GridFormSubComponentTextInput";
import { GridFormSubComponentTextArea } from "../../../components/gridForm/GridFormSubComponentTextArea";
import { userEvent, within } from "@storybook/testing-library";
import { expect, jest } from "@storybook/jest";

export default {
  title: "GridForm / Interactions",
  component: GridFormDropDown,
  args: {},
} as ComponentMeta<typeof GridFormDropDown>;

const updateValue = jest
  .fn<void, [saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1]>()
  .mockImplementation((saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) => saveFn([]));

const onSelectedItem = jest.fn<Promise<void>, [GridPopoutEditDropDownSelectedItem<any>]>().mockResolvedValue(undefined);

const Template: ComponentStory<typeof GridFormDropDown> = (props) => {
  const config: GridFormDropDownProps<any> = {
    filtered: "local",
    onSelectedItem,
    options: [
      { label: "Enabled", value: 1 },
      { label: "Disabled", value: 0, disabled: true },
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

  updateValue.mockClear();
  onSelectedItem.mockClear();
  const enabledMenuOption = await getOption("Enabled");
  expect(enabledMenuOption).toBeInTheDocument();

  userEvent.click(enabledMenuOption);
  expect(updateValue).toHaveBeenCalled();
  expect(onSelectedItem).toHaveBeenCalled();

  updateValue.mockClear();
  onSelectedItem.mockClear();
  const disabledMenuOption = await getOption("Disabled");
  userEvent.click(disabledMenuOption);
  expect(updateValue).not.toHaveBeenCalled();
  expect(onSelectedItem).not.toHaveBeenCalled();
};
