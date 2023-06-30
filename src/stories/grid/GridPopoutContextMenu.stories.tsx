import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useCallback, useContext, useMemo, useState } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import {
  ActionButton,
  ColDefT,
  Grid,
  GridCell,
  GridContext,
  GridContextProvider,
  GridProps,
  GridUpdatingContextProvider,
  wait,
} from "../..";
import { GridContextMenuItem } from "../../components/gridPopoverEdit/GridContextMenu";
import "../../styles/GridTheme.scss";
import "../../styles/index.scss";
import { IFormTestRow } from "./FormTest";

export default {
  title: "Components / Grids",
  component: Grid,
  args: {
    quickFilterValue: "",
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
} as ComponentMeta<typeof Grid>;

const GridPopoutContextMenuTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const { selectRowsWithFlashDiff } = useContext(GridContext);
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const [rowData, setRowData] = useState([
    { id: 1000, name: "IS IS DP12345", nameType: "IS", numba: "IX", plan: "DP 12345", distance: 10 },
    { id: 1001, name: "PEG V SD523", nameType: "PEG", numba: "V", plan: "SD 523", distance: null },
  ] as IFormTestRow[]);

  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
      }),
      GridCell({
        field: "name",
        headerName: "Name",
      }),
      GridCell({
        field: "distance",
        headerName: "Number input",
        valueFormatter: (params) => {
          const v = params.data.distance;
          return v != null ? `${v}m` : "–";
        },
      }),
    ],
    [],
  );

  const addRowAction = useCallback(async () => {
    await wait(1000);

    const lastRow = rowData[rowData.length - 1];
    await selectRowsWithFlashDiff(async () => {
      setRowData([
        ...rowData,
        {
          id: (lastRow?.id ?? 0) + 1,
          name: "?",
          nameType: "?",
          numba: "?",
          plan: "",
          distance: null,
        },
      ]);
    });
  }, [rowData, selectRowsWithFlashDiff]);

  const contextMenu = useCallback(
    (selectedRows: IFormTestRow[]): GridContextMenuItem[] => [
      {
        label: "Clear cell...",
        onSelect: async ({ colDef }) => {
          // eslint-disable-next-line no-console
          selectedRows.forEach((row) => {
            switch (colDef.field) {
              case "name":
                row.name = "";
                break;
              case "distance":
                row.distance = null;
                break;
            }
          });
        },
      },
      { label: "Should be invisible", visible: false, onSelect: () => {} },
      { label: "Disabled", disabled: true, onSelect: () => {} },
    ],
    [],
  );

  return (
    <>
      <Grid
        {...props}
        externalSelectedItems={externalSelectedItems}
        setExternalSelectedItems={setExternalSelectedItems}
        columnDefs={columnDefs}
        rowData={rowData}
        domLayout={"autoHeight"}
        defaultColDef={{ minWidth: 70 }}
        sizeColumns={"auto"}
        onCellEditingComplete={() => {
          /* eslint-disable-next-line no-console */
          console.log("Cell editing complete");
        }}
        contextMenu={contextMenu}
      />
      <ActionButton icon={"ic_add"} name={"Add new row"} inProgressName={"Adding..."} onClick={addRowAction} />
    </>
  );
};

export const EditContextMenu = GridPopoutContextMenuTemplate.bind({});
