import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useState } from "react";

export default {
  title: "Components / Grids",
  component: AgGrid,
  args: {
    externalSelectedItems: [],
    setExternalSelectedItems: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600, height: 400, display: "flex" }}>
        <AgGridContextProvider>
          <Story />
        </AgGridContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof AgGrid>;

interface ITestRow {
  id: number;
  position: string;
  age: number;
  desc: string;
}

const Template: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  return (
    <AgGrid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
    />
  );
};

export const ReadOnlyGrid = Template.bind({});
ReadOnlyGrid.args = {
  columnDefs: [
    {
      colId: "id",
      field: "id",
      headerName: "Id",
      initialWidth: 65,
      maxWidth: 150,
      suppressSizeToFit: true,
      sortable: true,
      resizable: true,
      editable: true,
      cellEditor: "agTextCellEditor",
    },
    {
      colId: "position",
      field: "position",
      headerName: "Position",
      initialWidth: 65,
      maxWidth: 150,
      sortable: true,
      resizable: true,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Architect",
          "Developer",
          "Product Owner",
          "Scrum Master",
          "Tester",
          "(other)",
        ],
      },
    },
    {
      colId: "age",
      field: "age",
      headerName: "Age",
      initialWidth: 65,
      maxWidth: 150,
      sortable: true,
      resizable: true,
    },
    {
      colId: "desc",
      field: "desc",
      headerName: "Description",
      initialWidth: 150,
      maxWidth: 200,
      suppressSizeToFit: true,
      sortable: true,
      resizable: true,
      editable: true,
      cellEditor: "agLargeTextCellEditor",
      autoHeight: true,
      wrapText: true,
    },
  ],

  rowData: [
    { id: 1000, position: "Tester", age: 30, desc: "Tests application" },
    { id: 1001, position: "Developer", age: 12, desc: "Develops application" },
  ] as ITestRow[],
};
