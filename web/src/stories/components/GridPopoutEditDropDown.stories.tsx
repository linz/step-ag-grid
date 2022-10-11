import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useCallback, useMemo, useState } from "react";
import { GridPopoutEditDropDown, MenuSeparator, MenuSeparatorString } from "../../components/GridPopoutEditDropDown";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { ColDef } from "ag-grid-community";

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
  position: string | null;
  position2: string | null;
  position3: string | null;
}

const GridEditDropDownTemplate: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);

  const optionsFn = useCallback((selectedRows: ITestRow[]) => {
    // eslint-disable-next-line no-console
    console.log("optionsFn selected rows", selectedRows);
    return new Promise<(string | null)[]>((resolve) => {
      setTimeout(
        () =>
          resolve([
            null,
            "Architect",
            "Developer",
            "Product Owner",
            "Scrum Master",
            "Tester",
            MenuSeparatorString,
            "(other)",
          ]),
        1000,
      );
    });
  }, []);

  const columnDefs = useMemo(
    () =>
      [
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
        GridPopoutEditDropDown<ITestRow, ITestRow["position"]>({
          field: "position",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Position",
          cellEditorParams: {
            options: ["Architect", "Developer", "Product Owner", "Scrum Master", "Tester", MenuSeparator, "(other)"],
          },
        }),
        GridPopoutEditDropDown<ITestRow, ITestRow["position2"]>({
          field: "position2",
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
              MenuSeparator,
              { value: "3", label: <span style={{ border: "2px dashed green" }}>Three</span> },
            ],
          },
        }),
        GridPopoutEditDropDown<ITestRow, ITestRow["position3"]>({
          field: "position3",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Custom callback",
          cellEditorParams: {
            multiEdit: true,
            options: [null, "Architect", "Developer", "Product Owner", "Scrum Master", "Tester", "(other)"],
            onSelectedItem: async (selectedItem) => {
              await new Promise<(string | null)[]>((resolve) => {
                setTimeout(resolve, 2000);
              });
            },
          },
        }),
        GridPopoutEditDropDown<ITestRow, ITestRow["position"]>({
          field: "position",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "options Fn",
          cellEditorParams: {
            options: optionsFn,
          },
        }),
      ] as ColDef[],
    [optionsFn],
  );

  const rowData = useMemo(
    () =>
      [
        { id: 1000, position: "Tester", position2: "Tester", position3: "Tester" },
        { id: 1001, position: "Developer", position2: "Developer", position3: "Developer" },
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
