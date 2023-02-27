import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { isEmpty, partition } from "lodash-es";
import { useMemo, useState } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import {
  ColDefT,
  Grid,
  GridCell,
  GridContextProvider,
  GridFormSubComponentTextArea,
  GridPopoutEditMultiSelect,
  GridProps,
  GridUpdatingContextProvider,
  MenuSeparator,
  MultiSelectOption,
  wait,
} from "../..";
import "../../styles/GridTheme.scss";
import "../../styles/index.scss";

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
      lot1: "Lot 1",
      lot2: "Lot 2",
      lot3: "Lot 3",
      lot4: "Lot A 482392",
      appA: "A",
      appB: "B",
      other: "Other",
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
            headers: [{ header: "Header item" }],
            options: [
              { value: "lot1", label: "Lot 1" },
              { value: "lot2", label: "Lot 2" },
              { value: "lot3", label: "Lot 3" },
              { value: "lot11", label: "Lot 11" },
              { value: "lot4", label: "Lot A 482392" },
              { value: "appA", label: "A" },
              { value: "appB", label: "B" },
              MenuSeparator,
              {
                value: "other",
                label: "Other",
                subComponent: () => <GridFormSubComponentTextArea required={true} maxLength={5} defaultValue={""} />,
              },
            ],
            onSave: async ({ selectedRows, selectedOptions }) => {
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
            filterHelpText: (filter, options) =>
              isEmpty(filter) || options.find((o) => o.label && o.label.toLowerCase() === filter.toLowerCase())
                ? undefined
                : "Press enter to add free text",
            onSelectFilter: async ({ filter, options }) => {
              if (isEmpty(filter) || options.find((o) => o.label && o.label.toLowerCase() === filter.toLowerCase()))
                return;
              options.push({ value: filter, label: filter, filter: "freeText", checked: true });
            },
            className: "GridMultiSelect-containerLarge",
            headers: [{ header: "Free text", filter: "freeText" }, { header: "Parcels" }],
            options: (selectedRows) => {
              const firstRow = selectedRows[0];
              const r: MultiSelectOption[] = [
                { value: "lot1", label: "Lot 1" },
                { value: "lot2", label: "Lot 2", warning: "Don't select me" },
                { value: "lot3", label: "Lot 3" },
                { value: "lot11", label: "Lot 11" },
                { value: "lot4", label: "Lot A 482392" },
                { value: "appA", label: "A" },
                { value: "appB", label: "B" },
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
            onSave: async ({ selectedRows, selectedOptions }) => {
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
    ];
  }, []);

  const [rowData] = useState([
    { id: 1000, position: ["lot1", "lot2"], position2: "lot1", position3: "Tester" },
    { id: 1001, position: ["appA"], position2: "lot2", position3: "Developer" },
  ] as ITestRow[]);

  return (
    <Grid
      {...props}
      animateRows={true}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
      domLayout={"autoHeight"}
    />
  );
};

export const EditMultiSelect = GridEditMultiSelectTemplate.bind({});
