import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridFormTextArea, GridFormTextAreaProps } from "../../../components/gridForm/GridFormTextArea";
import { GridContextProvider } from "../../../contexts/GridContextProvider";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";
import { GridBaseRow } from "../../../components/Grid";

export default {
  title: "GridForm / Static Tests",
  component: GridFormTextArea,
  args: {},
} as ComponentMeta<typeof GridFormTextArea>;

const Template: ComponentStory<typeof GridFormTextArea> = (props) => {
  const configs: [string, GridFormTextAreaProps<GridBaseRow>, string?][] = [
    ["Text area", {}],
    ["Text area with text", {}, "Some text"],
    ["Text area with error & placeholder", { required: true, placeholder: "Custom placeholder" }],
  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));

  return (
    <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        {configs.map((config, index) => (
          <>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider
              value={{ anchorRef: anchorRefs[index], value: config[2] } as any as GridPopoverContextType<any>}
            >
              <GridFormTextArea {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>
        ))}
      </GridContextProvider>
    </div>
  );
};

export const GridFormTextArea_ = Template.bind({});
