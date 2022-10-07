import "@szhsin/react-menu/dist/index.css";

import { ControlledMenu } from "@szhsin/react-menu";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AgGridContext } from "../contexts/AgGridContext";
import { ICellEditorParams, ICellRendererParams } from "ag-grid-community";

export interface GridPopoutParams extends ICellEditorParams {
  multiUpdate?: boolean;
  children: JSX.Element;
}

export const GridCell = ({ api, value }: ICellRendererParams) => {
  const cellEditingStarted = useCallback(() => {}, []);

  useEffect(() => {
    api.addEventListener("cellEditingStarted", cellEditingStarted);
    return () => api.removeEventListener("cellEditingStarted", cellEditingStarted);
  }, [api, cellEditingStarted]);

  return value;
};

export const GridPopout = (props: GridPopoutParams) => {
  const { children, eGridCell } = props;
  const { stopEditing } = useContext(AgGridContext);
  const anchorRef = useRef(eGridCell);
  anchorRef.current = eGridCell;
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const cellRenderer = props.column.getColDef().cellRenderer;

  return (
    <>
      {cellRenderer ? cellRenderer(props) : props.value}
      {anchorRef.current && (
        <ControlledMenu
          state={isOpen ? "open" : "closed"}
          portal={true}
          unmountOnClose={true}
          anchorRef={anchorRef}
          onClose={(x) => {
            setOpen(false);
            stopEditing();
          }}
        >
          {children}
        </ControlledMenu>
      )}
    </>
  );
};
