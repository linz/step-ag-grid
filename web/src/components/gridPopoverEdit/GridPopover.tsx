import "@szhsin/react-menu/dist/index.css";

import { ControlledMenu } from "@szhsin/react-menu";
import { useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "../../contexts/GridContext";
import { ICellEditorParams } from "ag-grid-community";
import { BaseGridRow } from "../Grid";

export interface GridPopoutCellEditorParams {
  canClose?: () => Promise<boolean> | boolean;
  children: JSX.Element;
}

export interface GridPopupProps<RowType extends BaseGridRow, GridFormProps> {
  formProps: GridFormProps;
  multiEdit: boolean;
}

export const GridPopoverComponent = (props: ICellEditorParams, params: GridPopoutCellEditorParams) => {
  const { eGridCell } = props;
  const { children, canClose } = params;
  const { stopEditing } = useContext(GridContext);
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
          menuClassName={"lui-menu"}
          onClose={(event) => {
            (async () => {
              if (event.reason == "cancel" || !canClose || (await canClose())) {
                setOpen(false);
                stopEditing();
              }
            })().then();
          }}
        >
          <div id={"temp2"}>{children}</div>
        </ControlledMenu>
      )}
    </>
  );
};
