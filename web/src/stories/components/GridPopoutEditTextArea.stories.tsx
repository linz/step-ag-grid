import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useMemo, useState } from "react";
import { GridPopoutEditTextArea } from "../../components/GridPopoutEditTextArea";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { wait } from "../../utils/util";

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
  desc1: string;
  desc2: string;
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
    GridPopoutEditTextArea<ITestRow, ITestRow["desc1"]>({
      field: "desc1",
      headerName: "Popout Text Area",
      maxWidth: 140,
      cellEditorParams: {
        multiEdit: false,
      },
    }),
    GridPopoutEditTextArea<ITestRow, ITestRow["desc1"]>({
      field: "desc2",
      headerName: "Popout Text Area Custom Save",
      maxWidth: 220,
      cellEditorParams: {
        multiEdit: true,
        onSave: async (selectedItems, value) => {
          await wait(2000);
          if (value.length > 32) {
            alert("Text is longer than 32 characters");
            return false;
          }
          selectedItems.forEach((item) => (item.desc2 = value));
          return true;
        },
      },
    }),
  ];

  const rowData = useMemo(
    () =>
      [
        { id: 1000, desc1: "Tester", desc2: "Hello" },
        { id: 1001, desc1: "Developer", desc2: "Goodbye" },
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
