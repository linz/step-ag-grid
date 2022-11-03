import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridUpdatingContextProvider } from "@contexts/GridUpdatingContextProvider";
import { GridContextProvider } from "@contexts/GridContextProvider";
import { Grid, GridProps } from "@components/Grid";
import { useMemo, useState } from "react";
import { MenuSeparator } from "@components/gridForm/GridFormDropDown";
import { wait } from "@utils/util";
import { MultiSelectResult } from "@components/gridForm/GridFormMultiSelect";
import { GridSubComponentTextArea } from "@components/GridSubComponentTextArea";
import { ColDefT, GridCell } from "@components/GridCell";
import { GridPopoutEditMultiSelect } from "@components/gridPopoverEdit/GridPopoutEditMultiSelect";

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
  position: string | null;
  position2: string | null;
  position3: string | null;
}

const GridEditMultiSelectTemplate: ComponentStory<typeof Grid> = (props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);

  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => {
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
          maxWidth: 150,
          headerName: "Position",
        },
        {
          editorParams: {
            multiEdit: false,
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
              // eslint-disable-next-line no-console
              console.log(result);
              await wait(1000);
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
          headerName: "Inital editor values ",
          valueGetter: (props) => positionTwoMap[props.data.position2],
        },
        {
          editorParams: {
            multiEdit: false,
            filtered: true,
            filterPlaceholder: "Filter position",
            initialSelectedValues: (selectedRows) => [selectedRows[0].position2],
            options: Object.entries(positionTwoMap).map(([k, v]) => ({ value: k, label: v })),
            onSave: async (result: MultiSelectResult<ITestRow>) => {
              // eslint-disable-next-line no-console
              console.log(result);
              await wait(1000);
              return true;
            },
          },
        },
      ),
    ];
  }, []);

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
      selectable={true}
      externalSelectedItems={externalSelectedItems}
      setExternalSelectedItems={setExternalSelectedItems}
      columnDefs={columnDefs}
      rowData={rowData}
    />
  );
};

export const EditMultiSelect = GridEditMultiSelectTemplate.bind({});
