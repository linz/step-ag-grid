import { expect, jest } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import {
  GridContextProvider,
  GridFormMultiSelectGrid,
  GridFormMultiSelectGridProps,
  GridFormMultiSelectGridSaveProps,
  MultiSelectGridOption,
} from "../../..";

export default {
  title: "GridForm / Interactions",
  component: GridFormMultiSelectGrid,
  args: {},
} as ComponentMeta<typeof GridFormMultiSelectGrid>;

const updateValue = jest
  .fn<void, [saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1]>()
  .mockImplementation((saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) => saveFn([]));

const onSave = jest
  .fn<Promise<boolean>, [GridFormMultiSelectGridSaveProps<any>]>()
  .mockImplementation(async () => true);
const onSelectFilter = jest.fn();

let options: MultiSelectGridOption[] = [];
const Template: ComponentStory<typeof GridFormMultiSelectGrid> = (props) => {
  options = [
    { label: "Zero", value: 0 },
    { label: "One", value: 1 },
    { label: "Two", value: 2 },
    { label: "Three", value: 3 },
    { label: "Four", value: 4 },
    { label: <div>Five</div>, value: 5 },
  ];
  const config: GridFormMultiSelectGridProps<any> = {
    onSave,
    options,
    maxRowCount: 3,
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
            <GridFormMultiSelectGrid {...props} {...config} />
          </GridPopoverContext.Provider>
        </div>
      </GridContextProvider>
    </div>
  );
};

export const GridFormMultiSelectGridInteractions_ = Template.bind({});
GridFormMultiSelectGridInteractions_.play = async ({ canvasElement }) => {
  updateValue.mockClear();
  onSave.mockClear();
  onSelectFilter.mockClear();

  const canvas = within(canvasElement);

  const getOption = (name: RegExp | string) => canvas.findByRole("menuitem", { name });

  // Check enabled menu handles click
  const zeroMenuOption = await getOption(/Zero/);
  expect(zeroMenuOption).toBeInTheDocument();

  await userEvent.click(zeroMenuOption);
  await userEvent.keyboard("{Tab}");
  expect(updateValue).toHaveBeenCalled();
  await waitFor(() => expect(onSave).toHaveBeenCalledWith({ selectedRows: [], addValues: [0], removeValues: [] }));

  const check = (label: string) => {
    const activeCell = canvasElement.ownerDocument.activeElement as HTMLElement | null;
    expect(activeCell?.innerText).toBe(label);
  };

  // Test left/right arrow
  await userEvent.keyboard("{ArrowRight}");
  check("Three");
  await userEvent.keyboard("{ArrowRight}");
  check("Zero");
  await userEvent.keyboard("{ArrowLeft}");
  check("Three");
  await userEvent.keyboard("{ArrowLeft}");
  check("Zero");

  // Test tab to save
  updateValue.mockClear();
  onSave.mockClear();
  await userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab
  expect(onSave).toHaveBeenCalledWith({
    selectedRows: [],
    addValues: [0],
    removeValues: [],
  });

  // Test shift+tab to save
  updateValue.mockClear();
  onSave.mockClear();
  await userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab
  expect(onSave).toHaveBeenCalled();
};
