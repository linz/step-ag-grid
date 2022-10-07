import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useMemo, useState } from "react";
import { GridDropDown } from "../../components/GridDropDown";
import { GridPopoutMessage } from "../../components/GridPopoutMessage";

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
  dd: string;
}

const GridEditDropDownTemplate: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = [
    {
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
    GridDropDown({
      field: "position",
      initialWidth: 65,
      maxWidth: 150,
      headerName: "Position",
      cellEditorParams: {
        options: ["Architect", "Developer", "Product Owner", "Scrum Master", "Tester", "(other)"],
      },
    }),
    GridDropDown({
      field: "dd",
      maxWidth: 100,
      headerName: "Multi-edit",
      cellEditorParams: {
        multiEdit: true,
        options: [
          { value: 1, label: "One" },
          { value: 2, label: "Two" },
          { value: 3, label: "Three" },
        ],
      },
    }),
  ];

  const rowData = useMemo(
    () =>
      [
        { id: 1000, position: "Tester", dd: "1" },
        { id: 1001, position: "Developer", dd: "2" },
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

export const EditDropdown = GridEditDropDownTemplate.bind({});
