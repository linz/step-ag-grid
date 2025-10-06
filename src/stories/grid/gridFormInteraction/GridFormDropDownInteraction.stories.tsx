import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { StoryFn } from '@storybook/react-vite';
import { GridPopoverContext } from 'contexts/GridPopoverContext';
import { useRef } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import {
  GridBaseRow,
  GridContextProvider,
  GridFormDropDown,
  GridFormDropDownProps,
  GridFormSubComponentTextInput,
} from '../../..';

export default {
  title: 'GridForm / Interactions',
  component: GridFormDropDown,
  args: {},
};

const updateValue = fn(async (saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) =>
  saveFn([]),
);

const onSelectedItem = fn(async () => {});

const Template: StoryFn<typeof GridFormDropDown<GridBaseRow, number>> = (
  props: GridFormDropDownProps<GridBaseRow, number>,
) => {
  const config: GridFormDropDownProps<GridBaseRow, number> = {
    filtered: 'local',
    onSelectedItem,
    options: [
      { label: 'Enabled', value: 1 },
      { label: 'Disabled', value: 0, disabled: true },
      {
        label: 'Sub menu',
        value: 0,
        subComponent: () => (
          <GridFormSubComponentTextInput placeholder={'Text input'} maxLength={5} required defaultValue={''} />
        ),
      },
    ],
  };
  const anchorRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        <h6 ref={anchorRef}>Interaction test</h6>
        <GridPopoverContext.Provider
          value={{
            anchorRef,
            updateValue,
            data: { value: '' },
            colId: '',
            value: '',
            field: 'value',
            selectedRows: [],
            formatValue: () => '',
            saving: false,
            setSaving: () => {},
            stopEditing: () => {},
          }}
        >
          <GridFormDropDown {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>
  );
};

export const GridFormDropDownInteractions_: typeof Template = Template.bind({});
GridFormDropDownInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const getOption = (name: string) => canvas.findByRole('menuitem', { name });

  // Check enabled menu handles click
  const enabledMenuOption = await getOption('Enabled');
  expect(enabledMenuOption).toBeInTheDocument();

  await userEvent.click(enabledMenuOption);
  expect(updateValue).toHaveBeenCalled();
  expect(onSelectedItem).toHaveBeenCalled();

  // Check disabled menu ignores click
  updateValue.mockClear();
  onSelectedItem.mockClear();
  const disabledMenuOption = await getOption('Disabled');
  await userEvent.click(disabledMenuOption);
  expect(updateValue).not.toHaveBeenCalled();
  expect(onSelectedItem).not.toHaveBeenCalled();

  // Check sub menu works
  const subTextInput = await getOption('Sub menu...');
  expect(subTextInput).toBeInTheDocument();

  expect(canvas.queryByPlaceholderText('Text input')).not.toBeInTheDocument();

  await userEvent.click(subTextInput);
  const textInput = await canvas.findByPlaceholderText('Text input');
  expect(textInput).toBeInTheDocument();
  expect(await canvas.findByText('Must not be empty')).toBeInTheDocument();

  await userEvent.type(textInput, 'Hello');
  expect(await canvas.findByText('Press enter or tab to save')).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  await userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = tab

  // Test shift+tab to save
  updateValue.mockClear();
  await userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test escape to not save
  updateValue.mockClear();
  await userEvent.type(textInput, '{Escape}');
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 0);

  // Test invalid value doesn't save
  updateValue.mockClear();
  await userEvent.clear(textInput);
  await userEvent.type(textInput, '{Enter}');
  expect(updateValue).not.toHaveBeenCalled();

  // Test filter
  const filterText = await canvas.findByPlaceholderText('Filter...');
  await userEvent.type(filterText, 'ena');
  expect(canvas.queryByText('Enabled')).toBeInTheDocument();
  expect(canvas.queryByText('Disabled')).not.toBeInTheDocument();
  expect(canvas.queryByText('Sub menu...')).not.toBeInTheDocument();
};
