import { expect, jest } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { userEvent, within } from "@storybook/testing-library";

import { Grid } from "../../components/Grid";
import { Menu, MenuButton, MenuDivider, MenuItem, SubMenu } from "../../react-menu3";
import { wait } from "../../utils/util";

export default {
  title: "Components / React-menu",
  component: Grid,
  args: {
    externalSelectedItems: [],
    setExternalSelectedItems: () => {},
  },
} as ComponentMeta<typeof Grid>;

const menuItemClickAction = jest.fn();
const newFileAction = jest.fn();

const ReactMenuTemplate: ComponentStory<typeof Grid> = () => {
  return (
    <>
      <Menu menuButton={<MenuButton>Open menu</MenuButton>} onItemClick={menuItemClickAction}>
        <MenuItem onClick={newFileAction}>New File</MenuItem>
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
ReactMenuControlled.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const keyboard = async (key: string) => {
    userEvent.keyboard(key);
    await wait(100); // Wait for debounce
  };

  const menuButton = await canvas.findByRole("button");
  expect(menuButton).toBeInTheDocument();

  const openMenu = async () => {
    await wait(500); // Wait for debounce
    userEvent.click(menuButton);
    expect(await canvas.findByRole("menuitem", { name: "New File" })).toBeInTheDocument();
  };

  // Check menu closes on click outside
  await openMenu();
  userEvent.click(menuButton.parentElement as Element);
  expect(canvas.queryByRole("menuitem", { name: "New File" })).not.toBeInTheDocument();

  // Test arrow down/up
  await openMenu();
  await keyboard("{arrowdown}");
  await keyboard("{arrowdown}");
  await keyboard("{arrowdown}");
  await keyboard("{arrowdown}");
  await keyboard("{arrowdown}");
  expect(document.activeElement?.innerHTML).toBe("Exit");

  await keyboard("{arrowup}");
  expect(document.activeElement?.innerHTML).toBe("Print...");

  // Escape close
  userEvent.type(menuButton.parentElement as Element, "{Escape}");
  expect(canvas.queryByRole("menuitem", { name: "New File" })).not.toBeInTheDocument();

  // Test enter to select
  await openMenu();
  await keyboard("{arrowdown}");
  await keyboard("{enter}");
  expect(menuItemClickAction).toHaveBeenCalled();
  expect(newFileAction).toHaveBeenCalled();

  menuItemClickAction.mockClear();
  newFileAction.mockClear();

  // Test tab to select
  await openMenu();
  await keyboard("{arrowdown}");
  // For some reason arrow down takes a little time to activate
  await wait(10);
  await keyboard("{Tab}");
  expect(menuItemClickAction).toHaveBeenCalled();
  expect(newFileAction).toHaveBeenCalled();

  newFileAction.mockClear();
};
