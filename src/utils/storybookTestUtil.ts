import { expect } from "@storybook/jest";
import { waitFor } from "@storybook/testing-library";

export const waitForGridReady = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await waitFor(() => expect(canvasElement.querySelector(".Grid-ready")).toBeInTheDocument(), { timeout: 5000 });
};
