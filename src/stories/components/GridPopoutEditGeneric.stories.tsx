import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridUpdatingContextProvider } from "@contexts/GridUpdatingContextProvider";
import { GridContextProvider } from "@contexts/GridContextProvider";
import { Grid, GridProps } from "@components/Grid";
import { useMemo, useState } from "react";
import { ColDefT, GridCell } from "@components/GridCell";
import { FormTest, IFormTestRow } from "./FormTest";

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
          editor: FormTest,
          editorParams: {
            a: 4,
            multiEdit: false,
          },
        },
      ),
    ],
    [],
  );

  const rowData = useMemo(
    () =>
      [
        { id: 1000, name: "IS IS DP12345", nameType: "IS", numba: "IX", plan: "DP 12345" },
        { id: 1001, name: "PEG V SD523", nameType: "PEG", numba: "V", plan: "SD 523" },
      ] as IFormTestRow[],
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

export const EditGeneric = GridPopoutEditGenericTemplate.bind({});
