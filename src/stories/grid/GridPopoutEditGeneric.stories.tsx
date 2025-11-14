import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

import { ColDefT, Grid, GridCell, GridContextProvider, GridProps, GridUpdatingContextProvider } from '../..';
import { waitForGridReady } from '../../utils/__tests__/storybookTestUtil';
import { FormTest, IFormTestRow } from './FormTest';

export default {
  title: 'Components / Grids',
  component: Grid,
  args: {
    quickFilterValue: '',
    selectable: true,
  },
  decorators: [
    (Story) => (
      <GridUpdatingContextProvider>
        <GridContextProvider>
          <Story />
        </GridContextProvider>
      </GridUpdatingContextProvider>
    ),
  ],
} as Meta<typeof Grid>;

const GridPopoutEditGenericTemplate: StoryFn<typeof Grid<IFormTestRow>> = (props: GridProps<IFormTestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'Id',
        flex: 2,
      }),
      GridCell(
        {
          field: 'name',
          headerName: 'Popout Generic Edit',
          flex: 1,
        },
        {
          multiEdit: true,
          editor: FormTest,
          editorParams: {},
        },
      ),
    ],
    [],
  );

  const [rowData] = useState([
    { id: 1000, name: 'IS IS DP12345', nameType: 'IS', numba: 'IX', plan: 'DP 12345' },
    {
      id: 1001,
      name: 'PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523',
      nameType: 'PEG',
      numba: 'V',
      plan: 'SD 523',
    },
  ] as IFormTestRow[]);

  return (
    <Grid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      hideSelectColumn={true}
      selectable={true}
      rowData={rowData}
      domLayout={'autoHeight'}
    />
  );
};

export const _EditGeneric = GridPopoutEditGenericTemplate.bind({});
_EditGeneric.play = waitForGridReady;
