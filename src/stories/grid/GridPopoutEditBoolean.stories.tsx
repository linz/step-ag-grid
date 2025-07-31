import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

import {
  ColDefT,
  Grid,
  GridButton,
  GridCell,
  GridContextProvider,
  GridEditBoolean,
  GridUpdatingContextProvider,
} from '../..';
import { waitForGridReady } from '../../utils/__tests__/storybookTestUtil';
import { IFormTestRow } from './FormTest';

export default {
  title: 'Components / Grids',
  component: Grid,
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

const GridPopoutEditBooleanTemplate: StoryFn<typeof Grid> = () => {
  const [rowData, setRowData] = useState([
    { id: 1000, name: 'IS IS DP12345', nameType: 'IS', numba: 'IX', plan: 'DP 12345', bold: true },
    { id: 1001, name: 'PEG V SD523', nameType: 'PEG', numba: 'V', plan: 'SD 523', bold: false },
  ] as IFormTestRow[]);

  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'Id',
      }),
      GridButton(
        {
          colId: 'button',
          headerName: 'Button',
        },
        {
          visible: ({ data }) => !!(data.id & 1),
          onClick: ({ selectedRowIds }) => {
            alert('click ' + String(selectedRowIds));
          },
        },
      ),
      GridEditBoolean(
        {
          field: 'bold',
        },
        {
          onClick: ({ selectedRowIds, checked }) => {
            setRowData((rowData) => {
              // eslint-disable-next-line no-console
              console.log('onchange', selectedRowIds, checked);
              return rowData.map((row) => (selectedRowIds.includes(row.id) ? { ...row, bold: checked } : row));
            });
            return true;
          },
        },
      ),
    ],
    [],
  );

  return (
    <Grid
      columnDefs={columnDefs}
      rowData={rowData}
      selectable={false}
      singleClickEdit={true}
      rowSelection="single"
      domLayout={'autoHeight'}
    />
  );
};

export const _EditBoolean = GridPopoutEditBooleanTemplate.bind({});
_EditBoolean.play = waitForGridReady;
