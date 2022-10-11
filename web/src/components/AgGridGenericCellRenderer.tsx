import "./AgGridGenericCellRenderer.scss";

import { LuiIcon } from "@linzjs/lui";
import { ICellRendererParams } from "ag-grid-community";
import { useContext } from "react";
import { UpdatingContext } from "../contexts/UpdatingContext";
import { AgGridLoadableCell } from "./AgGridLoadableCell";
import { IconName } from "@linzjs/lui/dist/components/LuiIcon/LuiIcon";

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

  return (
    <AgGridLoadableCell isLoading={checkUpdating(props.colDef?.field ?? "", props.data.id)}>
      <>
        {warningText && <GridIcon icon={"ic_warning"} title={warningText} />}
        {infoText && <GridIcon icon={"ic_info"} title={infoText} />}
        <span title={props.value}>{props.value}</span>
      </>
    </AgGridLoadableCell>
  );
};
