import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useCallback, useContext, useMemo, useState } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import {
  ActionButton,
  ColDefT,
  Editor,
  Grid,
  GridCell,
  GridCellMultiEditor,
  GridContext,
  GridContextProvider,
  GridFormDropDown,
  GridFormTextArea,
  GridPopoverMenu,
  GridPopoverTextArea,
  GridPopoverTextInput,
  GridProps,
  GridUpdatingContextProvider,
  isFloat,
  wait,
} from "../..";
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

const GridPopoutEditGenericTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
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
      GridPopoverTextInput(
        {
          field: "name",
          headerName: "Text input",
        },
        {
          multiEdit: true,
          editorParams: {
            required: true,
            maxLength: 12,
            placeholder: "Enter some text...",
            invalid: (value: string) => {
              if (value === "never") return "The value 'never' is not allowed";
              return null;
            },
            onSave: async ({ selectedRows, value }) => {
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
          valueFormatter: (params) => {
            const v = params.data.distance;
            return v != null ? `${v}${params.colDef.cellEditorParams.units}` : "–";
          },
        },
        {
          multiEdit: false,
          editorParams: {
            maxLength: 12,
            placeholder: "Enter distance...",
            units: "m",
            invalid: (value: string) => {
              if (value.length && !isFloat(value)) return "Value must be a number";
              return null;
            },
            onSave: async ({ selectedRows, value }) => {
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
        },
        {
          multiEdit: true,
          editorParams: {
            required: true,
            maxLength: 32,
            placeholder: "Enter some text...",
            invalid: (value: string) => {
              if (value === "never") return "The value 'never' is not allowed";
              return null;
            },
            onSave: async ({ selectedRows, value }) => {
              await wait(1000);
              selectedRows.forEach((selectedRow) => (selectedRow["plan"] = value));
              return true;
            },
          },
        },
      ),
      GridCellMultiEditor(
        {
          colId: "plan2",
          field: "plan",
          headerName: "Multi-editor",
        },
        (_params) =>
          _params.rowIndex == 0
            ? Editor({
                multiEdit: true,
                editor: GridFormTextArea,
                editorParams: {
                  required: true,
                  maxLength: 32,
                  placeholder: "Enter some text...",
                },
              })
            : Editor({
                multiEdit: false,
                editor: GridFormDropDown,
                editorParams: {
                  options: [{ label: "One", value: 1 }],
                },
              }),
      ),
      GridPopoverMenu(
        {
          headerName: "",
        },
        {
          multiEdit: true,
          editorParams: {
            options: async (_) => [
              {
                label: "Delete",
                action: async ({ selectedRows }) => {
                  await wait(1500);
                  setRowData(rowData.filter((data) => !selectedRows.some((row) => row.id == data.id)));
                },
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
      />
      <ActionButton icon={"ic_add"} name={"Add new row"} inProgressName={"Adding..."} onClick={addRowAction} />
    </>
  );
};

export const EditGenericTextArea = GridPopoutEditGenericTemplate.bind({});
