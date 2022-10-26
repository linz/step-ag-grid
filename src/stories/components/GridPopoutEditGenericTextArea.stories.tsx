import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridContextProvider } from "../../contexts/GridContextProvider";
import { Grid, GridProps } from "../../components/Grid";
import { useMemo, useState } from "react";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { GridCell } from "../../components/GridCell";
import { IFormTestRow } from "./FormTest";
import { GridFormTextArea, GridFormTextAreaProps } from "../../components/gridForm/GridFormTextArea";
import { GridFormTextInput, GridFormTextInputProps } from "../../components/gridForm/GridFormTextInput";
import { wait } from "../../utils/util";

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

const GridPopoutEditGenericTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridCell<IFormTestRow, GridFormTextInputProps<IFormTestRow>>({
        field: "name",
        headerName: "Text input",
        maxWidth: 140,
        cellEditorParams: {
          form: GridFormTextInput,
          required: true,
          maxlength: 12,
          placeholder: "Enter some text...",
          width: 240,
          multiEdit: false,
          onSave: async (selectedRows, value) => {
            await wait(1000);
            selectedRows.forEach((selectedRow) => (selectedRow["name"] = value));
            return true;
          },
        },
      }),
      GridCell<IFormTestRow, GridFormTextAreaProps<IFormTestRow>>({
        field: "plan",
        headerName: "Text area",
        maxWidth: 140,
        cellEditorParams: {
          form: GridFormTextArea,
          required: true,
          maxlength: 32,
          placeholder: "Enter some text...",
          width: 260,
          multiEdit: true,
          onSave: async (selectedRows, value) => {
            await wait(1000);
            selectedRows.forEach((selectedRow) => (selectedRow["plan"] = value));
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

export const EditGenericTextArea = GridPopoutEditGenericTemplate.bind({});
