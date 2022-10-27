import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useMemo, useState } from "react";
import { UpdatingContextProvider } from "@contexts/UpdatingContextProvider";
import { GridContextProvider } from "@contexts/GridContextProvider";
import { Grid, GridProps } from "@components/Grid";
import { GridCell } from "@components/GridCell";
import {
  GridPopoverEditBearing,
  GridPopoverEditBearingCorrection,
} from "@components/gridPopoverEdit/GridPopoverEditBearing";
import { wait } from "@utils/util";

export default {
  title: "Components / Grids",
  component: Grid,
  args: {
    externalSelectedItems: [],
    setExternalSelectedItems: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1200, height: 400, display: "flex" }}>
        <UpdatingContextProvider>
          <GridContextProvider>
            <Story />
          </GridContextProvider>
        </UpdatingContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof Grid>;

interface ITestRow {
  id: number;
  bearing1: number | null;
  bearingCorrection: number | null;
}

const GridReadOnlyTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridPopoverEditBearing<ITestRow>({
        field: "bearing1",
        headerName: "Bearing GCE",
        cellRendererParams: {
          warning: (props) => props.data.id == 1002 && "Testers are testing",
          info: (props) => props.data.id == 1001 && "Developers are developing",
        },
        cellEditorParams: {
          multiEdit: false,
          placeHolder: "Enter Bearing",
        },
      }),
      GridPopoverEditBearingCorrection<ITestRow>({
        field: "bearingCorrection",
        headerName: "Bearing Correction",
        cellEditorParams: {
          multiEdit: true,
          placeHolder: "Enter Bearing",
          onSave: async (selectedRows: ITestRow[], value: ITestRow["bearingCorrection"]) => {
            await wait(1000);
            selectedRows.forEach((row) => (row["bearingCorrection"] = value));
            return true;
          },
        },
      }),
    ],
    [],
  );

  const rowData = useMemo(
    () =>
      [
        { id: 1000, bearing1: 1.234, bearingCorrection: 90 },
        { id: 1001, bearing1: 1.565, bearingCorrection: 240 },
        { id: 1002, bearing1: null, bearingCorrection: 355.1 },
      ] as ITestRow[],
    [],
  );

  return (
    <Grid
      {...props}
      selectable={true}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
    />
  );
};

export const Bearings = GridReadOnlyTemplate.bind({});
