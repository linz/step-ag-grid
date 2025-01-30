import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react';
import { expect } from '@storybook/test';
import { within } from '@storybook/test';

import { GridNoRowsOverlay, GridNoRowsOverlayProps } from '../../components';

export default {
  title: 'Components / Grids / GridNoRowsOverlay',
  component: GridNoRowsOverlay,
  args: {},
} as Meta<typeof GridNoRowsOverlay>;

const GridNoRowsOverlayTemplate: StoryFn<typeof GridNoRowsOverlay> = (params: GridNoRowsOverlayProps) => {
  return <GridNoRowsOverlay {...params} />;
};

export const _GridNoRowsEmpty = GridNoRowsOverlayTemplate.bind({});
_GridNoRowsEmpty.args = {
  rowCount: 0,
  filteredRowCount: 0,
};
_GridNoRowsEmpty.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(await canvas.findByText('There are currently no rows')).toBeInTheDocument();
};

export const _GridNoRowsFiltered = GridNoRowsOverlayTemplate.bind({});
_GridNoRowsFiltered.args = {
  rowCount: 1,
  filteredRowCount: 0,
};
_GridNoRowsFiltered.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(await canvas.findByText('All rows have been filtered')).toBeInTheDocument();
};
