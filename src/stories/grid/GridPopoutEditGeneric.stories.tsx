import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useMemo, useState } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import { ColDefT, Grid, GridCell, GridContextProvider, GridProps, GridUpdatingContextProvider } from "../..";
import "../../styles/GridTheme.scss";
import "../../styles/index.scss";
import { FormTest, IFormTestRow } from "./FormTest";

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

const GridPopoutEditGenericTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridCell(
        {
          field: "name",
          headerName: "Popout Generic Edit",
          maxWidth: 140,
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
    { id: 1000, name: "IS IS DP12345", nameType: "IS", numba: "IX", plan: "DP 12345" },
    { id: 1001, name: "PEG V SD523", nameType: "PEG", numba: "V", plan: "SD 523" },
  ] as IFormTestRow[]);

  return (
    <Grid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={"autoHeight"}
    />
  );
};

export const EditGeneric = GridPopoutEditGenericTemplate.bind({});
