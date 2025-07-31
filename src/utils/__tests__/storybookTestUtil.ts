import { expect, waitFor } from 'storybook/test';

export const waitForGridReady = ({ canvasElement }: { canvasElement: HTMLElement }) =>
  waitFor(() => expect(canvasElement.querySelector('.Grid-ready')).toBeInTheDocument(), { timeout: 5000 });
