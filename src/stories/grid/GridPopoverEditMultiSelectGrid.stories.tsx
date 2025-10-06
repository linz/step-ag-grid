import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { countBy, mergeWith, pull, range, union } from 'lodash-es';
import { useMemo, useState } from 'react';

import { ColDefT, Grid, GridCell, GridContextProvider, GridProps, GridUpdatingContextProvider } from '../..';
import { MultiSelectGridOption } from '../../components/gridForm/GridFormMultiSelectGrid';
import { GridPopoutEditMultiSelectGrid } from '../../components/gridPopoverEdit/GridPopoutEditMultiSelectGrid';
import { waitForGridReady } from '../../utils/__tests__/storybookTestUtil';
import { EditMultiSelect } from './GridPopoverEditMultiSelect.stories';

export default {
  title: 'Components / Grids',
  component: Grid,
  args: {
    quickFilterValue: '',
    selectable: true,
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
  position: number[] | null;
  position2: string | null;
}

const GridEditMultiSelectGridTemplate: StoryFn<typeof Grid<ITestRow>> = (props: GridProps<ITestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);

  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => {
    return [
      GridCell({
        field: 'id',
        headerName: 'Id',
      }),
      GridPopoutEditMultiSelectGrid<ITestRow, ITestRow['position']>(
        {
          field: 'position',
          headerName: 'Position',
          valueFormatter: ({ value }) => {
            if (value == null) return '';
            return value.join(', ');
          },
        },
        {
          multiEdit: true,
          editorParams: {
            className: 'GridMultiSelect-containerUnlimited',
            options: (selectedRows: ITestRow[]) => {
              const counts: Record<number, number> = mergeWith(
                {},
                ...selectedRows.map((row) => countBy(row.position)),
                (a: number | undefined, b: number | undefined) => (a ?? 0) + (b ?? 0),
              );
              return range(50024, 50067).map((value): MultiSelectGridOption => {
                const checked = counts[value] == selectedRows.length ? true : counts[value] > 0 ? 'partial' : false;
                return {
                  value: value,
                  label: `${value}`,
                  checked,
                  canSelectPartial: checked === 'partial',
                };
              });
            },
            // eslint-disable-next-line @typescript-eslint/require-await
            onSave: async ({ selectedRows, addValues, removeValues }) => {
              selectedRows.forEach((row) => {
                row.position = union(pull(row.position ?? [], ...removeValues), addValues).sort();
              });

              return true;
            },
          },
        },
      ),
    ];
  }, []);

  const [rowData] = useState([
    { id: 1000, position: [50024, 50025], position2: 'lot1' },
    { id: 1001, position: [50025, 50026], position2: 'lot2' },
  ] as ITestRow[]);

  return (
    <Grid
      {...props}
      animateRows={true}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={'autoHeight'}
    />
  );
};

export const EditMultiSelectGrid = GridEditMultiSelectGridTemplate.bind({});
EditMultiSelect.play = waitForGridReady;
