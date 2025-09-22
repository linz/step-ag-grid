import '../../styles/GridTheme.scss';
import '../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridFilterColumnsToggle,
  GridFilterDownloadCsvButton,
  GridFilterQuick,
  GridFilters,
  GridPopoverEditBearing,
  GridPopoverEditBearingCorrection,
  GridProps,
  GridUpdatingContextProvider,
  GridWrapper,
  wait,
} from '../..';
import { waitForGridReady } from '../../utils/__tests__/storybookTestUtil';

export default {
  title: 'Components / Grids',
  component: Grid,
  args: {
    quickFilterValue: '',
    selectable: true,
    alwaysShowVerticalScroll: false,
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
  bearingCorrection: number | null;
  bearing: string | number | null;
}

const GridPopoverEditBearingTemplate: StoryFn<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: 'id',
        headerName: 'Id',
      }),
      GridPopoverEditBearingCorrection(
        {
          field: 'bearingCorrection',
          headerName: 'Bearing correction',
          cellRendererParams: {
            warning: ({ data }) => data?.id == 1002 && 'Testers are testing',
            info: ({ data }) => data?.id == 1001 && 'Developers are developing',
          },
        },
        {
          multiEdit: false,
        },
      ),
      GridPopoverEditBearing(
        {
          field: 'bearing',
          headerName: 'Bearing',
        },
        {
          editorParams: {
            onSave: async ({ selectedRows, value }) => {
              await wait(1000);
              selectedRows.forEach((row) => (row['bearing'] = value));
              return true;
            },
          },
        },
      ),
    ],
    [],
  );

  const [rowData] = useState([
    { id: 1000, bearing: 1.234, bearingCorrection: null },
    { id: 1001, bearing: '0E-12', bearingCorrection: 240 },
    { id: 1002, bearing: null, bearingCorrection: 355.1 },
    { id: 1003, bearing: null, bearingCorrection: 0 },
    { id: 1004, bearing: 5.0, bearingCorrection: '1.00500' },
    { id: 1005, bearing: null, bearingCorrection: '0E-12' },
  ] as ITestRow[]);

  return (
    <GridWrapper maxHeight={300}>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={'customFilename'} />
      </GridFilters>
      <Grid
        data-testid={'bearingsTestTable'}
        {...props}
        readOnly={false}
        externalSelectedItems={externalSelectedItems}
        setExternalSelectedItems={setExternalSelectedItems}
        columnDefs={columnDefs}
        rowData={rowData}
        domLayout={'autoHeight'}
      />
    </GridWrapper>
  );
};

export const _GridPopoverEditBearing = GridPopoverEditBearingTemplate.bind({});
_GridPopoverEditBearing.play = async ({ canvasElement }) => {
  await waitForGridReady({ canvasElement });
  const canvas = within(canvasElement);

  const cell = await canvas.findByRole('gridcell', { name: /1° 23' 40"/i });
  await userEvent.dblClick(cell);

  const popover = await canvas.findByRole('presentation');
  const input = await within(popover).findByRole('textbox');
  await userEvent.clear(input);
  await userEvent.type(input, '123{Enter}');

  // Wait for the popover to close after saving
  await waitFor(
    () => {
      expect(canvas.queryByRole('presentation')).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );

  // Re-open the same cell
  const cellAfterSave = await canvas.findByRole('gridcell', { name: /123/i });
  await userEvent.dblClick(cellAfterSave);

  // Assert that the saving overlay is not present
  const popoverAfterReopen = await canvas.findByRole('presentation');
  const overlay = popoverAfterReopen.querySelector('.ComponentLoadingWrapper-saveOverlay');
  await expect(overlay).toBeNull();
};
