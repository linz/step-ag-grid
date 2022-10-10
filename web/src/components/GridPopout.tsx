import "@szhsin/react-menu/dist/index.css";

import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import { useContext, useEffect, useRef, useState } from "react";
import { AgGridContext } from "../contexts/AgGridContext";
import { ICellEditorParams } from "ag-grid-community";

export interface GridPopoutParams extends ICellEditorParams {
  multiUpdate?: boolean;
  canClose?: () => boolean;
  children: JSX.Element;
}

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
          onClose={(event) => {
            if (event.reason == "cancel" || !props.canClose || props.canClose()) {
              setOpen(false);
              stopEditing();
            }
          }}
        >
          {children}
        </ControlledMenu>
      )}
    </>
  );
};
