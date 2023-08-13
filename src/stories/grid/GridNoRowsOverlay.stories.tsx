import "@linzjs/lui/dist/scss/base.scss";

import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { within } from "@storybook/testing-library";

import "@linzjs/lui/dist/fonts";

import { GridNoRowsOverlay } from "../../components";

export default {
  title: "Components / Grids / GridNoRowsOverlay",
  component: GridNoRowsOverlay,
  args: {},
} as ComponentMeta<typeof GridNoRowsOverlay>;

const GridNoRowsOverlayTemplate: ComponentStory<typeof GridNoRowsOverlay> = (params) => {
  return <GridNoRowsOverlay {...params} />;
};

export const GridNoRowsEmpty = GridNoRowsOverlayTemplate.bind({});
GridNoRowsEmpty.args = {
  rowCount: 0,
  filteredRowCount: 0,
};
GridNoRowsEmpty.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(await canvas.findByText("There are currently no rows")).toBeInTheDocument();
};

export const GridNoRowsFiltered = GridNoRowsOverlayTemplate.bind({});
GridNoRowsFiltered.args = {
  rowCount: 1,
  filteredRowCount: 0,
};
GridNoRowsFiltered.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(await canvas.findByText("All rows have been filtered")).toBeInTheDocument();
};
