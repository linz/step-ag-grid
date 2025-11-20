import { sortBy } from 'lodash-es';
import { expect, userEvent, waitFor } from 'storybook/test';

import { findQuick, getAllQuick } from './testQuick';

export const waitForGridReady = ({ canvasElement }: { canvasElement: HTMLElement }) =>
  waitFor(() => expect(canvasElement.querySelector('.Grid-ready')).toBeInTheDocument(), { timeout: 5000 });

export const waitForGridRows = async (props?: { grid?: HTMLElement; timeout?: number }) =>
  waitFor(() => expect(getAllQuick({ classes: '.ag-row' }, props?.grid).length > 0).toBe(true), {
    timeout: props?.timeout ?? 4000,
  });

export const clickColumnHeaderToSort = async (colId: string, within: HTMLElement): Promise<void> => {
  const user = userEvent.setup({
    delay: 100,
  });
  const header = await findQuick({ selector: `.ag-header-cell[col-id="${colId}"]` }, within);
  await expect(header).toBeInTheDocument();
  // For some reason clicks in storybook don't trigger ag-grid, but manual clicks do
  await user.click(header);
  await user.keyboard('{Enter}');
};

export const gridColumnValues = (colId: string, within: HTMLElement): string[] => {
  return sortBy(
    getAllQuick({ tagName: `[col-id="${colId}"]`, classes: `.ag-cell` }, within),
    // @ts-expect-error css style type
    (el) => el.parentElement?.attributeStyleMap.get('transform')?.[0]?.y.value,
  ).map((cell) => cell.innerText);
};
