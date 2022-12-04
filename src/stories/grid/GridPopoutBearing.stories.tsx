import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../styles/index.scss";
import "../../styles/GridTheme.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useMemo, useState } from "react";
import { GridUpdatingContextProvider } from "../../contexts/GridUpdatingContextProvider";
import { GridContextProvider } from "../../contexts/GridContextProvider";
import { Grid, GridProps } from "../../components/Grid";
import { ColDefT, GridCell } from "../../components/GridCell";
import {
  GridPopoverEditBearing,
  GridPopoverEditBearingCorrection,
} from "../../components/gridPopoverEdit/GridPopoverEditBearing";
import { wait } from "../../utils/util";

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

interface ITestRow {
  id: number;
  bearingCorrection: number | null;
  bearing: string | number | null;
}

const GridReadOnlyTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridPopoverEditBearingCorrection(
        {
          field: "bearingCorrection",
          headerName: "Bearing correction",
          cellRendererParams: {
            warning: (props) => props.data.id == 1002 && "Testers are testing",
            info: (props) => props.data.id == 1001 && "Developers are developing",
          },
        },
        {
          multiEdit: false,
        },
      ),
      GridPopoverEditBearing(
        {
          field: "bearing",
          headerName: "Bearing",
        },
        {
          editorParams: {
            onSave: async (selectedRows, value: ITestRow["bearing"]) => {
              await wait(1000);
              selectedRows.forEach((row) => (row["bearing"] = value));
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
    { id: 1001, bearing: "0E-12", bearingCorrection: 240 },
    { id: 1002, bearing: null, bearingCorrection: 355.1 },
    { id: 1003, bearing: null, bearingCorrection: 0 },
    { id: 1004, bearing: 5.0, bearingCorrection: "1.00500" },
  ] as ITestRow[]);

  return (
    <Grid
      data-testid={"bearingsTestTable"}
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={"autoHeight"}
    />
  );
};

export const Bearings = GridReadOnlyTemplate.bind({});
