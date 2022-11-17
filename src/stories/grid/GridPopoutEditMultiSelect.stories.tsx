import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../styles/index.scss";
import "../../styles/GridTheme.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridUpdatingContextProvider } from "../../contexts/GridUpdatingContextProvider";
import { GridContextProvider } from "../../contexts/GridContextProvider";
import { Grid, GridProps } from "../../components/Grid";
import { useMemo, useState } from "react";
import { MenuHeaderItem, MenuSeparator } from "../../components/gridForm/GridFormDropDown";
import { wait } from "../../utils/util";
import { GridFormSubComponentTextArea } from "../../components/gridForm/GridFormSubComponentTextArea";
import { ColDefT, GridCell } from "../../components/GridCell";
import { GridPopoutEditMultiSelect } from "../../components/gridPopoverEdit/GridPopoutEditMultiSelect";
import { partition } from "lodash-es";
import { MultiFinalSelectOption } from "../../components/gridForm/GridFormMultiSelect";

export default {
  title: "Components / Grids",
  component: Grid,
  args: {
    quickFilterValue: "",
    selectable: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1024, height: 400 }}>
        <GridUpdatingContextProvider>
          <GridContextProvider>
            <Story />
          </GridContextProvider>
        </GridUpdatingContextProvider>
      </div>
    ),
  ],
} as ComponentMeta<typeof Grid>;

interface ITestRow {
  id: number;
  position: string[] | null;
  position2: string | null;
  position3: string | null;
}

const GridEditMultiSelectTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);

  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => {
    const positionMap: Record<string, string> = {
      a: "Architect",
      b: "Developer",
      c: "Product Owner",
      d: "Scrum Master",
      e: "Tester",
      other: "Other",
    };
    const positionTwoMap: Record<string, string> = {
      "1": "One",
      "2": "Two",
      "3": "Three",
    };
    return [
      GridCell({
        field: "id",
        headerName: "Id",
        initialWidth: 65,
        maxWidth: 85,
      }),
      GridPopoutEditMultiSelect(
        {
          field: "position",
          initialWidth: 65,
          maxWidth: 250,
          headerName: "Position",
          valueFormatter: ({ value }) => {
            if (value == null) return "";
            return value.map((v: string) => positionMap[v] ?? v).join(", ");
          },
        },
        {
          multiEdit: true,
          editorParams: {
            filtered: true,
            filterPlaceholder: "Filter position",
            className: "GridMultiSelect-containerUnlimited",
            options: [
              MenuHeaderItem("Header item"),
              { value: "a", label: "Architect" },
              { value: "b", label: "Developer" },
              { value: "c", label: "Product Owner" },
              { value: "d", label: "Scrum Master" },
              { value: "e", label: "Tester" },
              MenuSeparator,
              {
                value: "other",
                label: "Other",
                subComponent: () => <GridFormSubComponentTextArea required={true} maxLength={5} defaultValue={""} />,
              },
            ],
            onSave: async (selectedRows, selectedOptions) => {
              // eslint-disable-next-line no-console
              console.log("multiSelect result", { selectedRows, selectedOptions });

              await wait(1000);
              const [subValues, normalValues] = partition(selectedOptions, (o) => o.subComponent);
              const newValue = [...normalValues.map((o) => o.value), ...subValues.map((o) => o.subValue)];
              selectedRows.forEach((row) => (row.position = newValue));
              return true;
            },
          },
        },
      ),
      GridPopoutEditMultiSelect(
        {
          field: "position",
          initialWidth: 65,
          maxWidth: 250,
          headerName: "Parcel picker",
          valueFormatter: ({ value }) => {
            if (value == null) return "";
            return value.map((v: string) => positionMap[v] ?? v).join(", ");
          },
        },
        {
          multiEdit: true,
          editorParams: {
            filtered: true,
            filterPlaceholder: "Filter/add custom parcel...",
            onSelectFilter: async (filter, options) => {
              if (options.find((o) => o.label === filter)) return;
              options.push({ value: filter, label: filter, filter: "freeText", checked: true });
            },
            className: "GridMultiSelect-containerLarge",
            headers: [{ header: "Parcels" }, { header: "Free text", filter: "freeText" }],
            options: (selectedRows) => {
              const firstRow = selectedRows[0];
              const r: MultiFinalSelectOption[] = [
                { value: "a", label: "Architect" },
                { value: "b", label: "Developer" },
                { value: "c", label: "Product Owner" },
                { value: "d", label: "Scrum Master" },
                { value: "e", label: "Tester" },
              ].map((r) => ({ ...r, checked: firstRow.position?.includes(r.value) }));
              firstRow.position?.forEach(
                (p) =>
                  !(p in positionMap) &&
                  r.push({
                    value: p,
                    label: p,
                    checked: true,
                    filter: "freeText",
                  }),
              );
              return r;
            },
            onSave: async (selectedRows, selectedOptions) => {
              // eslint-disable-next-line no-console
              console.log("multiSelect result", { selectedRows, selectedOptions });

              await wait(1000);
              const [subValues, normalValues] = partition(selectedOptions, (o) => o.subComponent);
              const newValue = [...normalValues.map((o) => o.value), ...subValues.map((o) => o.subValue)];
              selectedRows.forEach((row) => (row.position = newValue));
              return true;
            },
          },
        },
      ),
      GridPopoutEditMultiSelect(
        {
          field: "position2",
          initialWidth: 65,
          maxWidth: 150,
          headerName: "Initial editor values ",
          valueGetter: (props) => positionTwoMap[props.data.position2],
        },
        {
          multiEdit: false,
          editorParams: {
            filtered: true,
            filterPlaceholder: "Filter position",
            options: Object.entries(positionTwoMap).map(([k, v]) => ({ value: k, label: v })),
            onSave: async (selectedRows, selectedOptions) => {
              // eslint-disable-next-line no-console
              console.log("multiSelect result", { selectedRows, selectedOptions });
              await wait(1000);
              return true;
            },
          },
        },
      ),
    ];
  }, []);

  const [rowData] = useState([
    { id: 1000, position: ["a", "b"], position2: "1", position3: "Tester" },
    { id: 1001, position: ["c"], position2: "2", position3: "Developer" },
  ] as ITestRow[]);

  return (
    <Grid
      {...props}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={"autoHeight"}
    />
  );
};

export const EditMultiSelect = GridEditMultiSelectTemplate.bind({});
