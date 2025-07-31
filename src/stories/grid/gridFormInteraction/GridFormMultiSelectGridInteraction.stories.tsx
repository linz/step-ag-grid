import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { StoryFn } from '@storybook/react-vite';
import { GridPopoverContext } from 'contexts/GridPopoverContext';
import { useRef } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { GridContext, GridFormMultiSelectGrid, GridFormMultiSelectGridProps, MultiSelectGridOption } from '../../..';

export default {
  title: 'GridForm / Interactions',
  component: GridFormMultiSelectGrid,
  args: {},
};

const updateValue = fn((saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) => saveFn([]));

// eslint-disable-next-line @typescript-eslint/require-await
const onSave = fn(async () => true);
const onSelectFilter = fn();

const five = <div>Five</div>;
let options: MultiSelectGridOption[] = [];
const Template: StoryFn<typeof GridFormMultiSelectGrid> = (props: GridFormMultiSelectGridProps<any>) => {
  options = [
    { label: 'Zero', value: 0 },
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3 },
    { label: 'Four', value: 4 },
    { label: five, value: 5 },
  ];
  const config: GridFormMultiSelectGridProps<any> = {
    onSave,
    options,
    maxRowCount: 3,
  };
  const anchorRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className={'react-menu-inline-test'}>
      <GridContext.Provider
        value={
          {
            stopEditing: () => {},
            cancelEdit: () => {},
          } as any
        }
      >
        <h6 ref={anchorRef}>Interaction test</h6>
        <GridPopoverContext.Provider
          value={{
            anchorRef: anchorRef,
            updateValue,
            colId: '',
            value: '',
            selectedRows: [],
            formatValue: (value) => value,
            setSaving: () => {},
            saving: false,
            data: { value: '' },
            field: 'value',
          }}
        >
          <GridFormMultiSelectGrid {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>
  );
};

export const GridFormMultiSelectGridInteractions_: typeof Template = Template.bind({});
GridFormMultiSelectGridInteractions_.play = async ({ canvasElement }) => {
  updateValue.mockClear();
  onSave.mockClear();
  onSelectFilter.mockClear();

  const canvas = within(canvasElement);

  const getOption = (name: RegExp | string) => canvas.findByRole('menuitem', { name });

  // Check enabled menu handles click
  const zeroMenuOption = await getOption(/Zero/);
  expect(zeroMenuOption).toBeInTheDocument();

  await userEvent.click(zeroMenuOption);
  await userEvent.keyboard('{Tab}');
  expect(updateValue).toHaveBeenCalled();
  await waitFor(() => expect(onSave).toHaveBeenCalledWith({ selectedRows: [], addValues: [0], removeValues: [] }));

  const check = (label: string) => {
    const activeCell = canvasElement.ownerDocument.activeElement as HTMLElement | null;
    expect(activeCell?.innerText).toBe(label);
  };

  // Test left/right arrow
  await userEvent.keyboard('{ArrowRight}');
  check('Three');
  await userEvent.keyboard('{ArrowRight}');
  check('Zero');
  await userEvent.keyboard('{ArrowLeft}');
  check('Three');
  await userEvent.keyboard('{ArrowLeft}');
  check('Zero');

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
