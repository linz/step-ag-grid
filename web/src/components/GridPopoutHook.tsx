import { ICellEditorParams } from "ag-grid-community";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "../contexts/GridContext";
import { ControlledMenu } from "@szhsin/react-menu";
import { MyFormProps } from "./GridCell";

export const useGridPopoutHook = (props: MyFormProps, save?: (selectedRows: any[]) => Promise<boolean>) => {
  const { cellEditorParams, saving, updateValue } = props;
  const { eGridCell } = cellEditorParams as ICellEditorParams;
  const { stopEditing } = useContext(GridContext);
  const anchorRef = useRef(eGridCell);
  anchorRef.current = eGridCell;
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const cellRenderer = cellEditorParams.column.getColDef().cellRenderer;

  const triggerSave = useCallback(
    async (reason?: string) => {
      if (reason == "cancel" || !save || (await updateValue(save))) {
        setOpen(false);
        stopEditing();
      }
    },
    [save, stopEditing, updateValue],
  );

  const popoutWrapper = useCallback(
    (children: JSX.Element) => {
      return (
        <>
          {cellRenderer ? cellRenderer(cellEditorParams) : cellEditorParams.value}
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
            </ControlledMenu>
          )}
        </>
      );
    },
    [cellRenderer, cellEditorParams, isOpen, saving, triggerSave],
  );

  return {
    popoutWrapper,
    triggerSave,
  };
};
