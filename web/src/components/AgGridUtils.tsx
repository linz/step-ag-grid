import { ReactNode } from "react";

import "./AgGridStyles.scss";
import {
  AgGridEvent,
  CellClickedEvent,
  CellContextMenuEvent,
  CellEvent,
  ColDef,
  GetRowIdParams,
  SuppressKeyboardEventParams,
} from "ag-grid-community";
import { LuiMiniSpinner } from "@linzjs/lui";
import { ValueGetterParams } from "ag-grid-community/dist/lib/entities/colDef";
import {
  GenericCellRenderer,
  GenericCellRendererParams,
} from "./GenericCellRenderer";
import {
  GenericCellEditor,
  GenericCellEditorParams,
} from "./GenericCellEditor";

// TODO: Consider building this ubiquitous functionality into GenericCellRenderer or some other way
export const LoadableCell = (isLoading: boolean, display: ReactNode, dataTestId?: string): JSX.Element => {
  // console.log(`Rendering LoadableCell - loading: ${isLoading}`);
  if (isLoading) {
    return <LuiMiniSpinner size={22} divProps={{ role: "status", ["aria-label"]: "Loading" }} />;
  }
  // only add test id into ONE of the columns in a grid. this way each row will have one unique id :)
  return <span data-testid={dataTestId}>{display}</span>;
};

/** Set the node referenced in the event to selected, which causes all other nodes to become deselected */
const deselectOtherNodes = (event: CellEvent) => {
  event.node.setSelected(true, true);
};

interface TypedValueGetterParams<T> extends ValueGetterParams {
  data: T;
}
interface EditableColumnProps<T> extends ColDef {
  /** Function to render the cell value, given a row datum */
  renderer: (row: T) => JSX.Element;
  /** Function to render the editor popup, which is also responsible for actually performing any edits */
  editor: (row: T, selectedRows: T[], stopEditing: () => void) => JSX.Element;
  /** Deselect all other rows when this column is edited. Default: false */
  preventMultipleEdit?: boolean;
  /** Function to produce the value used for filtering, sorting and possibly display */
  valueGetter?: (params: TypedValueGetterParams<T>) => string | undefined;
}

/**
 * Generate a ColDef for an editable column with a little less boilerplate than the manual approach
 */
export const editableColumn = <T extends any>(props: EditableColumnProps<T>): ColDef => {
  const { renderer, editor, preventMultipleEdit, ...remainingProps } = props;
  const onContextMenu = preventMultipleEdit === true ? deselectOtherNodes : undefined;

  return {
    cellRenderer: GenericCellRenderer,
    cellRendererParams: {
      getDisplay: renderer,
    } as GenericCellRendererParams<T>,
    cellEditor: GenericCellEditor,
    cellEditorParams: {
      getDisplay: editor,
    } as GenericCellEditorParams<T>,
    onCellContextMenu: onContextMenu,
    ...remainingProps,
  };
};

const refreshSelectedRows = (event: CellEvent): void => {
  // Force-refresh all selected rows to re-run class function, to update selection highlighting
  event.api.refreshCells({
    force: true,
    rowNodes: event.api.getSelectedNodes(),
  });
};

const sizeColumnsToFit = (event: AgGridEvent) => {
  // @ts-ignore (gridBodyCtrl is private)
  if (event.api.gridBodyCtrl == undefined) {
    return;
    // this is here because ag grid was throwing api undefined error when closing POPPED OUT panel
  }
  event.api?.sizeColumnsToFit();
};

const onCellContextMenu = (event: CellContextMenuEvent) => {
  if (!event.node.isSelected()) {
    event.api.deselectAll();
    event.node.setSelected(true); // because right-click does not select the row by default
  }
  if (event.rowIndex !== null) {
    event.api.startEditingCell({
      rowIndex: event.rowIndex,
      colKey: event.column.getColId(),
    });
  }
};

const onCellClicked = (event: CellClickedEvent) => {
  // @ts-ignore (rowRenderer is private)
  const cellCtrl = event.api.rowRenderer.getCellCtrls([event.node], [event.column])[0];
  const rowCtrl = cellCtrl?.getRowCtrl();

  // If AG-Grid's normal row click event occurs when a button in the actions column is clicked, the selection state
  // will be undesirably changed as if the user had clicked on the row. Our way of preventing this involves setting
  // suppressRowClickSelection to true on the grid so as to prevent the normal row click event from happening, and
  // in this onCellClicked event, fire the onRowClick event if the column clicked was not "actions". It's a hack.
  if (event.column.getColId() !== "actions") {
    if (event.api.getSelectedNodes().length === 1 && event.node.isSelected()) {
      event.node.setSelected(false);
    } else {
      // @ts-ignore (gridOptionsWrapper is private)
      event.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = false;
      rowCtrl.onRowClick(event.event as MouseEvent);
      // @ts-ignore (gridOptionsWrapper is private)
      event.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = true;
    }
  }
};

const onCellDoubleClicked = (event: CellClickedEvent) => {
  event.node.setSelected(true);
};

export const suppressKeyboardEvent = (params: SuppressKeyboardEventParams): boolean => {
  // We want to allow Enter for newline in multi-line editors; also, the grid itself doesn't know to to make edits
  // so Enter doesn't make an edit really happen anyway.
  if (params.editing && params.event.key === "Enter") return true;
  // Delete should not trigger editing mode
  return params.event.key === "Delete";
};

const DefaultNoRowsOverlay = () => <span className="ag-overlay-no-rows-center">There are currently no rows</span>;
const DefaultNoColumnsOverlay = () => <span className="ag-overlay-no-rows-center">There are currently no column</span>;

export const LOADING_PLACEHOLDER_ID = 100000;

/** Return AG-Grid props that are common or likely common to all tables */
export const defaultAgGridProps = (): {
  getRowId: (params: GetRowIdParams) => string;
  rowSelection: string;
  suppressRowClickSelection: boolean;
  onFirstDataRendered: (event: AgGridEvent) => void;
  suppressContextMenu: boolean;
  suppressBrowserResizeObserver: boolean;
  noRowsOverlayComponent: () => JSX.Element;
  onCellEditingStarted: (event: CellEvent) => void;
  onCellContextMenu: (event: CellContextMenuEvent) => void;
  noColumnsOverlayComponent: () => JSX.Element;
  onGridSizeChanged: (event: AgGridEvent) => void;
  onCellDoubleClicked: (event: CellClickedEvent) => void;
  onCellClicked: (event: CellClickedEvent) => void;
  onCellEditingStopped: (event: CellEvent) => void;
  rowHeight: number;
  colResizeDefault: string;
} => ({
  getRowId: (params) => `${params.data.id}`,
  rowHeight: 41,
  onFirstDataRendered: sizeColumnsToFit,
  onGridSizeChanged: sizeColumnsToFit,
  rowSelection: "multiple",
  onCellEditingStarted: refreshSelectedRows,
  onCellEditingStopped: refreshSelectedRows,
  onCellContextMenu,
  suppressContextMenu: true,
  suppressBrowserResizeObserver: true,
  // Workaround to prevent the default row selection/deselection occurring on the actions column
  onCellClicked,
  onCellDoubleClicked,
  suppressRowClickSelection: true,
  noRowsOverlayComponent: DefaultNoRowsOverlay,
  noColumnsOverlayComponent: DefaultNoColumnsOverlay,
  colResizeDefault: "shift",
});
