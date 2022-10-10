import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useMemo, useState } from "react";
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

const GridReadOnlyTemplate: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
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
      cellEditor: "agTextCellEditor",
    },
    {
      field: "position",
      headerName: "Position",
      initialWidth: 65,
      maxWidth: 150,
      sortable: true,
      resizable: true,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Architect", "Developer", "Product Owner", "Scrum Master", "Tester", "(other)"],
      },
    },
    {
      field: "age",
      headerName: "Age",
      initialWidth: 65,
      maxWidth: 85,
      sortable: true,
      resizable: true,
    },
    {
      field: "desc",
      headerName: "Description",
      initialWidth: 150,
      maxWidth: 200,
      suppressSizeToFit: true,
      sortable: true,
      resizable: true,
      wrapText: true,
    },
    {
      field: "dd",
      headerName: "Popout message",
      cellEditor: GridPopoutMessage,
      editable: true,
      maxWidth: 120,
      cellEditorParams: {
        message: (
          <span>
            Lorem ipsum dolor sit amet, ius noluisse concludaturque no. Per ea erat postea numquam. Duo at minimum
            lucilius qualisque, et prompta eligendi disputando pri, usu et noluisse pertinacia. Ea nominavi iracundia
            gubergren vis, ius ut iisque gubergren urbanitas, pro ea adhuc omittam disputando. Quo sint mediocritatem
            in, zril euismod docendi quo in. Cum volumus insolens similique te. Ceteros expetendis quo at. Sea case
            dignissim cu. Aeque feugait eu vel, commune consulatu sadipscing sit at.
          </span>
        ),
      },
    },
  ];

  const rowData = useMemo(
    () =>
      [
        { id: 1000, position: "Tester", age: 30, desc: "Tests application", dd: "1" },
        { id: 1001, position: "Developer", age: 12, desc: "Develops application", dd: "2" },
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

export const ReadOnly = GridReadOnlyTemplate.bind({});
