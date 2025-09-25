import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { StoryFn } from '@storybook/react-vite';
import { GridPopoverContext } from 'contexts/GridPopoverContext';
import { useRef } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import {
  GridContext,
  GridFormEditBearing,
  GridFormEditBearingProps,
  GridPopoverEditBearingCorrectionEditorParams,
} from '../../..';

export default {
  title: 'GridForm / Interactions',
  component: GridFormEditBearing,
  args: {},
};

const updateValue = fn();

const Template: StoryFn<typeof GridFormEditBearing> = (props: GridFormEditBearingProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className={'react-menu-inline-test'}>
      <GridContext.Provider
        value={
          {
            onCellEditingComplete: () => {},
          } as any
        }
      >
        <h6 ref={anchorRef}>Interaction Test</h6>
        <GridPopoverContext.Provider
          value={{
            anchorRef,
            colId: '',
            value: null,
            updateValue,
            formatValue: (value) => value,
            setSaving: () => {},
            saving: false,
            selectedRows: [],
            data: { value: '' },
            field: 'value',
          }}
        >
          <GridFormEditBearing {...props} {...GridPopoverEditBearingCorrectionEditorParams} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>
  );
};

export const GridFormEditBearingCorrectionInteractions_: typeof Template = Template.bind({});
GridFormEditBearingCorrectionInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByText('Press enter or tab to save')).toBeInTheDocument();

  const inputField = canvas.getByPlaceholderText('Enter bearing correction');

  // Test formatting null
  expect(await canvas.findByText('–')).toBeInTheDocument();

  // Test formatting a bearing
  expect(inputField).toBeInTheDocument();
  await userEvent.type(inputField, '1.2345');
  expect(await canvas.findByText('+1° 23\' 45"')).toBeInTheDocument();

  // Test enter to save
  updateValue.mockClear();
  await userEvent.type(inputField, '{Enter}');
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 0); // 0 = Enter

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
  await userEvent.type(inputField, 'xxx');
  expect(await canvas.findByText('?')).toBeInTheDocument();

  expect(canvas.getByText('Bearing must be a number in D.MMSSS format')).toBeInTheDocument();
  await userEvent.type(inputField, '{Enter}');
  expect(updateValue).not.toHaveBeenCalled();
  await userEvent.tab();
  expect(updateValue).not.toHaveBeenCalled();
  await userEvent.tab({ shift: true });
  expect(updateValue).not.toHaveBeenCalled();
};
