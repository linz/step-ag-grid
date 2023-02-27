import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

import "@linzjs/lui/dist/fonts";
import "@linzjs/lui/dist/scss/base.scss";

import { GridBaseRow, GridContextProvider, GridFormTextInput, GridFormTextInputProps } from "../../..";

export default {
  title: "GridForm / Static Tests",
  component: GridFormTextInput,
  args: {},
} as ComponentMeta<typeof GridFormTextInput>;

const Template: ComponentStory<typeof GridFormTextInput> = (props) => {
  const configs: [string, GridFormTextInputProps<GridBaseRow>, string?][] = [
    ["Text input", {}],
    ["Text input with text", {}, "Some text"],
    ["Text input with error & placeholder", { required: true, placeholder: "Custom placeholder" }],
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
              <GridFormTextInput {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>
        ))}
      </GridContextProvider>
    </div>
  );
};

export const GridFormTextInput_ = Template.bind({});
