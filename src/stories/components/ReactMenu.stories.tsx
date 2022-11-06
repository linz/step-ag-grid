import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { Grid } from "../../components/Grid";
import { Menu, MenuItem, MenuButton, MenuDivider, SubMenu } from "../../react-menu3";

export default {
  title: "Components / React-menu",
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
        <MenuDivider />
        <MenuItem>Exit</MenuItem>
      </Menu>
    </>
  );
};

export const ReactMenuControlled = ReactMenuTemplate.bind({});
