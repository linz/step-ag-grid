import { act, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { findQuick, getAllQuick, getMatcher, getQuick, queryQuick } from "./testQuick";
import { wait } from "./util";

export const countRows = async (within?: HTMLElement): Promise<number> => {
  return getAllQuick({ tagName: `div[row-id]:not(:empty)` }, within).length;
};

export const findRow = async (rowId: number | string, within?: HTMLElement): Promise<HTMLDivElement> => {
  return findQuick<HTMLDivElement>({ tagName: `div[row-id='${rowId}']:not(:empty)` }, within);
};

export const queryRow = async (rowId: number | string, within?: HTMLElement): Promise<HTMLDivElement | null> => {
  return queryQuick<HTMLDivElement>({ tagName: `div[row-id='${rowId}']:not(:empty)` }, within);
};

const _selectRow = async (
  select: "select" | "deselect" | "toggle",
  rowId: string | number,
  within?: HTMLElement,
): Promise<void> => {
  await act(async () => {
    const row = await findRow(rowId, within);
    const isSelected = row.className.includes("ag-row-selected");
    if (select === "toggle" || (select === "select" && !isSelected) || (select === "deselect" && isSelected)) {
      const cell = await findCell(rowId, "selection", within);
      userEvent.click(cell);
      await waitFor(async () => {
        const row = await findRow(rowId, within);
        const nowSelected = row.className.includes("ag-row-selected");
        if (nowSelected == isSelected) throw `Row ${rowId} won't select`;
      });
    }
  });
};

export const selectRow = async (rowId: string | number, within?: HTMLElement): Promise<void> =>
  _selectRow("select", rowId, within);

export const deselectRow = async (rowId: string | number, within?: HTMLElement): Promise<void> =>
  _selectRow("deselect", rowId, within);

export const findCell = async (rowId: number | string, colId: string, within?: HTMLElement): Promise<HTMLElement> => {
  const row = await findRow(rowId, within);
  return await findQuick({ tagName: `[col-id='${colId}']` }, row);
};

export const findCellContains = async (
  rowId: number | string,
  colId: string,
  text: string | RegExp,
  within?: HTMLElement,
) => {
  return await waitFor(
    async () => {
      const row = await findRow(rowId, within);
      return await findQuick({ tagName: `[col-id='${colId}']`, text }, row);
    },
    { timeout: 10000 },
  );
};

export const selectCell = async (rowId: string | number, colId: string, within?: HTMLElement): Promise<void> => {
  await act(async () => {
    const cell = await findCell(rowId, colId, within);
    userEvent.click(cell);
  });
};

export const editCell = async (rowId: number | string, colId: string, within?: HTMLElement): Promise<void> => {
  await selectRow(rowId, within);
  await act(async () => {
    const cell = await findCell(rowId, colId, within);
    userEvent.dblClick(cell);
  });
  await waitFor(findOpenMenu);
};

const findOpenMenu = async (): Promise<HTMLElement> => findQuick({ classes: ".szh-menu--state-open" });

export const queryMenuOption = async (menuOptionText: string | RegExp): Promise<HTMLElement | null> => {
  const openMenu = await findOpenMenu();
  const els = await within(openMenu).findAllByRole("menuitem");
  const matcher = getMatcher(menuOptionText);
  const result = els.find(matcher);
  return result ?? null;
};

export const findMenuOption = async (menuOptionText: string | RegExp): Promise<HTMLElement> => {
  return await waitFor(
    async () => {
      const menuOption = await queryMenuOption(menuOptionText);
      if (menuOption == null) {
        throw Error(`Unable to find menu option ${menuOptionText}`);
      }
      return menuOption;
    },
    { timeout: 5000 },
  );
};

export const clickMenuOption = async (menuOptionText: string | RegExp): Promise<void> => {
  const menuOption = await findMenuOption(menuOptionText);
  await act(async () => {
    userEvent.click(menuOption);
  });
};

export const openAndClickMenuOption = async (
  rowId: number | string,
  colId: string,
  menuOptionText: string | RegExp,
  within?: HTMLElement,
): Promise<void> => {
  await editCell(rowId, colId, within);
  await clickMenuOption(menuOptionText);
};

export const getMultiSelectOptions = async () => {
  const openMenu = await findOpenMenu();
  return getAllQuick<HTMLInputElement>({ role: "menuitem", child: { tagName: "input,textarea" } }, openMenu).map(
    (input) => {
      return {
        v: input.value,
        c: input.checked ?? true,
      };
    },
  );
};

export const findMultiSelectOption = async (value: string): Promise<HTMLElement> => {
  const openMenu = await findOpenMenu();
  return getQuick({ role: "menuitem", child: { tagName: `input[value='${value}']` } }, openMenu);
};

export const clickMultiSelectOption = async (value: string): Promise<void> => {
  const menuItem = await findMultiSelectOption(value);
  menuItem.parentElement && userEvent.click(menuItem.parentElement);
};

export const typeOtherInput = async (value: string): Promise<void> => {
  const openMenu = await findOpenMenu();
  const otherInput = await findQuick({ classes: ".subComponent", child: { tagName: "input[type='text']" } }, openMenu);
  userEvent.clear(otherInput);
  userEvent.type(otherInput, value);
};

export const typeOtherTextArea = async (value: string): Promise<void> => {
  const openMenu = await findOpenMenu();
  const otherTextArea = await findQuick({ classes: ".subComponent", child: { tagName: "textarea" } }, openMenu);
  userEvent.clear(otherTextArea);
  userEvent.type(otherTextArea, value);
};

export const closeMenu = (): void => {
  userEvent.click(document.body);
};

export const findActionButton = (text: string, container: HTMLElement): Promise<HTMLElement> =>
  findQuick({ tagName: "button", child: { classes: ".ActionButton-minimalAreaDisplay", text: text } }, container);

export const clickActionButton = async (text: string, container: HTMLElement): Promise<void> => {
  await act(async () => {
    const button = await findActionButton(text, container);
    userEvent.click(button);
  });
};
