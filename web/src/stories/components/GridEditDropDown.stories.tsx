import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useMemo, useState } from "react";
import { GridDropDown } from "../../components/GridDropDown";

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
  position: string | null;
  age: number;
  desc: string;
  dd: string;
}

const GridEditDropDownTemplate: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs = useMemo(
    () => [
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
      GridDropDown<ITestRow, ITestRow["position"]>({
        field: "position",
        initialWidth: 65,
        maxWidth: 150,
        headerName: "Position",
        cellEditorParams: {
          options: ["Architect", "Developer", "Product Owner", "Scrum Master", "Tester", "(other)"],
        },
      }),
      GridDropDown<ITestRow, ITestRow["dd"]>({
        field: "dd",
        maxWidth: 100,
        headerName: "Multi-edit",
        cellEditorParams: {
          multiEdit: true,
          options: [
            {
              value: "1",
              label: <span style={{ border: "2px dashed blue" }}>One</span>,
            },
            { value: "2", label: <span style={{ border: "2px dashed red" }}>Two</span> },
            { value: "3", label: <span style={{ border: "2px dashed green" }}>Three</span> },
          ],
        },
      }),
      GridDropDown<ITestRow, ITestRow["position"]>({
        field: "position",
        initialWidth: 65,
        maxWidth: 150,
        headerName: "Custom callback",
        cellEditorParams: {
          options: [null, "Architect", "Developer", "Product Owner", "Scrum Master", "Tester", "(other)"],
          onSelectedItem: (selectedItem) => {
            // eslint-disable-next-line no-console
            console.log({ selectedItem });
            alert(`Item selected, check console.log for info`);
          },
        },
      }),
    ],
    [],
  );

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
