import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { useCallback, useMemo, useState } from 'react';

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridOnRowDragEndProps,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
} from '../..';
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

const GridDragRowTemplate: StoryFn<typeof Grid<ITestRow>> = (props: GridProps<ITestRow>) => {
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
        flex: 1,
      }),
      GridCell({
        field: 'age',
        headerName: 'Age',
      }),
      GridCell({
        field: 'height',
        headerName: 'Height',
      }),
      GridCell({
        field: 'desc',
        headerName: 'Description',
        flex: 1,
      }),
    ],
    [],
  );

  // Full data set for testing
  const fullRowData = useMemo<ITestRow[]>(
    () => [
      { id: 1000, position: 'Tester', age: 30, height: `6'4"`, desc: 'Tests application', dd: '1' },
      { id: 1001, position: 'Developer', age: 12, height: `5'3"`, desc: 'Develops application', dd: '2' },
      { id: 1002, position: 'Manager', age: 65, height: `5'9"`, desc: 'Manages', dd: '3' },
      {
        id: 1003,
        position: 'BA',
        age: 42,
        height: `5'7"`,
        desc: 'BAs',
        dd: '4 Column Header That Should Get Truncated When Data Is Empty',
      },
    ],
    [],
  );

  // Create state for toggling between data and empty state
  const [showData, setShowData] = useState(true);

  // Use either the full data or empty array based on the toggle
  const [rowData, setRowData] = useState<ITestRow[]>(fullRowData);

  const onRowDragEnd = useCallback(({ movedRow, targetRow }: GridOnRowDragEndProps<ITestRow>) => {
    setRowData((rowData) =>
      rowData?.map((r) => {
        if (r.id === movedRow.id) return targetRow;
        if (r.id === targetRow.id) return movedRow;
        return r;
      }),
    );
  }, []);

  // Toggle between showing data and empty state
  const toggleData = useCallback(() => {
    setShowData((current: boolean) => {
      const newShowData = !current;
      setRowData(newShowData ? fullRowData : []);
      return newShowData;
    });
  }, [fullRowData]);

  // Add a new columns for long content
  const longHeaderColumnDefs = useMemo(
    () => [
      ...columnDefs,
      GridCell<ITestRow, ITestRow['dd']>({
        field: 'dd',
        headerName: 'Very Long',
        minWidth: 150, // Deliberately narrow to force truncation
      }),
    ],
    [columnDefs],
  );

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={toggleData}>{showData ? 'Show Empty Grid (Test Truncation)' : 'Show Data'}</button>
        <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
          {!showData && 'Empty grid state - check if headers are truncated correctly'}
        </div>
      </div>
      <GridWrapper maxHeight={300}>
        <Grid
          data-testid={'readonly'}
          {...props}
          selectable={true}
          rowSelection="multiple"
          animateRows={true}
          columnDefs={longHeaderColumnDefs}
          defaultColDef={{ sortable: false }}
          sizeColumns="auto"
          rowData={rowData}
          onRowDragEnd={onRowDragEnd}
          rowDragText={({ rowNode }) => `${rowNode?.data.id} - ${rowNode?.data.position}`}
        />
      </GridWrapper>
    </>
  );
};

export const ColumnsTrucated = GridDragRowTemplate.bind({});
ColumnsTrucated.play = waitForGridReady;

// Create a dedicated story for empty grid state testing
// Create a separate component for the empty grid state
const EmptyGridTruncationTest: StoryFn<typeof Grid<ITestRow>> = (props: GridProps<ITestRow>) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'ID',
        width: 80,
      }),
      GridCell<ITestRow, ITestRow['position']>({
        field: 'position',
        headerName: 'Position',
        width: 120,
      }),
      GridCell<ITestRow, ITestRow['desc']>({
        field: 'desc',
        headerName: 'Mock data',
        width: 150, // Deliberately narrow to force truncation
      }),
    ],
    [],
  );

  // Empty data for testing truncation
  const emptyData: ITestRow[] = [];

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>
          Empty Grid State with Truncated Headers
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          This grid has no data to demonstrate header truncation behavior
        </div>
      </div>
      <GridWrapper maxHeight={300}>
        <Grid
          data-testid={'empty-grid'}
          {...props}
          columnDefs={columnDefs}
          rowData={emptyData}
          noRowsOverlayText="No data available (testing column header truncation)"
        />
      </GridWrapper>
    </>
  );
};

export const EmptyGridWithTruncatedColumns = EmptyGridTruncationTest.bind({});
EmptyGridWithTruncatedColumns.play = waitForGridReady;
