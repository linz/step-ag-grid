import { CellFocusedEvent, ICellEditorParams } from "ag-grid-community";
import { ColDefT, GridCell, SAICellRendererParams } from "../GridCell";
import { GenericCellColDef } from "../gridRender";
import { GridBaseRow } from "../Grid";
import { LuiButton, LuiIcon } from "@linzjs/lui";
import { useEffect, useRef } from "react";

const ButtonCellRenderer = (props: SAICellRendererParams) => {
  const { data, node, column, colDef, api } = props;
  const inputRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkFocus = (event: CellFocusedEvent) => {
      if (event.rowIndex === node.rowIndex && event.column === column) {
        inputRef.current?.focus();
      }
    };
    api.addEventListener("cellFocused", checkFocus);
    return () => {
      api.removeEventListener("cellFocused", checkFocus);
    };
  }, [api, column, node.rowIndex]);

  return (
    <LuiButton
      ref={inputRef}
      className="lui-button-icon-only"
      size="sm"
      level="text"
      onClick={() => {
        const selectedRows = [data];
        const selectedRowIds = selectedRows.map((r) => r.id);
        colDef?.cellEditorParams.onClick?.({ selectedRows, selectedRowIds });
      }}
      style={{ display: colDef?.cellEditorParams?.visible?.(props) !== false ? "" : "none" }}
    >
      <LuiIcon name="ic_redo" alt="revert" size="md" />
    </LuiButton>
  );
};

export interface GridButtonProps<TData> {
  visible?: (cellEditorParams: ICellEditorParams) => boolean;
  onClick?: (props: { selectedRows: TData[]; selectedRowIds: (string | number)[] }) => void;
}

export const GridButton = <TData extends GridBaseRow>(
  colDef: GenericCellColDef<TData, boolean>,
  editor: GridButtonProps<TData>,
): ColDefT<TData> => {
  return GridCell({
    minWidth: 72,
    maxWidth: 72,
    resizable: false,
    headerClass: "GridHeaderAlignCenter",
    cellClass: "GridCellAlignCenter",
    cellRenderer: ButtonCellRenderer,
    cellEditorParams: {
      ...editor,
    },
    ...colDef,
  });
};
