import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useMemo, useState } from "react";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { ICellRendererParams } from "ag-grid-community";
import { GridPopoutEditGenericInput } from "../../components/GridPopoutEditGenericInput";
import { isFloat, wait } from "../../utils/util";
import { convertDDToDMS } from "../../utils/bearing";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

export default {
  title: "Components / Grids",
  component: AgGrid,
  args: {
    externalSelectedItems: [],
    setExternalSelectedItems: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1200, height: 400, display: "flex" }}>
        <UpdatingContextProvider>
          <AgGridContextProvider>
            <Story />
          </AgGridContextProvider>
        </UpdatingContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof AgGrid>;

interface ITestRow {
  id: number;
  bearing: number | null;
}

const bearingNumberFormatter = (params: ValueFormatterParams): string => {
  const value = params.value;
  if (value == null) {
    return "-";
  }
  return convertDDToDMS(value);
};

const bearingNumberParser = (value: string): number | null => {
  if (value === "") return null;
  return parseFloat(value);
};

const bearingStringValidator = (value: string): string | undefined => {
  value = value.trim();
  if (value === "") return undefined;
  if (!isFloat(value)) return "Bearing format is invalid";
  const bearing = parseFloat(value);
  if (bearing >= 360) return "Bearing must be between 0 and 360 inclusive";
};

const GridReadOnlyTemplate: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = useMemo(
    () => [
      {
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      },
      GridPopoutEditGenericInput({
        field: "bearing",
        headerName: "Bearing",
        initialWidth: 65,
        maxWidth: 150,
        cellRendererParams: {
          formatter: bearingNumberFormatter,
          warning: (props: ICellRendererParams) => props.data.id == 1002 && "Testers are testing",
          info: (props: ICellRendererParams) => props.data.id == 1001 && "Developers are developing",
        },
        cellEditorParams: {
          placeHolder: "Enter Bearing",
          parser: bearingNumberParser,
          validator: bearingStringValidator,
          multiEdit: false,
        },
      }),
      GridPopoutEditGenericInput<ITestRow, number | null>({
        field: "bearing",
        headerName: "Bearing callback",
        initialWidth: 65,
        maxWidth: 150,
        cellRendererParams: {
          formatter: bearingNumberFormatter,
          warning: (props: ICellRendererParams) => props.data.id == 1002 && "Testers are testing",
          info: (props: ICellRendererParams) => props.data.id == 1001 && "Developers are developing",
        },
        cellEditorParams: {
          placeHolder: "Enter Bearing",
          parser: bearingNumberParser,
          validator: bearingStringValidator,
          multiEdit: true,
          onSave: async (selectedRows, value) => {
            await wait(1000);
            // eslint-disable-next-line no-console
            console.log({ selectedRows, value });
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
        { id: 1000, bearing: 1.234 },
        { id: 1001, bearing: 1.566 },
        { id: 1002, bearing: null },
      ] as ITestRow[],
    [],
  );

  return (
    <AgGrid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
    />
  );
};

export const Bearings = GridReadOnlyTemplate.bind({});
