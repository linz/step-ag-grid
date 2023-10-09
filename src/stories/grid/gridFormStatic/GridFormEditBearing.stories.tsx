import "../../../react-menu3/styles/index.scss";
import "../../../styles/index.scss";
import "@linzjs/lui/dist/scss/base.scss";

import { Meta, StoryFn } from "@storybook/react";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";

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
} as Meta<typeof GridFormEditBearing>;

const Template: StoryFn<typeof GridFormEditBearing> = (props: GridFormEditBearingProps<any>) => {
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
