import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { AgGridContextProvider } from "../../contexts/AgGridContextProvider";
import { AgGrid, AgGridProps } from "../../components/AgGrid";
import { useCallback, useMemo, useState } from "react";
import { GridPopoutEditDropDown, MenuSeparator, MenuSeparatorString } from "../../components/GridPopoutEditDropDown";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { ColDef } from "ag-grid-community";
import { wait } from "../../utils/util";
import { GridPopoutEditMultiSelect, MultiSelectResult } from "../../components/GridPopoutEditMultiSelect";
import { GridSubComponentTextArea, GridSubComponentTextAreaProps } from "../../components/GridSubComponentTextArea";

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

const GridEditMultiSelectTemplate: ComponentStory<typeof AgGrid> = (props: AgGridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);

  const optionsFn = useCallback(async (selectedRows: ITestRow[]) => {
    // eslint-disable-next-line no-console
    console.log("optionsFn selected rows", selectedRows);
    await wait(1000);
    return [null, "Architect", "Developer", "Product Owner", "Scrum Master", "Tester", MenuSeparatorString, "(other)"];
  }, []);

  const columnDefs = useMemo(
    () =>
      [
        {
          field: "id",
          headerName: "Id",
          initialWidth: 65,
          maxWidth: 85,
        },
        GridPopoutEditMultiSelect<ITestRow, ITestRow["position"]>({
          field: "position",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Position",
          cellEditorParams: {
            filtered: true,
            filterPlaceholder: "Filter position",
            options: [
              { value: "a", label: "Architect" },
              { value: "b", label: "Developer" },
              { value: "c", label: "Product Owner" },
              { value: "d", label: "Scrum Master" },
              { value: "e", label: "Tester" },
              MenuSeparator,
              {
                value: "f",
                label: "Other",
                subComponent: (props) => <GridSubComponentTextArea {...props} />,
              },
            ],
            onSave: async (result: MultiSelectResult<ITestRow>) => {
              console.log(result);
              await wait(1000);
              return true;
            },
          },
        }),
      ] as ColDef[],
    [],
  );

  const rowData = useMemo(
    () =>
      [
        { id: 1000, position: "Tester", position2: "1", position3: "Tester" },
        { id: 1001, position: "Developer", position2: "2", position3: "Developer" },
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

export const EditMultiSelect = GridEditMultiSelectTemplate.bind({});
