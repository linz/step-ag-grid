import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useMemo, useState } from "react";
import { GridPopoutEditTextArea } from "../../components/GridPopoutEditTextArea";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";

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
  position: string;
  age: number;
  desc: string;
  dd: string;
}

const GridPopoutTextAreaTemplate: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = [
    {
      field: "id",
      headerName: "Id",
      initialWidth: 65,
      maxWidth: 85,
    },
    GridPopoutEditTextArea<ITestRow, ITestRow["desc"]>({
      field: "desc",
      headerName: "Popout Text Area",
      maxWidth: 140,
      cellEditorParams: {},
    }),
    GridPopoutEditTextArea<ITestRow, ITestRow["desc"]>({
      field: "desc",
      headerName: "Popout Text Area Custom Save",
      maxWidth: 220,
      cellEditorParams: {
        multiEdit: true,
        onSave: (selectedItems, value) => {
          if (value.length > 32) return false;
          selectedItems.forEach((item) => (item.desc = value));
          return true;
        },
      },
    }),
  ];

  const rowData = useMemo(
    () =>
      [
        { id: 1000, position: "Tester", age: 30, desc: "Tests application" },
        { id: 1001, position: "Developer", age: 12, desc: "Develops application" },
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

export const EditTextArea = GridPopoutTextAreaTemplate.bind({});
