import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";
import "../../lui-overrides.scss";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { UpdatingContextProvider } from "@contexts/UpdatingContextProvider";
import { GridContextProvider } from "@contexts/GridContextProvider";
import { Grid, GridProps } from "@components/Grid";
import { useMemo, useState } from "react";
import { wait } from "@utils/util";
import { ICellRendererParams } from "ag-grid-community";
import { GridPopoverMenu } from "@components/gridPopoverEdit/GridPopoverMenu";
import { GridPopoverMessage } from "@components/gridPopoverEdit/GridPopoverMessage";
import { GridCell } from "@components/GridCell";
import { Menu, MenuItem, MenuButton, SubMenu } from "@react-menu3";

export default {
  title: "Components / Grids",
  component: Grid,
  args: {
    externalSelectedItems: [],
    setExternalSelectedItems: () => {},
  },
} as ComponentMeta<typeof Grid>;

const ReactMenuTemplate: ComponentStory<typeof Grid> = () => {
  return (
    <>
      <Menu menuButton={<MenuButton>Open menu</MenuButton>}>
        <MenuItem>New File</MenuItem>
        <MenuItem>Save</MenuItem>
        <SubMenu label="Edit">
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </SubMenu>
        <MenuItem>Print...</MenuItem>
      </Menu>
    </>
  );
};

export const ReactMenu = ReactMenuTemplate.bind({});
