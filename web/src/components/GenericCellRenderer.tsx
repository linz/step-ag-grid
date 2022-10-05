import { ICellRendererParams } from "ag-grid-community";
import { ReactElement } from "react";

export interface GenericCellRendererParams<T> extends ICellRendererParams {
  getDisplay: (data: T) => ReactElement;
  data: T;
}

export const PLACEHOLDER_ROW_ID = -2;

export const GenericCellRenderer = <T extends unknown>(props: GenericCellRendererParams<T>): JSX.Element => {
  const value = props.colDef?.cellRendererParams.getDisplay(props.data);
  return <span>{value}</span>;
};
