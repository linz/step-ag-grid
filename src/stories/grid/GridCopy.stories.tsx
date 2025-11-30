import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

import {
  ColDefT,
  Grid,
  GridCell,
  GridCellBearingValueFormatter,
  GridContextProvider,
  GridFilterQuick,
  GridFilters,
  GridPopoverMenu,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
} from '../..';
import { GridFilterColumnsToggle, GridFilterDownloadCsvButton } from '../../components';
import { GridCellFiller } from '../../components/GridCellFiller';
import { SeededRandomForTests } from '../../utils/__tests__/random';
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
  position?: string;
  age: number;
  height: string;
  bearing: string | number | null;
}

const GridCopyTemplate: StoryFn<typeof Grid<ITestRow>> = (props: GridProps<ITestRow>) => {
  const [externalSelectedIds, setExternalSelectedIds] = useState<number[]>([]);
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
          error: ({ value }) => value === 'Manager' && 'Managers need management',
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
        field: 'bearing',
        headerName: 'Bearing',
        valueFormatter: GridCellBearingValueFormatter,
      }),
      GridCellFiller(),
      GridPopoverMenu(
        {},
        {
          editorParams: {
            options: () => [
              {
                label: 'Test menu',
                action: () => {},
              },
            ],
          },
        },
      ),
    ],
    [],
  );

  const [rowData] = useState<ITestRow[]>(() => {
    const random = new SeededRandomForTests(1000);
    let id = 1000;
    const positions = [
      undefined,
      'Tester',
      'Developer',
      'Lawyer',
      'Barrista """',
      'Manager',
      'CEO',
      'CTO',
      'Architect',
    ];
    const result: ITestRow[] = [];
    for (let i = 0; i < 1000; i++) {
      result.push({
        id: id++,
        position: random.fromArray(positions),
        age: 30,
        height: `${random.next(3) + 3}'${random.next(12)}"`,
        bearing: '',
      });
    }
    return result;
  });

  return (
    <GridWrapper maxHeight={400}>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={'readOnlyGrid'} />
      </GridFilters>
      <Grid
        data-testid={'readonly'}
        {...props}
        enableRangeSelection={true}
        selectable={true}
        enableClickSelection={true}
        enableSelectionWithoutKeys={true}
        autoSelectFirstRow={true}
        externalSelectedIds={externalSelectedIds}
        setExternalSelectedIds={setExternalSelectedIds}
        columnDefs={columnDefs}
        rowData={rowData}
      />
    </GridWrapper>
  );
};

export const GridCopy = GridCopyTemplate.bind({});
GridCopy.play = waitForGridReady;
