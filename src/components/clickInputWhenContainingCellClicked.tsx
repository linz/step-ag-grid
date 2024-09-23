import { CellClickedEvent } from "ag-grid-community";

/**
 * AgGrid checkbox select does not pass clicks within cell but not on the checkbox to checkbox.
 * This passes the event to the checkbox when you click anywhere in the cell.
 */
export const clickInputWhenContainingCellClicked = ({ data, event, colDef }: CellClickedEvent) => {
  if (!data || !event) return;

  const element = event.target as Element;
  // Already handled
  if (["BUTTON", "INPUT"].includes(element?.tagName) && element.closest(".ag-cell-inline-editing")) return;

  const row = element.closest("[row-id]");
  if (!row) return;

  const colId = colDef.colId;
  if (!colId) return;

  const clickInput = (cnt: number) => {
    const cell = row.querySelector(`[col-id='${colId}']`);
    if (!cell) return;

    const input = cell.querySelector("input, button");
    if (!input) {
      return;
    }
    // When clicking on a cell that is not editing, the cell changes to editing and the input/button ref becomes invalid
    // So wait until the cell is in edit mode before sending the click
    if (!input.ownerDocument.contains(input)) {
      if (cnt !== 0) {
        setTimeout(() => clickInput(cnt - 1));
      }
      return;
    }
    input?.dispatchEvent(event);
  };

  setTimeout(() => clickInput(20), 10);
};
