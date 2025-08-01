import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { ReactElement, useCallback, useContext, useMemo, useState } from 'react';

import {
  ActionButton,
  ColDefT,
  Grid,
  GridCell,
  GridContext,
  GridContextMenuComponentProps,
  GridContextProvider,
  GridProps,
  GridUpdatingContextProvider,
  MenuItem,
  wait,
} from '../..';
import { waitForGridReady } from '../../utils/__tests__/storybookTestUtil';
import { IFormTestRow } from './FormTest';

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

const ContextMenu = ({ clickedRow, colDef, close }: GridContextMenuComponentProps<IFormTestRow>): ReactElement => {
  const onClick = useCallback(() => {
    switch (colDef.field) {
      case 'name':
        clickedRow.name = '';
        break;
      case 'distance':
        clickedRow.distance = null;
        break;
    }
    close();
  }, [close, colDef.field, clickedRow]);

  return (
    <>
      <button onClick={onClick}>Button - Clear cell</button>
      <MenuItem onClick={onClick}>Menu Item - Clear cell</MenuItem>
    </>
  );
};

const GridPopoutContextMenuTemplate: StoryFn<typeof Grid> = (props: GridProps) => {
  const { selectRowsWithFlashDiff } = useContext(GridContext);
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const [rowData, setRowData] = useState([
    { id: 1000, name: 'IS IS DP12345', nameType: 'IS', numba: 'IX', plan: 'DP 12345', distance: 10 },
    { id: 1001, name: 'PEG V SD523', nameType: 'PEG', numba: 'V', plan: 'SD 523', distance: null },
  ] as IFormTestRow[]);

  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'Id',
      }),
      GridCell({
        field: 'name',
        headerName: 'Name',
      }),
      GridCell({
        field: 'distance',
        headerName: 'Number input',
        valueFormatter: ({ data }) => {
          const v = data?.distance;
          return v != null ? `${v}m` : '–';
        },
      }),
    ],
    [],
  );

  const addRowAction = useCallback(async () => {
    await wait(1000);

    const lastRow = rowData[rowData.length - 1];
    // eslint-disable-next-line @typescript-eslint/require-await
    await selectRowsWithFlashDiff(async () => {
      setRowData([
        ...rowData,
        {
          id: (lastRow?.id ?? 0) + 1,
          name: '?',
          nameType: '?',
          numba: '?',
          plan: '',
          distance: null,
          bold: false,
        },
      ]);
    });
  }, [rowData, selectRowsWithFlashDiff]);

  return (
    <>
      <Grid
        {...props}
        externalSelectedItems={externalSelectedItems}
        setExternalSelectedItems={setExternalSelectedItems}
        columnDefs={columnDefs}
        rowData={rowData}
        domLayout={'autoHeight'}
        defaultColDef={{ minWidth: 70 }}
        sizeColumns={'auto'}
        onCellEditingComplete={() => {
          /* eslint-disable-next-line no-console */
          console.log('Cell editing complete');
        }}
        contextMenu={ContextMenu}
      />
      <ActionButton icon={'ic_add'} name={'Add new row'} inProgressName={'Adding...'} onClick={addRowAction} />
    </>
  );
};

export const _EditContextMenu = GridPopoutContextMenuTemplate.bind({});
_EditContextMenu.play = waitForGridReady;
