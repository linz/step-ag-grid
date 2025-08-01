import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { ReactElement, useCallback, useMemo, useState } from 'react';

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridFilterButtons,
  GridFilterQuick,
  GridFilters,
  GridFormSubComponentTextArea,
  GridFormSubComponentTextInput,
  GridIcon,
  GridPopoverMenu,
  GridPopoverMessage,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
  MenuItem,
  useGridFilter,
  wait,
} from '../..';
import { GridFilterColumnsToggle, GridFilterDownloadCsvButton } from '../../components';
import { GridCellFiller } from '../../components/GridCellFiller';
import { waitForGridReady } from '../../utils/__tests__/storybookTestUtil';

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
      <div style={{ maxWidth: 1024, height: 400, display: 'flex', flexDirection: 'column' }}>
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
  height: string;
  desc: string;
  dd: string;
}

const GridReadOnlyTemplate: StoryFn<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'Id',
        lockVisible: true,
      }),
      GridCell<ITestRow, ITestRow['position']>({
        field: 'position',
        headerName: 'Position',
        cellRendererParams: {
          warning: ({ value }) => value === 'Tester' && 'Testers are testing',
          info: ({ value }) => value === 'Developer' && 'Developers are awesome',
        },
      }),
      {
        headerName: 'Metrics',
        marryChildren: true,
        children: [
          GridCell<ITestRow, ITestRow['age']>({
            field: 'age',
            headerName: 'Age',
          }),
          GridCell<ITestRow, ITestRow['height']>({
            field: 'height',
            headerName: 'Height',
          }),
        ],
      },
      GridCell({
        field: 'desc',
        headerName: 'Description',
        flex: 1,
        initialHide: true,
      }),
      GridCellFiller(),
      GridPopoverMessage(
        {
          headerName: 'Popout message',
          cellRenderer: () => <>Single Click me!</>,
          exportable: false,
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
        editable: true,
        flex: 1,
        valueFormatter: () => 'Press E',
        cellRendererParams: {
          rightHoverElement: (
            <GridIcon icon={'ic_launch_modal'} title={'Title text'} className={'GridCell-editableIcon'} />
          ),
          editAction: (selectedRows: ITestRow[]) => {
            alert(`Custom edit ${selectedRows.map((r) => r.id).join()} rowId(s) selected`);
          },
          shortcutKeys: {
            e: () => {
              alert('Hi');
            },
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
              await wait(500);
              return [
                {
                  label: 'Single edit only',
                  action: async ({ selectedRows }) => {
                    alert(`Single-edit: ${selectedRows.map((r) => r.id).join()} rowId(s) selected`);
                    await wait(1500);
                  },
                  disabled: selectedItems.length > 1,
                },
                {
                  label: 'Multi-edit',
                  action: async ({ selectedRows }) => {
                    alert(`Multi-edit: ${selectedRows.map((r) => r.id).join()} rowId(s) selected`);
                    await wait(1500);
                  },
                },
                {
                  label: 'Sub menu...',
                  subMenu: () => <MenuItem>Find...</MenuItem>,
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
                  action: async ({ menuOption }) => {
                    // eslint-disable-next-line no-console
                    console.log(`Sub selected value was ${JSON.stringify(menuOption.subValue)}`);
                    await wait(500);
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
              ];
            },
          },
        },
      ),
    ],
    [],
  );

  const [rowData] = useState<ITestRow[]>([
    { id: 1000, position: 'Tester', age: 30, height: `6'4"`, desc: 'Tests application', dd: '1' },
    { id: 1001, position: 'Developer', age: 12, height: `5'3"`, desc: 'Develops application', dd: '2' },
    { id: 1002, position: 'Manager', age: 65, height: `5'9"`, desc: 'Manages', dd: '3' },
  ]);

  return (
    <GridWrapper maxHeight={400}>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterLessThan text="Age <" field={'age'} />
        <GridFilterButtons<ITestRow>
          luiButtonProps={{ style: { whiteSpace: 'nowrap' } }}
          options={[
            {
              label: 'All',
            },
            {
              label: '< 30',
              filter: (row) => row.age < 30,
            },
          ]}
        />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={'readOnlyGrid'} />
      </GridFilters>
      <Grid
        data-testid={'readonly'}
        {...props}
        selectable={true}
        enableClickSelection={true}
        enableSelectionWithoutKeys={true}
        autoSelectFirstRow={true}
        externalSelectedItems={externalSelectedItems}
        setExternalSelectedItems={setExternalSelectedItems}
        columnDefs={columnDefs}
        rowData={rowData}
      />
    </GridWrapper>
  );
};

type KeysOfType<TObject, TValue> = {
  [K in keyof TObject]: TObject[K] extends TValue ? K : never;
}[keyof TObject];

const GridFilterLessThan = (props: {
  field: KeysOfType<ITestRow, number | null | undefined>;
  text: string;
}): ReactElement => {
  const [value, setValue] = useState<number>();

  const filter = useCallback(
    (data: ITestRow): boolean => value == null || data[props.field] < value,
    [props.field, value],
  );

  useGridFilter(filter);

  const updateValue = (newValue: string) => {
    try {
      setValue(newValue.trim() == '' ? undefined : parseInt(newValue));
    } catch {
      // ignore number parse exception
    }
  };

  return (
    <div className={'GridFilter-container flex-row-center'}>
      <div style={{ whiteSpace: 'nowrap' }}>{props.text}</div>
      &#160;
      <input type={'text'} defaultValue={value} onChange={(e) => updateValue(e.target.value)} style={{ width: 64 }} />
    </div>
  );
};

export const ReadOnlySingleSelection = GridReadOnlyTemplate.bind({});
ReadOnlySingleSelection.play = waitForGridReady;
