import '../../../styles/GridTheme.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect } from 'storybook/test';
import { fn } from 'storybook/test';
import { userEvent, waitFor } from 'storybook/test';

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridFormSubComponentTextArea,
  GridFormSubComponentTextInput,
  GridIcon,
  GridPopoverMenu,
  GridPopoverMessage,
  GridProps,
  GridUpdatingContextProvider,
  MenuOption,
  wait,
} from '../../../';
import { waitForGridReady } from '../../../utils/__tests__/storybookTestUtil';

export default {
  title: 'Components / Grids',
  component: Grid,
  args: {
    quickFilter: true,
    quickFilterValue: '',
    quickFilterPlaceholder: 'Quick filter...',
    selectable: false,
    rowSelection: 'single',
  },
  // Storybook hangs otherwise
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1024, height: 400 }}>
        <GridUpdatingContextProvider>
          <GridContextProvider>
            <Story />
          </GridContextProvider>
        </GridUpdatingContextProvider>
      </div>
    ),
  ],
} as Meta<typeof Grid>;

interface ITestRow {
  id: number;
  position: string;
  age: number;
  desc: string;
  dd: string;
}

const multiEditAction = fn(async () => {
  console.log('multiEditAction');
  await wait(500);
});

const eAction = fn(() => {
  console.log('eAction');
  return true;
});

const GridKeyboardInteractionsTemplate: StoryFn<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'Id',
      }),
      GridCell<ITestRow, ITestRow['position']>({
        field: 'position',
        headerName: 'Position',
        cellRendererParams: {
          warning: ({ value }) => value === 'Tester' && 'Testers are testing',
          info: ({ value }) => value === 'Developer' && 'Developers are awesome',
        },
      }),
      GridCell({
        field: 'age',
        headerName: 'Age',
      }),
      GridCell({
        field: 'desc',
        headerName: 'Description',
      }),
      GridPopoverMessage(
        {
          headerName: 'Popout message',
          maxWidth: 150,
          cellRenderer: () => <>Single Click me!</>,
        },
        {
          multiEdit: true,
          editorParams: {
            message: async (selectedRows): Promise<string> => {
              await wait(1000);
              return `There are ${selectedRows.length} row(s) selected`;
            },
          },
        },
      ),
      GridCell({
        headerName: 'Custom edit',
        maxWidth: 100,
        editable: true,
        valueFormatter: () => 'Press E',
        cellRendererParams: {
          rightHoverElement: (
            <GridIcon icon={'ic_launch_modal'} title={'Title text'} className={'GridCell-editableIcon'} />
          ),
          editAction: () => {
            //
          },
          shortcutKeys: {
            e: eAction,
          },
        },
      }),
      GridPopoverMenu(
        {},
        {
          multiEdit: true,
          editorParams: {
            defaultAction: ({ menuOption }) => {
              // eslint-disable-next-line no-console
              console.log('clicked', { menuOption });
            },
            options: async (selectedItems) => {
              // Just doing a timeout here to demonstrate deferred loading
              await wait(50);
              return [
                {
                  label: 'Single edit only',
                  action: async () => {
                    //
                  },
                  disabled: selectedItems.length > 1,
                },
                {
                  label: 'Multi-edit',
                  action: multiEditAction,
                },
                {
                  label: 'Disabled item',
                  disabled: 'Disabled for test',
                },
                {
                  label: 'Developer Only',
                  hidden: selectedItems.some((x) => x.position != 'Developer'),
                },
                {
                  label: 'Other (TextInput)',
                  action: async () => {
                    //
                  },
                  subComponent: () => (
                    <GridFormSubComponentTextInput placeholder={'Other'} maxLength={5} required defaultValue={''} />
                  ),
                },
                {
                  label: 'Other (TextArea)',
                  action: async ({ menuOption }) => {
                    // eslint-disable-next-line no-console
                    console.log(`Sub selected value was ${JSON.stringify(menuOption.subValue)}`);
                    await wait(500);
                  },
                  subComponent: () => (
                    <GridFormSubComponentTextArea placeholder={'Other'} maxLength={5} required defaultValue={''} />
                  ),
                },
              ] as MenuOption<ITestRow>[];
            },
          },
        },
      ),
      GridPopoverMenu(
        {
          editable: () => false,
        },
        {
          editorParams: {
            options: () => [],
          },
        },
      ),
    ],
    [],
  );

  const [rowData] = useState([
    { id: 1000, position: 'Tester', age: 30, desc: 'Tests application', dd: '1' },
    { id: 1001, position: 'Developer', age: 12, desc: 'Develops application', dd: '2' },
    { id: 1002, position: 'Manager', age: 65, desc: 'Manages', dd: '3' },
  ]);

  return (
    <Grid
      {...props}
      selectable={true}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={'autoHeight'}
      autoSelectFirstRow={true}
    />
  );
};

export const GridKeyboardInteractions: StoryFn<typeof Grid> = GridKeyboardInteractionsTemplate.bind({});
GridKeyboardInteractions.play = async ({ canvasElement }) => {
  multiEditAction.mockClear();
  eAction.mockClear();

  await waitForGridReady({ canvasElement });

  // Ensure first row/cell is selected on render
  await waitFor(() => {
    const activeCell = canvasElement.ownerDocument.activeElement;
    expect(activeCell).toHaveClass('ag-cell-focus');
    expect(activeCell).toHaveAttribute('aria-colindex', '1');
    expect(activeCell?.parentElement).toHaveAttribute('row-index', '0');
  });
  await userEvent.keyboard('{arrowdown}{arrowdown}');
  await userEvent.keyboard('{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}');

  // Test enter post focus
  const test = async (fn: () => any, colId: string, rowId: string) => {
    await userEvent.keyboard('{Enter}');
    await wait(1000);
    await userEvent.keyboard('{arrowdown}{arrowdown}');
    fn();
    await waitFor(() => {
      expect(multiEditAction).toHaveBeenCalled();
    });

    await waitFor(() => {
      const activeCell = canvasElement.ownerDocument.activeElement;
      expect(activeCell).toHaveClass('ag-cell-focus');
      expect(activeCell).toHaveAttribute('aria-colindex', colId);
      expect(activeCell?.parentElement).toHaveAttribute('row-index', rowId);
    });
    await wait(200);
  };

  await test(() => userEvent.keyboard('{Enter}'), '8', '2');
  await test(() => userEvent.tab(), '9', '2');
  await userEvent.tab({ shift: true });
  await test(() => userEvent.tab({ shift: true }), '6', '2');
  await userEvent.keyboard('{Esc}');
  await userEvent.tab();

  await userEvent.keyboard('{Enter}');
  await wait(250);
  expect(eAction).not.toHaveBeenCalled();

  await userEvent.keyboard('e');
  await waitFor(() => {
    expect(eAction).toHaveBeenCalled();
  });
};
