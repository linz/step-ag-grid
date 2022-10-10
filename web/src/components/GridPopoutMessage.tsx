import "@szhsin/react-menu/dist/index.css";

import { MenuItem } from "@szhsin/react-menu";
import { ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridPopout } from "./GridPopout";
import { AgGridContext } from "../contexts/AgGridContext";
import { useContext } from "react";

export interface GridPopoutMessageProps extends ICellEditorParams {
  message: JSX.Element | string;
}

export const GridPopoutMessage = (props: GridPopoutMessageProps) => {
  const { stopEditing } = useContext(AgGridContext);
  const children = (
    <div style={{ maxWidth: 400, padding: 16 }} onClick={stopEditing}>
      {props.message}
    </div>
  );
  return GridPopout({ ...props, children });
};
