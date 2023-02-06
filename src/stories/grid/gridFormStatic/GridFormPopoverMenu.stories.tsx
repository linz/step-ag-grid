import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { useRef } from "react";
import {
  GridFormPopoverMenu,
  GridFormPopoverMenuProps,
  PopoutMenuSeparator,
} from "../../../components/gridForm/GridFormPopoverMenu";
import { GridContextProvider } from "../../../contexts/GridContextProvider";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { GridBaseRow } from "../../../components/Grid";

export default {
  title: "GridForm / Static Tests",
  component: GridFormPopoverMenu,
  args: {},
} as ComponentMeta<typeof GridFormPopoverMenu>;

const Template: ComponentStory<typeof GridFormPopoverMenu> = (props) => {
  const configs: [string, GridFormPopoverMenuProps<GridBaseRow>][] = [
    ["No options", { options: async () => [] }],
    [
      "Enabled/disabled/hidden and divider",
      {
        options: async () => [
          { label: "Enabled", value: 1 },
          PopoutMenuSeparator,
          { label: "Disabled", value: 0, disabled: true },
          { label: "ERROR! this should be hidden", value: 3, hidden: true },
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
          <>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider value={{ anchorRef: anchorRefs[index] } as any as GridPopoverContextType<any>}>
              <GridFormPopoverMenu {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>
        ))}
      </GridContextProvider>
    </div>
  );
};

export const GridFormPopoverMenu_ = Template.bind({});
