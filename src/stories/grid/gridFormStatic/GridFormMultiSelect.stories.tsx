import "../../../react-menu3/styles/index.scss";
import "../../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";

import { GridBaseRow, GridContextProvider, GridFormMultiSelect, GridFormMultiSelectProps } from "../../..";

export default {
  title: "GridForm / Static Tests",
  component: GridFormMultiSelect,
  args: {},
} as ComponentMeta<typeof GridFormMultiSelect>;

const Template: ComponentStory<typeof GridFormMultiSelect> = (props) => {
  const configs: [string, GridFormMultiSelectProps<GridBaseRow>, string?][] = [
    ["No options", { options: [] }],
    ["Custom no options", { options: [], noOptionsMessage: "Custom no options" }],
    [
      "With options",
      {
        options: [
          { label: "One", value: 0, checked: true },
          { label: "Two", value: 1 },
        ],
      },
    ],
    [
      "With filter",
      {
        filtered: true,
        options: [
          { label: "One", value: 0 },
          { label: "With warning", value: 1, warning: "Test warning" },
          { label: "Three", value: 2, checked: true },
        ],
      },
    ],
  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));

  return (
    <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        {configs.map((config, index) => (
          <div key={`${index}`}>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider
              value={
                {
                  anchorRef: anchorRefs[index],
                  data: { value: config[2] },
                  value: config[2],
                  field: "value",
                } as any as GridPopoverContextType<any>
              }
            >
              <GridFormMultiSelect {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </div>
        ))}
      </GridContextProvider>
    </div>
  );
};

export const GridFormMultiSelect_ = Template.bind({});
