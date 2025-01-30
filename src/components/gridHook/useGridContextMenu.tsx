import { ColDef } from 'ag-grid-community';
import { CellContextMenuEvent } from 'ag-grid-community';
import { ReactElement, useCallback, useContext, useRef, useState } from 'react';

import { GridContext } from '../../contexts/GridContext';
import { ControlledMenu } from '../../react-menu3';
import { GridBaseRow } from '../Grid';

export interface GridContextMenuComponentProps<TData extends GridBaseRow> {
  selectedRows: TData[];
  clickedRow: TData;
  colDef: ColDef;
  close: () => void;
}

export type GridContextMenuComponent<TData extends GridBaseRow> = (
  props: GridContextMenuComponentProps<TData>,
) => ReactElement | null;

export const useGridContextMenu = <TData extends GridBaseRow>({
  contextMenuSelectRow,
  contextMenu: ContextMenu,
}: {
  contextMenuSelectRow: boolean;
  contextMenu?: GridContextMenuComponent<TData>;
}) => {
  const { redrawRows, prePopupOps, postPopupOps, getSelectedRows } = useContext(GridContext);

  const [isOpen, setOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const clickedColDefRef = useRef<ColDef>(null!);
  const selectedRowsRef = useRef<any[]>([]);
  const clickedRowRef = useRef<any>(null);

  const openMenu = useCallback(
    (e: PointerEvent | null | undefined) => {
      if (!e) return;
      prePopupOps();
      setAnchorPoint({ x: e.clientX, y: e.clientY });
      setOpen(true);
    },
    [prePopupOps],
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    redrawRows();
    postPopupOps();
  }, [postPopupOps, redrawRows]);

  const cellContextMenu = useCallback(
    (event: CellContextMenuEvent) => {
      if (contextMenuSelectRow && !event.node.isSelected()) {
        event.node.setSelected(true, true);
      }

      clickedColDefRef.current = event.colDef;
      selectedRowsRef.current = getSelectedRows();
      clickedRowRef.current = event.data;

      // This is actually a pointer event
      openMenu(event.event as PointerEvent);
    },
    [contextMenuSelectRow, getSelectedRows, openMenu],
  );

  return {
    openMenu,
    cellContextMenu,
    component: ContextMenu ? (
      <>
        <ControlledMenu
          anchorPoint={anchorPoint}
          state={isOpen ? 'open' : 'closed'}
          direction="right"
          onClose={closeMenu}
        >
          {isOpen && (
            <ContextMenu
              selectedRows={selectedRowsRef.current}
              clickedRow={clickedRowRef.current}
              colDef={clickedColDefRef.current}
              close={closeMenu}
            />
          )}
        </ControlledMenu>
      </>
    ) : null,
  };
};
