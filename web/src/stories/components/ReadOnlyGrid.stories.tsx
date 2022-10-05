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
      <div style={{ width: 500, height: 400, display: "flex" }}>
        <AgGridContextProvider>
          <Story />
        </AgGridContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof AgGrid>;

interface ITestRow {
  id: number;
  name: string;
  age: number;
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
      headerName: "Id.",
      initialWidth: 65,
      maxWidth: 85,
      suppressSizeToFit: true,
      sortable: true,
    },
    {
      colId: "name",
      field: "name",
      headerName: "Name",
      initialWidth: 65,
      maxWidth: 85,
      sortable: true,
    },
    {
      colId: "age",
      field: "age",
      headerName: "Age",
      initialWidth: 65,
      maxWidth: 85,
      sortable: true,
    },
  ],

  rowData: [{ id: 1000, name: "Tester", age: 30 }] as ITestRow[],
};
