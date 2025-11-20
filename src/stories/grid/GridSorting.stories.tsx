import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect } from 'storybook/test';

import {
  ColDefT,
  compareNaturalInsensitive,
  Grid,
  GridCell,
  GridContextProvider,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
  wait,
} from '../..';
import {
  clickColumnHeaderToSort,
  gridColumnValues,
  waitForGridReady,
  waitForGridRows,
} from '../../utils/__tests__/storybookTestUtil';

export default {
  title: 'Components / Grids',
  component: Grid,
  args: {
    quickFilter: true,
    quickFilterValue: '',
    quickFilterPlaceholder: 'Quick filter...',
    selectable: false,
    rowSelection: 'single',
  }, // Storybook hangs otherwise
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
  numeric?: number;
  text?: string;
}

const GridReadOnlyTemplate: StoryFn<typeof Grid<ITestRow>> = (props: GridProps<ITestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'Id',
        lockVisible: true,
      }),
      GridCell({
        field: 'numeric',
        headerName: 'Numeric',
      }),
      GridCell({
        field: 'text',
        headerName: 'Text',
      }),
      GridCell({
        colId: 'customComparatorText',
        headerName: 'Cust. comp. id as text',
        valueFormatter: ({ data }) => data?.text ?? '',
        comparator: (_v1, _v2, n1, n2) => compareNaturalInsensitive(String(n1.data?.id), String(n2.data?.id)) ?? 0,
      }),
      GridCell({
        colId: 'customComparatorNumeric',
        headerName: 'Cust. comp. abs number',
        valueFormatter: ({ data }) => String(data?.numeric ?? ''),
        comparator: (_v1, _v2, n1, n2) => {
          return compareNaturalInsensitive(n1.data?.numeric, n2.data?.numeric) ?? 0;
        },
      }),
    ],
    [],
  );

  const [rowData] = useState<ITestRow[]>([
    { id: 1009, numeric: -1.1, text: 'ade' },
    { id: 1000, numeric: 1, text: 'ade' },
    { id: 1001, numeric: 11, text: 'cdc' },
    { id: 1002, numeric: 21, text: '2' },
    { id: 1003, numeric: 2.1, text: '10' },
    { id: 1004, numeric: 2.01, text: 'b' },
    { id: 1005, numeric: 2.21, text: 'b' },
    { id: 1006, numeric: 3, text: undefined },
    { id: 1008, numeric: 3, text: 'e' },
    { id: 1007, numeric: undefined, text: 'e' },
  ]);

  return (
    <GridWrapper maxHeight={400}>
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

export const Sorting = GridReadOnlyTemplate.bind({});
Sorting.play = async (context) => {
  const { canvasElement } = context;
  await waitForGridReady(context);
  await waitForGridRows({ grid: canvasElement });

  const test = async (colId: string | null, expected: string[] | null, idExpected?: string[]) => {
    if (colId !== null) {
      await clickColumnHeaderToSort(colId, canvasElement);
      await wait(500);
      expected && expect(gridColumnValues(colId, canvasElement)).toEqual(expected);
    }
    idExpected && expect(gridColumnValues('id', canvasElement)).toEqual(idExpected);
  };

  // Default sort order
  await test(null, null, ['1009', '1000', '1001', '1002', '1003', '1004', '1005', '1006', '1008', '1007']);

  await test('numeric', ['–', '-1.1', '1', '2.01', '2.1', '2.21', '3', '3', '11', '21']);
  await test('numeric', ['21', '11', '3', '3', '2.21', '2.1', '2.01', '1', '-1.1', '–']);

  await test(
    'text',
    ['–', '2', '10', 'ade', 'ade', 'b', 'b', 'cdc', 'e', 'e'],
    ['1006', '1002', '1003', '1000', '1009', '1004', '1005', '1001', '1007', '1008'],
  );
  await test(
    'text',
    ['e', 'e', 'cdc', 'b', 'b', 'ade', 'ade', '10', '2', '–'],
    ['1008', '1007', '1001', '1005', '1004', '1009', '1000', '1003', '1002', '1006'],
  );

  await test('customComparatorText', null, [
    '1000',
    '1001',
    '1002',
    '1003',
    '1004',
    '1005',
    '1006',
    '1007',
    '1008',
    '1009',
  ]);
  await test('customComparatorText', null, [
    '1009',
    '1008',
    '1007',
    '1006',
    '1005',
    '1004',
    '1003',
    '1002',
    '1001',
    '1000',
  ]);

  await test('customComparatorNumeric', ['–', '-1.1', '1', '2.01', '2.1', '2.21', '3', '3', '11', '21']);
  await test('customComparatorNumeric', ['21', '11', '3', '3', '2.21', '2.1', '2.01', '1', '-1.1', '–']);
};
