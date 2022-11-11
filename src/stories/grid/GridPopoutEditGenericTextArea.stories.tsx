import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../styles/index.scss";
import "../../styles/GridTheme.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridUpdatingContextProvider } from "../../contexts/GridUpdatingContextProvider";
import { GridContextProvider } from "../../contexts/GridContextProvider";
import { Grid, GridProps } from "../../components/Grid";
import { useCallback, useMemo, useState } from "react";
import { ColDefT, GridCell } from "../../components/GridCell";
import { IFormTestRow } from "./FormTest";
import { isFloat, wait } from "../../utils/util";
import { GridPopoverTextArea } from "../../components/gridPopoverEdit/GridPopoverTextArea";
import { GridPopoverTextInput } from "../../components/gridPopoverEdit/GridPopoverTextInput";
import { ActionButton } from "../../lui/ActionButton";
import { GridPopoverMenu } from "../../components/gridPopoverEdit/GridPopoverMenu";

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
  const [rowData, setRowData] = useState([
    { id: 1000, name: "IS IS DP12345", nameType: "IS", numba: "IX", plan: "DP 12345", distance: 10 },
    { id: 1001, name: "PEG V SD523", nameType: "PEG", numba: "V", plan: "SD 523", distance: null },
  ] as IFormTestRow[]);

  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(
    () => [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridPopoverTextInput(
        {
          field: "name",
          headerName: "Text input",
          maxWidth: 140,
        },
        {
          multiEdit: true,
          editorParams: {
            required: true,
            maxLength: 12,
            placeholder: "Enter some text...",
            validate: (value: string) => {
              if (value === "never") return "The value 'never' is not allowed";
              return null;
            },
            onSave: async (selectedRows, value) => {
              await wait(1000);
              selectedRows.forEach((selectedRow) => (selectedRow["name"] = value));
              return true;
            },
          },
        },
      ),
      GridPopoverTextInput(
        {
          field: "distance",
          headerName: "Number input",
          maxWidth: 140,
          valueFormatter: (params) => {
            const v = params.data.distance;
            return v != null ? `${v}${params.colDef.cellEditorParams.units}` : v;
          },
        },
        {
          multiEdit: true,
          editorParams: {
            maxLength: 12,
            placeholder: "Enter distance...",
            units: "m",
            validate: (value: string) => {
              if (value.length && !isFloat(value)) return "Value must be a number";
              return null;
            },
            onSave: async (selectedRows, value) => {
              await wait(1000);
              selectedRows.forEach(
                (selectedRow) => (selectedRow["distance"] = value.length ? parseFloat(value) : null),
              );
              return true;
            },
          },
        },
      ),
      GridPopoverTextArea(
        {
          field: "plan",
          headerName: "Text area",
          maxWidth: 140,
        },
        {
          multiEdit: true,
          editorParams: {
            required: true,
            maxLength: 32,
            placeholder: "Enter some text...",

            validate: (value: string) => {
              if (value === "never") return "The value 'never' is not allowed";
              return null;
            },
            onSave: async (selectedRows, value) => {
              await wait(1000);
              selectedRows.forEach((selectedRow) => (selectedRow["plan"] = value));
              return true;
            },
          },
        },
      ),
      GridPopoverMenu(
        {
          headerName: "Delete menu",
        },
        {
          multiEdit: true,
          editorParams: {
            options: async (_) => [
              {
                label: "Delete",
                action: async (selectedRows) => {
                  await wait(1500);
                  setRowData(rowData.filter((data) => !selectedRows.some((row) => row.id == data.id)));
                  return true;
                },
                supportsMultiEdit: true,
              },
            ],
          },
        },
      ),
    ],
    [rowData],
  );

  const addRowAction = useCallback(async () => {
    await wait(1000);
    const lastRow = rowData[rowData.length - 1];
    setRowData([...rowData, { id: lastRow.id + 1, name: "?", nameType: "?", numba: "?", plan: "", distance: null }]);
  }, [rowData]);

  return (
    <>
      <Grid
        {...props}
        externalSelectedItems={externalSelectedItems}
        setExternalSelectedItems={setExternalSelectedItems}
        columnDefs={columnDefs}
        rowData={rowData}
        domLayout={"autoHeight"}
      />
      <ActionButton icon={"ic_add"} name={"Add new row"} inProgressName={"Adding..."} onAction={addRowAction} />
    </>
  );
};

export const EditGenericTextArea = GridPopoutEditGenericTemplate.bind({});