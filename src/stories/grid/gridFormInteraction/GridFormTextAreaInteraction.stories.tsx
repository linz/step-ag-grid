import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { StoryFn } from '@storybook/react-vite';
import { GridPopoverContext } from 'contexts/GridPopoverContext';
import { useRef } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { GridContext, GridFormTextArea, GridFormTextAreaProps } from '../../..';

export default {
  title: 'GridForm / Interactions',
  component: GridFormTextArea,
  args: {},
};

const updateValue = fn();

const Template: StoryFn<typeof GridFormTextArea> = (props: GridFormTextAreaProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className={'react-menu-inline-test'}>
      <GridContext.Provider
        value={
          {
            onBulkEditingComplete: () => {},
            resetFocusedCellAfterCellEditing: () => {},
          } as any
        }
      >
        <h6 ref={anchorRef}>Interaction Test</h6>
        <GridPopoverContext.Provider
          value={{
            anchorRef,
            value: null,
            updateValue,
            data: { value: null },
            colId: '',
            field: 'value',
            selectedRows: [],
            saving: false,
            setSaving: () => {},
            formatValue: (value) => value,
            stopEditing: () => {},
          }}
        >
          <GridFormTextArea {...props} required={true} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>
  );
};

export const GridFormTextAreaInteractions_: typeof Template = Template.bind({});
GridFormTextAreaInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByText('Must not be empty')).toBeInTheDocument();

  const inputField = canvas.getByPlaceholderText('Type here');
  await userEvent.type(inputField, 'Hello');

  expect(await canvas.findByText('Press tab to save')).toBeInTheDocument();

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
  await userEvent.type(inputField, '{Escape}');
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  await userEvent.clear(inputField);

  expect(canvas.getByText('Must not be empty')).toBeInTheDocument();
  await userEvent.tab();
  expect(updateValue).not.toHaveBeenCalled();
  await userEvent.tab({ shift: true });
  expect(updateValue).not.toHaveBeenCalled();
};
