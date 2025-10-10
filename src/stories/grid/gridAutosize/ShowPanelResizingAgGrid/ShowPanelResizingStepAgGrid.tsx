// import '../story.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '../../../../styles/Grid.scss';

import {
  OpenPanelButton,
  Panel,
  PanelContent,
  PanelContext,
  PanelHeader,
  PanelsContextProvider,
} from '@linzjs/windows';
import { useContext, useMemo, useState } from 'react';

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridIcon,
  GridPopoverMenu,
  GridPopoverMessage,
  GridUpdatingContextProvider,
  GridWrapper,
} from '../../../../../src';

// #Example: Panel Context Provider
// Don't forget to add a PanelContextProvider at the root of your project
export const App = () => (
  <PanelsContextProvider baseZIndex={500}>
    <div>...the rest of your app...</div>
  </PanelsContextProvider>
);

// #Example: Panel Component
export interface TestPanelProps {
  data: number;
}

export const TestPanelResizing = ({ data }: TestPanelProps) => {
  return (
    <Panel title={`Panel resizing demo ${data}`} size={{ width: 320, height: 400 }} className={'WindowPanel-blue'}>
      <PanelHeader />
      <PanelContent>
        <PanelContentsWithResize />
      </PanelContent>
    </Panel>
  );
};

// #Example: Panel Invocation
export const TestShowPanelResizingAgGrid = () => (
  <>
    <OpenPanelButton buttonText={'TestPanel resizing 1'} componentFn={() => <TestPanelResizing data={1} />} />{' '}
    <OpenPanelButton buttonText={'TestPanel resizing 2'} componentFn={() => <TestPanelResizing data={2} />} />
  </>
);

/* exclude */
interface ITestRow {
  id: number;
  position: string;
  age: number;
  desc: string;
  dd: string;
}

/* exclude */

// #Example: Resizing panel to content after load
// Note: Resize can only be used from within the panel content.
export const PanelContentsWithResize = () => {
  // This is the first important bit
  const { initialResizePanel } = useContext(PanelContext);

  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      /* Your grid ColDefs */
      /* exclude */
      GridCell({
        field: 'id',
        headerName: 'Id',
        lockVisible: true,
      }),
      GridCell({
        field: 'position',
        headerName: 'Position',
        cellRendererParams: {
          warning: (props) => props.value === 'Tester' && 'Testers are testing',
          info: (props) => props.value === 'Developer' && 'Developers are awesome',
        },
      }),
      GridCell({
        field: 'age',
        headerName: 'Age',
      }),
      GridCell({
        field: 'desc',
        headerName: 'Description',
        flex: 1,
      }),
      GridPopoverMessage(
        {
          headerName: 'Popout message',
          cellRenderer: () => <>Single Click me!</>,
          exportable: false,
        },
        {
          multiEdit: true,
          editorParams: {
            // eslint-disable-next-line @typescript-eslint/require-await
            message: async (selectedRows): Promise<string> => {
              return `There are ${selectedRows.length} row(s) selected`;
            },
          },
        },
      ),
      GridCell({
        headerName: 'Custom edit',
        editable: true,
        valueFormatter: () => 'Press E',
        cellRendererParams: {
          rightHoverElement: (
            <GridIcon icon={'ic_launch_modal'} title={'Title text'} className={'GridCell-editableIcon'} />
          ),
          editAction: (selectedRows) => {
            alert(`Custom edit ${selectedRows.map((r) => r.id).join()} rowId(s) selected`);
          },
          shortcutKeys: {
            e: () => {
              alert('Hi');
            },
          },
        },
      }),
      GridPopoverMenu(
        {},
        {
          multiEdit: true,
          editorParams: {
            // eslint-disable-next-line @typescript-eslint/require-await
            options: async () => [],
          },
        },
      ),
      /* exclude */
    ],
    [],
  );

  const [rowData] = useState([
    /* Your grid row data */
    /* exclude */
    {
      id: 1000,
      position: 'Tester',
      age: 30,
      desc: 'Tests application',
      dd: '1',
    },
    { id: 1001, position: 'Developer', age: 12, desc: 'Develops application', dd: '2' },
    { id: 1002, position: 'Manager', age: 65, desc: 'Manages', dd: '3' },
    /* exclude */
  ]);

  return (
    <GridUpdatingContextProvider>
      <GridContextProvider>
        <GridWrapper>
          <Grid
            columnDefs={columnDefs}
            rowData={rowData}
            onContentSize={initialResizePanel}
            sizeColumns={'auto-skip-headers'}
          />
        </GridWrapper>
      </GridContextProvider>
    </GridUpdatingContextProvider>
  );
};
