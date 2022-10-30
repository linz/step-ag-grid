import { ICellEditorParams } from "ag-grid-community";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "@contexts/GridContext";
import { GridFormProps } from "./GridCell";
import { GridBaseRow } from "./Grid";
import { ControlledMenu } from "@react-menu3";

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
              saveButtonRef={saveButtonRef}
              menuClassName={"lui-menu"}
              onClose={(event: { reason: string }) => triggerSave(event.reason).then()}
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
