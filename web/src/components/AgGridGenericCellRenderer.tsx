import { ICellRendererParams } from "ag-grid-community";
import { useContext } from "react";
import { UpdatingContext } from "../contexts/UpdatingContext";
import { AgGridLoadableCell } from "./AgGridLoadableCell";

export const AgGridGenericCellRenderer = (props: ICellRendererParams): JSX.Element => {
  const { checkUpdating } = useContext(UpdatingContext);
  return (
    <AgGridLoadableCell isLoading={checkUpdating(props.colDef?.field ?? "", props.data.id)}>
      <span title={props.value}>{props.value}</span>
    </AgGridLoadableCell>
  );
};
