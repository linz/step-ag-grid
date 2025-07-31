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
  GridFilterButtons,
  GridFilterQuick,
  GridFilters,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
} from '../..';
import { waitForGridReady } from '../../utils/__tests__/storybookTestUtil';

export default {
  title: 'Components / Grids',
  component: Grid,
  decorators: [
    (Story) => (
      <div style={{ width: 1024, height: 400, display: 'flex' }}>
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
  desc: string;
}

const GridFilterButtonsTemplate: StoryFn<typeof Grid> = (props: GridProps) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'Id',
      }),
      GridCell({
        field: 'position',
        headerName: 'Position',
      }),
      GridCell({
        field: 'desc',
        headerName: 'Description',
        flex: 1,
      }),
    ],
    [],
  );

  const [rowData] = useState([
    {
      id: 1000,
      position: 'Tester',
      age: 30,
      desc: 'Integration tester - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lectus neque. Nunc congue magna ut lorem pretium, vitae congue lorem malesuada. Etiam eget eleifend sapien, sed egestas felis. Aliquam ac augue sapien.',
    },
    { id: 1001, position: 'Developer', age: 12, desc: 'Frontend developer' },
    { id: 1002, position: 'Manager', age: 65, desc: 'Technical Manager' },
    { id: 1003, position: 'Tester', age: 30, desc: 'E2E tester' },
    { id: 1004, position: 'Developer', age: 12, desc: 'Fullstack Developer' },
    { id: 1005, position: 'Developer', age: 12, desc: 'Backend Developer' },
    { id: 1006, position: 'Architect', age: 30, desc: 'Architect' },
  ]);

  return (
    <GridWrapper>
      <GridFilters>
        <GridFilterQuick quickFilterPlaceholder={'Custom placeholder...'} />
        <GridFilterButtons<ITestRow>
          luiButtonProps={{ style: { whiteSpace: 'nowrap' } }}
          options={[
            {
              label: 'All',
            },
            {
              label: 'Developers',
              filter: (row) => row.position === 'Developer',
            },
            {
              label: 'Testers',
              filter: (row) => row.position === 'Tester',
            },
          ]}
        />
      </GridFilters>
      <Grid
        {...props}
        rowSelection={'multiple'}
        columnDefs={columnDefs}
        rowData={rowData}
        sizeColumns={'auto-skip-headers'}
      />
    </GridWrapper>
  );
};

export const _FilterButtonsExample = GridFilterButtonsTemplate.bind({});
_FilterButtonsExample.play = waitForGridReady;
