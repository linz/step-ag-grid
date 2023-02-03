import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import {
  GridFormPopoverMenu,
  PopoutMenuSeparator,
  SelectedMenuOptionResult,
} from "../../../components/gridForm/GridFormPopoverMenu";
import { GridContextProvider } from "../../../contexts/GridContextProvider";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { jest, expect } from "@storybook/jest";
import { GridBaseRow } from "../../../components/Grid";

export default {
  title: "GridForm / Interaction Tests",
  component: GridFormPopoverMenu,
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
          <GridFormPopoverMenu
            {...props}
            options={async () => [
              { label: "Enabled", value: 1, action: enabledAction },
              PopoutMenuSeparator,
              { label: "Disabled", value: 0, disabled: true, action: disabledAction },
              { label: "ERROR! this should be hidden", value: 3, hidden: true },
            ]}
          />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>
  );
};

export const GridFormPopoverMenuInteractions_ = Template.bind({});
GridFormPopoverMenuInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const enabledMenuOption = await canvas.findByRole("menuitem", { name: "Enabled" });
  expect(enabledMenuOption).toBeInTheDocument();
  userEvent.click(enabledMenuOption);
  expect(enabledAction).toHaveBeenCalled();

  enabledAction.mockClear();
  const disabledMenuOption = await canvas.findByRole("menuitem", { name: "Disabled" });
  expect(disabledMenuOption).toBeInTheDocument();
  userEvent.click(disabledMenuOption);
  expect(disabledAction).not.toHaveBeenCalled();
};
