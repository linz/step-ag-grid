import { ICellEditorParams } from "ag-grid-community";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "../contexts/GridContext";
import { ControlledMenu } from "@szhsin/react-menu";
import { GridFormProps } from "./GridCell";
import { hasParentClass } from "../utils/util";
import { GridBaseRow } from "./Grid";

export const useGridPopoverHook = <RowType extends GridBaseRow>(
  props: GridFormProps<RowType>,
  save?: (selectedRows: any[]) => Promise<boolean>,
) => {
  const { cellEditorParams, saving, updateValue } = props;
  const { eGridCell } = cellEditorParams as ICellEditorParams;
  const { stopEditing } = useContext(GridContext);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef(eGridCell);
  anchorRef.current = eGridCell;
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const triggerSave = useCallback(
    async (reason?: string) => {
      if (reason == "cancel" || !save || (await updateValue(save))) {
        setOpen(false);
        stopEditing();
      }
    },
    [save, stopEditing, updateValue],
  );

  const clickIsWithinMenu = useCallback((ev: MouseEvent) => {
    return hasParentClass("szh-menu--state-open", ev.target as Node);
  }, []);

  const handleScreenMouseDown = useCallback(
    (ev: MouseEvent) => {
      if (!clickIsWithinMenu(ev)) {
        ev.preventDefault();
        ev.stopPropagation();
        // There's an issue in React17
        // the cell doesn't refresh during update if save is invoked from a native event
        // This doesn't happen in React18
        // To work around it, I invoke the save by clicking on an invisible button in the dropdown
        saveButtonRef.current?.click();
      }
    },
    [clickIsWithinMenu],
  );

  const handleScreenMouseEvent = useCallback(
    (ev: MouseEvent) => {
      if (!clickIsWithinMenu(ev)) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },
    [clickIsWithinMenu],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleScreenMouseDown, true);
      document.addEventListener("mouseup", handleScreenMouseEvent, true);
      document.addEventListener("click", handleScreenMouseEvent, true);
      return () => {
        document.removeEventListener("mousedown", handleScreenMouseDown, true);
        document.removeEventListener("mouseup", handleScreenMouseEvent, true);
        document.removeEventListener("click", handleScreenMouseEvent, true);
      };
    }
    return () => {};
  }, [handleScreenMouseDown, handleScreenMouseEvent, isOpen]);

  const popoverWrapper = useCallback(
    (children: JSX.Element) => {
      return (
        <>
          {anchorRef.current && (
            <ControlledMenu
              state={isOpen ? "open" : "closed"}
              portal={true}
              unmountOnClose={true}
              anchorRef={anchorRef}
              menuClassName={"lui-menu"}
              onClose={(event) => triggerSave(event.reason).then()}
            >
              {saving && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: "rgba(64,64,64,0.1)",
                    zIndex: 1000,
                  }}
                />
              )}
              {children}
              <button ref={saveButtonRef} onClick={() => triggerSave().then()} style={{ display: "none" }} />
            </ControlledMenu>
          )}
        </>
      );
    },
    [isOpen, saving, triggerSave],
  );

  return {
    popoverWrapper,
    triggerSave,
  };
};
