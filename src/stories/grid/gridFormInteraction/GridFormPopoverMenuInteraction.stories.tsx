import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { StoryFn } from '@storybook/react-vite';
import { GridPopoverContext } from 'contexts/GridPopoverContext';
import { useRef } from 'react';
import * as test from 'storybook/test';
import { expect, userEvent, within } from 'storybook/test';

import {
  GridContext,
  GridFormPopoverMenu,
  GridFormPopoverMenuProps,
  GridFormSubComponentTextArea,
  GridFormSubComponentTextInput,
  PopoutMenuSeparator,
} from '../../..';

export default {
  title: 'GridForm / Interactions',
  component: GridFormPopoverMenu,
  args: {},
};

const updateValue = test.fn((saveFn: (selectedRows: any[]) => Promise<boolean>, _tabDirection: 1 | 0 | -1) =>
  saveFn([]),
);

const enabledAction = test.fn().mockResolvedValue(undefined);

const disabledAction = test.fn().mockResolvedValue(undefined);

const Template: StoryFn<typeof GridFormPopoverMenu> = (props: GridFormPopoverMenuProps<any>) => {
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
            value: null,
            updateValue,
            data: { value: '' },
            colId: '',
            field: 'value',
            selectedRows: [],
            saving: false,
            setSaving: () => {},
            formatValue: (value) => value,
          }}
        >
          <GridFormPopoverMenu
            {...props}
            options={() => [
              { label: 'Enabled', value: 1, action: enabledAction },
              PopoutMenuSeparator,
              { label: 'Disabled', value: 0, disabled: true, action: disabledAction },
              {
                label: 'Sub text input',
                value: 0,
                subComponent: () => (
                  <GridFormSubComponentTextInput placeholder={'Text input'} maxLength={5} required defaultValue={''} />
                ),
              },
              {
                label: 'Sub text area',
                value: 0,
                subComponent: () => (
                  <GridFormSubComponentTextArea placeholder={'Text area'} maxLength={5} required defaultValue={''} />
                ),
              },
              { label: 'ERROR! this should be hidden', value: 3, hidden: true },
            ]}
          />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>
  );
};

export const GridFormPopoverMenuInteractions_: typeof Template = Template.bind({});
GridFormPopoverMenuInteractions_.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const getOption = (name: string) => canvas.findByRole('menuitem', { name });

  const enabledMenuOption = await getOption('Enabled');
  expect(enabledMenuOption).toBeInTheDocument();
  await userEvent.click(enabledMenuOption);
  expect(enabledAction).toHaveBeenCalled();

  enabledAction.mockClear();
  const disabledMenuOption = await getOption('Disabled');
  expect(disabledMenuOption).toBeInTheDocument();
  await userEvent.click(disabledMenuOption);
  expect(disabledAction).not.toHaveBeenCalled();

  // Sub input tests
  const subTextInput = await getOption('Sub text input');
  expect(subTextInput).toBeInTheDocument();
  expect(canvas.queryByPlaceholderText('Text input')).not.toBeInTheDocument();

  const subTextArea = await getOption('Sub text area');
  expect(subTextArea).toBeInTheDocument();
  expect(canvas.queryByPlaceholderText('Text area')).not.toBeInTheDocument();

  await userEvent.click(subTextInput);
  const textInput = await canvas.findByPlaceholderText('Text input');
  expect(textInput).toBeInTheDocument();
  expect(await canvas.findByText('Must not be empty')).toBeInTheDocument();
  expect(canvas.queryByPlaceholderText('Text area')).not.toBeInTheDocument();

  await userEvent.type(textInput, 'Hello');
  expect(await canvas.findByText('Press enter or tab to save')).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  await userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab

  // Test shift+tab to save
  updateValue.mockClear();
  await userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test escape to not save
  updateValue.mockClear();
  await userEvent.type(textInput, '{Escape}');
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  await userEvent.clear(textInput);
  await userEvent.type(textInput, '{Enter}');
  expect(updateValue).not.toHaveBeenCalled();

  // Sub text area tests
  subTextArea.click();

  const textArea = await canvas.findByPlaceholderText('Text area');
  expect(textArea).toBeInTheDocument();
  expect(await canvas.findByText('Must not be empty')).toBeInTheDocument();
  expect(canvas.queryByPlaceholderText('Text input')).not.toBeInTheDocument();

  await userEvent.type(textArea, 'Hello');
  expect(await canvas.findByText('Press tab to save')).toBeInTheDocument();

  // Test tab to save
  updateValue.mockClear();
  await userEvent.tab();
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), 1); // 1 = Tab

  // Test shift+tab to save
  updateValue.mockClear();
  await userEvent.tab({ shift: true });
  expect(updateValue).toHaveBeenCalledWith(expect.anything(), -1); // -1 = Shift + tab

  // Test escape to not save
  updateValue.mockClear();
  await userEvent.type(textArea, '{Escape}');
  expect(updateValue).not.toHaveBeenCalled();

  // Test invalid value doesn't save
  updateValue.mockClear();
  await userEvent.clear(textArea);
  await userEvent.type(textArea, '{Enter}');
  expect(updateValue).not.toHaveBeenCalled();
};
