import { CellClickedEvent } from "ag-grid-community";
import { fnOrVar } from "../utils/util";

/**
 * AgGrid checkbox select does not pass clicks within cell but not on the checkbox to checkbox.
 * This passes the event to the checkbox when you click anywhere in the cell.
 */
export const clickInputWhenContainingCellClicked = (params: CellClickedEvent) => {
  const { data, event, colDef } = params;
  if (!data || !event) return;

  if (fnOrVar(colDef.editable, params) === false) {
    return;
  }

  const element = event.target as Element;
  // Already handled
  if (["BUTTON", "INPUT"].includes(element?.tagName) && element.closest(".ag-cell-inline-editing")) return;

  const row = element.closest("[row-id]");
  if (!row) return;

  const colId = colDef.colId;
  if (!colId) return;

  const clickInput = () => {
    const cell = row.querySelector(`[col-id='${colId}']`);
    if (!cell) return;

    const input = cell.querySelector("input, button");
    if (!input) return;

    input?.dispatchEvent(event);
  };

  setTimeout(clickInput, 20);
};
