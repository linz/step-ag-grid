import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridContextProvider } from "../../contexts/GridContextProvider";
import { Grid, GridProps } from "../../components/Grid";
import { useCallback, useMemo, useState } from "react";
import {
  GridFormDropDown,
  GridFormPopoutDropDownProps,
  MenuSeparator,
  MenuSeparatorString,
} from "../../components/gridForm/GridFormDropDown";
import { UpdatingContextProvider } from "../../contexts/UpdatingContextProvider";
import { ColDef } from "ag-grid-community";
import { wait } from "../../utils/util";
import { GridCell } from "../../components/GridCell";
import { GridPopoverEditDropDown } from "../../components/gridPopoverEdit/GridPopoverEditDropDown";

export default {
  title: "Components / Grids",
  component: Grid,
  args: {
    externalSelectedItems: [],
    setExternalSelectedItems: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1200, height: 400, display: "flex" }}>
        <UpdatingContextProvider>
          <GridContextProvider>
            <Story />
          </GridContextProvider>
        </UpdatingContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof Grid>;

interface ITestRow {
  id: number;
  position: string | null;
  position2: string | null;
  position3: string | null;
}

const GridEditDropDownTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);

  const optionsFn = useCallback(async (selectedRows: ITestRow[], filter?: string) => {
    // eslint-disable-next-line no-console
    console.log("optionsFn selected rows", selectedRows, filter);
    filter = filter?.toLowerCase();
    await wait(1000);
    return [
      null,
      "Architect",
      "Developer",
      "Product Owner",
      "Scrum Master",
      "Tester",
      MenuSeparatorString,
      "(other)",
    ].filter((v) => (filter != null ? v != null && v.toLowerCase().indexOf(filter) === 0 : true));
  }, []);

  const columnDefs = useMemo(
    () =>
      [
        GridCell({
          field: "id",
          headerName: "Id",
          initialWidth: 65,
          maxWidth: 85,
        }),
        GridCell<ITestRow, GridFormPopoutDropDownProps<ITestRow, ITestRow["position"]>>({
          field: "position",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Position",
          cellEditorParams: {
            form: GridFormDropDown,
            options: ["Architect", "Developer", "Product Owner", "Scrum Master", "Tester", MenuSeparator, "(other)"],
            multiEdit: false,
          },
        }),
        GridPopoverEditDropDown<ITestRow, ITestRow["position2"]>({
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
        GridPopoverEditDropDown<ITestRow, ITestRow["position3"]>({
          field: "position3",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Custom callback",
          cellEditorParams: {
            multiEdit: true,
            options: [null, "Architect", "Developer", "Product Owner", "Scrum Master", "Tester", "(other)"],
            onSelectedItem: async (selected) => {
              await wait(2000);
              selected.selectedRows.forEach((row) => (row.position3 = selected.value));
            },
          },
        }),
        GridPopoverEditDropDown<ITestRow, ITestRow["position"]>({
          field: "position",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Options Fn",
          cellEditorParams: {
            filtered: "reload",
            filterPlaceholder: "Search me...",
            options: optionsFn,
            optionsRequestCancel: () => {
              // TODO wrap options in an abortable request
              // When performing rest requests call the abort controller,
              // otherwise you'll get multiple requests coming back in different order
              // eslint-disable-next-line no-console
              console.log("optionsRequestCancelled");
            },
            multiEdit: false,
          },
        }),
        GridPopoverEditDropDown<ITestRow, ITestRow["position3"]>({
          field: "position3",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Filtered",
          cellEditorParams: {
            multiEdit: true,
            filtered: "local",
            filterPlaceholder: "Filter this",
            options: [null, "Architect", "Developer", "Product Owner", "Scrum Master", "Tester", "(other)"],
          },
        }),
      ] as ColDef[],
    [optionsFn],
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
    <Grid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
    />
  );
};

export const EditDropdown = GridEditDropDownTemplate.bind({});
