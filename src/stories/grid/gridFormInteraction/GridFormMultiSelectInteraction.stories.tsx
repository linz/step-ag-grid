import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { StoryFn } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { GridPopoverContext } from 'contexts/GridPopoverContext';
import { useRef } from 'react';

import {
  GridContext,
  GridFormMultiSelect,
  GridFormMultiSelectProps,
  GridFormSubComponentTextInput,
  MultiSelectOption,
  wait,
} from '../../..';

export default {
  title: 'GridForm / Interactions',
  component: GridFormMultiSelect,
  args: {},
};

const updateValue = fn((saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) => saveFn([]));

const onSave = fn();
const onSelectFilter = fn();

let options: MultiSelectOption[] = [];
const Template: StoryFn<typeof GridFormMultiSelect> = (props: GridFormMultiSelectProps<any>) => {
  options = [
    { label: 'Zero', value: 0 },
    { label: 'One', value: 1 },
    {
      label: 'Sub component',
      value: 2,
      subComponent: () => (
        <GridFormSubComponentTextInput placeholder={'Text input'} maxLength={5} required defaultValue={''} />
      ),
    },
    { label: 'Other', value: 3 },
  ];
  const config: GridFormMultiSelectProps<any> = {
    filtered: true,
    onSelectFilter,
    filterHelpText: 'Press enter to add free-text',
    onSave,
    options,
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
            anchorRef,
            updateValue,
            data: { value: '' },
            colId: '',
            value: '',
            field: 'value',
            selectedRows: [],
            saving: false,
            setSaving: () => {},
            formatValue: (value) => value,
          }}
        >
          <GridFormMultiSelect {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>
  );
};

export const GridFormMultiSelectInteractions_: typeof Template = Template.bind({});
GridFormMultiSelectInteractions_.play = async ({ canvasElement }) => {
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
  expect(onSave).toHaveBeenCalledWith({ selectedOptions: [options[0]], selectedRows: [] });

  // Check sub menu works
  const subTextInput = await getOption(/Sub component/);
  expect(subTextInput).toBeInTheDocument();

  expect(canvas.queryByPlaceholderText('Text input')).not.toBeInTheDocument();

  await userEvent.click(subTextInput);
  const textInput = await canvas.findByPlaceholderText('Text input');
  expect(textInput).toBeInTheDocument();
  expect(await canvas.findByText('Must not be empty')).toBeInTheDocument();

  // textInput should be autofocus
  await userEvent.type(textInput, 'Hello');
  expect(await canvas.findByText('Press enter or tab to save')).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  onSave.mockClear();
  await userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab
  expect(onSave).toHaveBeenCalledWith({
    selectedRows: [],
    selectedOptions: [
      { label: 'Zero', value: 0, checked: true },
      { label: 'Sub component', value: 2, checked: true, subValue: 'Hello', subComponent: expect.anything() },
    ],
  });

  // Test shift+tab to save
  updateValue.mockClear();
  onSave.mockClear();
  await userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab
  expect(onSave).toHaveBeenCalled();

  // Test escape to not save
  updateValue.mockClear();
  onSave.mockClear();
  await userEvent.type(textInput, '{Escape}');
  expect(updateValue).not.toHaveBeenCalled();
  expect(onSave).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  onSave.mockClear();
  await userEvent.clear(textInput);
  await userEvent.type(textInput, '{Enter}');
  expect(updateValue).not.toHaveBeenCalled();
  expect(onSave).not.toHaveBeenCalled();

  // Test filter
  const filterText = await canvas.findByPlaceholderText('Filter...');
  await userEvent.type(filterText, 'o');
  await wait(500);
  expect(canvas.queryByText('One')).toBeInTheDocument();
  expect(canvas.queryByText('Other')).toBeInTheDocument();
  await userEvent.type(filterText, 'n');
  expect(canvas.queryByText('One')).toBeInTheDocument();
  expect(canvas.queryByText('Zero')).not.toBeInTheDocument();
  expect(canvas.queryByText('Sub component')).not.toBeInTheDocument();
  expect(canvas.queryByText('Other')).not.toBeInTheDocument();

  await userEvent.type(filterText, 'x');
  expect(canvas.queryByText('One')).not.toBeInTheDocument();
  expect(canvas.queryByText('No Options')).toBeInTheDocument();

  // Check enter works to add custom free-text
  await userEvent.type(filterText, '{Enter}');
  expect(onSelectFilter).toHaveBeenCalledWith({
    filter: 'onx',
    options: [
      {
        ...options[0],
        checked: true,
      },
      {
        ...options[1],
      },
      {
        ...options[2],
        checked: true,
      },
      {
        ...options[3],
      },
    ],
  });
};
