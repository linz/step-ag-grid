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
  GridContextProvider,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
} from '../..';
import { waitForGridReady } from '../../utils/__tests__/storybookTestUtil';

export default {
  title: 'Components / Grids',
  component: Grid,
  args: {
    selectable: false,
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
      <div style={{ maxWidth: 1024, height: 260, display: 'flex', flexDirection: 'column' }}>
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
  name: string;
  position: string;
  age: number;
}

interface ITestPinnedRow {
  name: string;
  position: string;
  age: number;
}

const PinnedRowTemplate: StoryFn<typeof Grid> = (props: GridProps) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'name',
        headerName: 'Name',
      }),
      GridCell({
        field: 'position',
        headerName: 'Position',
      }),
      GridCell({
        field: 'age',
        headerName: 'Age',
      }),
    ],
    [],
  );

  const [rowData] = useState<ITestRow[]>([
    { id: 1, name: 'Opeyemi', position: 'Tester', age: 30 },
    { id: 2, name: 'Johnie', position: 'Developer', age: 21 },
    { id: 3, name: 'Laxmi', position: 'Manager', age: 65 },
    { id: 4, name: 'Salama', position: 'Developer', age: 22 },
    { id: 5, name: 'Husni', position: 'Developer', age: 24 },
  ]);
  const [pinnedBottomRowData] = useState<ITestPinnedRow[]>([{ name: 'Total Age', position: '', age: 170 }]);
  const [pinnedTopRowData] = useState<ITestPinnedRow[]>([{ name: 'Min Age', position: '', age: 21 }]);

  return (
    <GridWrapper maxHeight={400}>
      <Grid
        data-testid={'readonly'}
        {...props}
        selectable={false}
        columnDefs={columnDefs}
        rowData={rowData}
        pinnedTopRowData={pinnedTopRowData}
        pinnedBottomRowData={pinnedBottomRowData}
      />
    </GridWrapper>
  );
};
export const PinnedRow = PinnedRowTemplate.bind({});
PinnedRow.play = waitForGridReady;
