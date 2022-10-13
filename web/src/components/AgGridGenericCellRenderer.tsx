import "./AgGridGenericCellRenderer.scss";

import { LuiIcon } from "@linzjs/lui";
import { ICellRendererParams } from "ag-grid-community";
import { useContext } from "react";
import { UpdatingContext } from "../contexts/UpdatingContext";
import { AgGridLoadableCell } from "./AgGridLoadableCell";
import { IconName } from "@linzjs/lui/dist/components/LuiIcon/LuiIcon";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

export const GridIcon = (props: { icon: IconName; title: string }): JSX.Element => (
  <LuiIcon
    name={props.icon}
    title={props.title}
    alt={props.title}
    size={"md"}
    className={`AgGridGenericCellRenderer-${props.icon}Icon`}
  />
);

export const AgGridGenericCellRenderer = (props: ICellRendererParams): JSX.Element => {
  const { checkUpdating } = useContext(UpdatingContext);

  const warningFn = props.colDef?.cellRendererParams?.warning;
  const warningText = warningFn ? warningFn(props) : undefined;
  const infoFn = props.colDef?.cellRendererParams?.info;
  const infoText = infoFn ? infoFn(props) : undefined;

  const defaultFormatter = (props: ValueFormatterParams): string => props.value;
  const formatter = props.colDef?.valueFormatter ?? defaultFormatter;
  if (typeof formatter === "string") {
    console.error("valueFormatter must be a function");
    return <span>valueFormatter must be a function</span>;
  }
  const formatted = formatter(props as ValueFormatterParams);

  return (
    <AgGridLoadableCell isLoading={checkUpdating(props.colDef?.field ?? "", props.data.id)}>
      <>
        {warningText && <GridIcon icon={"ic_warning"} title={warningText} />}
        {infoText && <GridIcon icon={"ic_info"} title={infoText} />}
        <span title={formatted}>{formatted}</span>
      </>
    </AgGridLoadableCell>
  );
};
