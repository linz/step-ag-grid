import { ColDef } from "ag-grid-community";
import { CellContextMenuEvent } from "ag-grid-community/dist/lib/events";
import { ReactElement, useCallback, useContext, useRef, useState } from "react";

import { GridContext } from "../contexts/GridContext";
import { ControlledMenu, MenuItem } from "../react-menu3";

export interface GridContextMenuItem {
  label: ReactElement | string | number;
  onSelect: (props: { colDef: ColDef }) => Promise<void> | void;
  disabled?: boolean;
  visible?: boolean;
}

export const useGridContextMenu = (contextMenu?: (selectedRows: any[]) => GridContextMenuItem[] | null) => {
  const { getSelectedRows, redrawRows, prePopupOps, postPopupOps } = useContext(GridContext);

  const [isOpen, setOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [contextMenuItems, setContextMenuItems] = useState<GridContextMenuItem[] | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const clickedColDef = useRef<ColDef>(null!);

  const openMenu = useCallback(
    (e: PointerEvent | null | undefined) => {
      if (!e || !contextMenu) return;
      prePopupOps();
      setAnchorPoint({ x: e.clientX, y: e.clientY });
      setContextMenuItems(contextMenu(getSelectedRows()));
      setOpen(true);
    },
    [contextMenu, getSelectedRows, prePopupOps],
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    setContextMenuItems(null);
    postPopupOps();
  }, [postPopupOps]);

  const cellContextMenu = useCallback(
    (event: CellContextMenuEvent) => {
      clickedColDef.current = event.colDef;
      // This is actually a pointer event
      openMenu(event.event as PointerEvent);
    },
    [openMenu],
  );

  // global onclick
  return {
    openMenu,
    cellContextMenu,
    component: contextMenuItems ? (
      <>
        <ControlledMenu
          anchorPoint={anchorPoint}
          state={isOpen ? "open" : "closed"}
          direction="right"
          onClose={() => closeMenu()}
        >
          {contextMenuItems.map(
            (row, i) =>
              row.visible !== false && (
                <MenuItem
                  key={`${i}`}
                  onClick={async () => {
                    await row.onSelect({ colDef: clickedColDef.current });
                    redrawRows();
                  }}
                  disabled={row.disabled}
                >
                  {row.label}
                </MenuItem>
              ),
          )}
        </ControlledMenu>
      </>
    ) : null,
  };
};
