import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
// Force react-menu not to render static inline not absolute
import "./reactMenuTest.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { GridFormDropDown, MenuHeaderItem } from "../../../components/gridForm/GridFormDropDown";
import { GridContextProvider } from "../../../contexts/GridContextProvider";
import { GridPopoverContext, GridPopoverContextType } from "contexts/GridPopoverContext";
import { useRef } from "react";

export default {
  title: "GridForm / Samples",
  component: GridFormDropDown,
  args: {},
} as ComponentMeta<typeof GridFormDropDown>;

const Template: ComponentStory<typeof GridFormDropDown> = (props) => {
  const anchorRef1 = useRef<HTMLHeadingElement>(null);
  const anchorRef2 = useRef<HTMLHeadingElement>(null);
  const anchorRef3 = useRef<HTMLHeadingElement>(null);

  return (
    <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        <h6 ref={anchorRef1}>No options</h6>
        <GridPopoverContext.Provider value={{ anchorRef: anchorRef1 } as any as GridPopoverContextType<any>}>
          <GridFormDropDown {...props} options={[]} />
        </GridPopoverContext.Provider>

        <h6 ref={anchorRef2}>Enabled and disabled</h6>
        <GridPopoverContext.Provider value={{ anchorRef: anchorRef2 } as any as GridPopoverContextType<any>}>
          <GridFormDropDown
            {...props}
            options={[
              { label: "Enabled", value: 1 },
              { label: "Disabled", value: 0, disabled: true },
            ]}
          />
        </GridPopoverContext.Provider>

        <h6 ref={anchorRef3}>Headers</h6>
        <GridPopoverContext.Provider value={{ anchorRef: anchorRef3 } as any as GridPopoverContextType<any>}>
          <GridFormDropDown
            {...props}
            options={[
              MenuHeaderItem("Header 1"),
              { label: "Option 1", value: 1 },
              MenuHeaderItem("Header 2"),
              { label: "Option 2", value: 2 },
            ]}
          />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>
  );
};

export const GridFormDropDown_ = Template.bind({});
GridFormDropDown_.args = { options: [] };
