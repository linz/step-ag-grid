import { act, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { findQuick, getAllQuick, getMatcher, getQuick, IQueryQuick, queryQuick } from "./testQuick";
import { isEqual } from "lodash-es";

export const countRows = async (within?: HTMLElement): Promise<number> => {
  return getAllQuick({ tagName: `div[row-id]:not(:empty)` }, within).length;
};

export const findRow = async (rowId: number | string, within?: HTMLElement): Promise<HTMLDivElement> => {
  //if this is not wrapped in an act console errors are logged during testing
  let row!: HTMLDivElement;
  await act(async () => {
    row = await findQuick<HTMLDivElement>({ tagName: `div[row-id='${rowId}']:not(:empty)` }, within);
  });
  return row;
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
  //if this is not wrapped in an act console errors are logged during testing
  let cell!: HTMLElement;
  await act(async () => {
    const row = await findRow(rowId, within);
    cell = await findQuick({ tagName: `[col-id='${colId}']` }, row);
  });
  return cell;
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
  await act(async () => {
    const cell = await findCell(rowId, colId, within);
    userEvent.dblClick(cell);
  });
  await waitFor(findOpenPopover);
};

export const isCellReadOnly = async (rowId: number | string, colId: string, within?: HTMLElement): Promise<boolean> => {
  const cell = await findCell(rowId, colId, within);
  return cell.className.includes("GridCell-readonly");
};

export const findOpenPopover = async (): Promise<HTMLElement> => findQuick({ classes: ".szh-menu--state-open" });

export const queryMenuOption = async (menuOptionText: string | RegExp): Promise<HTMLElement | null> => {
  const openMenu = await findOpenPopover();
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

export const validateMenuOptions = async (
  rowId: number | string,
  colId: string,
  expectedMenuOptions: Array<string>,
): Promise<boolean> => {
  await editCell(rowId, colId);
  const openMenu = await findOpenPopover();
  const actualOptions = (await within(openMenu).findAllByRole("menuitem")).map((menuItem) => menuItem.textContent);
  return isEqual(actualOptions, expectedMenuOptions);
};

export const clickMenuOption = async (menuOptionText: string | RegExp): Promise<void> => {
  await act(async () => {
    const menuOption = await findMenuOption(menuOptionText);
    // eslint-disable-next-line testing-library/await-async-utils
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

export const openAndFindMenuOption = async (
  rowId: number | string,
  colId: string,
  menuOptionText: string | RegExp,
  within?: HTMLElement,
): Promise<HTMLElement> => {
  await editCell(rowId, colId, within);
  return await findMenuOption(menuOptionText);
};

export const getMultiSelectOptions = async () => {
  const openMenu = await findOpenPopover();
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
  const openMenu = await findOpenPopover();
  return getQuick({ role: "menuitem", child: { tagName: `input[value='${value}']` } }, openMenu);
};

export const clickMultiSelectOption = async (value: string): Promise<void> => {
  const menuItem = await findMultiSelectOption(value);
  menuItem.parentElement && userEvent.click(menuItem.parentElement);
};

const typeInput = async (value: string, filter: IQueryQuick): Promise<void> =>
  act(async () => {
    const openMenu = await findOpenPopover();
    const input = await findQuick(filter, openMenu);
    userEvent.clear(input);
    //'typing' an empty string will cause a console error and it's also unnecessary after the previous clear call
    if (value.length > 0) {
      userEvent.type(input, value);
    }
  });

export const typeOnlyInput = async (value: string): Promise<void> =>
  typeInput(value, { child: { tagName: "input[type='text'], textarea" } });

export const typeInputByLabel = async (value: string, labelText: string): Promise<void> => {
  const labels = getAllQuick({ child: { tagName: "label" } }).filter((l) => l.textContent == labelText);
  if (labels.length == 0) {
    throw Error(`Label not found for text: ${labelText}`);
  }
  if (labels.length > 1) {
    throw Error(`Multiple labels found for text: ${labelText}`);
  }
  const inputId = labels[0].getAttribute("for");
  await typeInput(value, { child: { tagName: `input[id='${inputId}'], textarea[id='${inputId}']` } });
};

export const typeInputByPlaceholder = async (value: string, placeholder: string): Promise<void> =>
  typeInput(value, {
    child: { tagName: `input[placeholder='${placeholder}'], textarea[placeholder='${placeholder}']` },
  });

export const typeOtherInput = async (value: string): Promise<void> =>
  typeInput(value, { classes: ".subComponent", child: { tagName: "input[type='text']" } });

export const typeOtherTextArea = async (value: string): Promise<void> =>
  typeInput(value, { classes: ".subComponent", child: { tagName: "textarea" } });

export const closeMenu = (): void => userEvent.click(document.body);
export const closePopover = (): void => userEvent.click(document.body);

export const findActionButton = (text: string, container?: HTMLElement): Promise<HTMLElement> =>
  findQuick({ tagName: "button", child: { classes: ".ActionButton-minimalAreaDisplay", text: text } }, container);

export const clickActionButton = async (text: string, container?: HTMLElement): Promise<void> => {
  await act(async () => {
    const button = await findActionButton(text, container);
    userEvent.click(button);
  });
};
