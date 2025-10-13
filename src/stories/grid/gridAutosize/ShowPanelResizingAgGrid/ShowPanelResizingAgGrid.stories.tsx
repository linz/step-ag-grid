import { PanelsContextProvider } from '@linzjs/windows';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TestShowPanelResizingAgGrid } from './ShowPanelResizingStepAgGrid';

const meta: Meta<typeof TestShowPanelResizingAgGrid> = {
  title: 'Components/Panel',
  component: TestShowPanelResizingAgGrid,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [
    (Story) => (
      <div>
        <PanelsContextProvider baseZIndex={500} panelStateOptions={null}>
          <Story />
        </PanelsContextProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PanelResizing: Story = {
  args: {},
};
