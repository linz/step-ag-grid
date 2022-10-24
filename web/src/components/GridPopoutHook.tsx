import { ICellEditorParams } from "ag-grid-community";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "../contexts/GridContext";
import { ControlledMenu, MenuCloseEvent } from "@szhsin/react-menu";

export const useGridPopoutHook = (_props?: ICellEditorParams, save?: () => Promise<boolean> | boolean) => {
  const props = _props as ICellEditorParams;
  const { eGridCell } = props as ICellEditorParams;
  const { stopEditing } = useContext(GridContext);
  const anchorRef = useRef(eGridCell);
  anchorRef.current = eGridCell;
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const cellRenderer = props.column.getColDef().cellRenderer;

  const triggerSave = useCallback(
    async (event: MenuCloseEvent) => {
      if (event.reason == "cancel" || !save || (await save())) {
        setOpen(false);
        stopEditing();
      }
    },
    [save, stopEditing],
  );

  const popoutWrapper = useCallback(
    (children: JSX.Element) => {
      return (
        <>
          {cellRenderer ? cellRenderer(props) : props.value}
          {anchorRef.current && (
            <ControlledMenu
              state={isOpen ? "open" : "closed"}
              portal={true}
              unmountOnClose={true}
              anchorRef={anchorRef}
              menuClassName={"lui-menu"}
              onClose={(event) => triggerSave(event).then()}
            >
              {children}
            </ControlledMenu>
          )}
        </>
      );
    },
    [cellRenderer, isOpen, props, triggerSave],
  );

  return {
    popoutWrapper,
  };
};
