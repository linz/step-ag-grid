import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import {
  GridContextProvider,
  GridFormEditBearing,
  GridFormEditBearingProps,
  GridPopoverEditBearingEditorParams,
} from "../../..";

export default {
  title: "GridForm / Static Tests",
  component: GridFormEditBearing,
  args: {},
} as ComponentMeta<typeof GridFormEditBearing>;

const Template: ComponentStory<typeof GridFormEditBearing> = (props) => {
  const values: [string, GridFormEditBearingProps<any>, number | null][] = [
    ["Null value", {}, null],
    ["Custom placeholder", { placeHolder: "Custom placeholder" }, null],
    ["Valid value", {}, 90],
    ["With error", {}, 1.234567],
  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = values.map(() => useRef<HTMLHeadingElement>(null));

  return (
    <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        {values.map((value, index) => (
          <>
            <h6 ref={anchorRefs[index]}>{value[0]}</h6>
            <GridPopoverContext.Provider
              value={
                {
                  anchorRef: anchorRefs[index],
                  value: value[2],
                } as any as GridPopoverContextType<any>
              }
            >
              <GridFormEditBearing {...props} {...GridPopoverEditBearingEditorParams} {...value[1]} />
            </GridPopoverContext.Provider>
          </>
        ))}
      </GridContextProvider>
    </div>
  );
};

export const GridFormEditBearing_ = Template.bind({});
