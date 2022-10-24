import "./GridRenderGenericCell.scss";

import { useContext } from "react";
import { UpdatingContext } from "../../contexts/UpdatingContext";
import { GridLoadableCell } from "../GridLoadableCell";
import { GridIcon } from "../GridIcon";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GenericCellEditorParams } from "../GridCell";

export interface GenericCellColDef<FormProps extends Record<string, any>> extends ColDef {
  cellRendererParams?: GenericCellRendererParams;
  cellEditorParams?: GenericCellEditorParams & FormProps;
}

export interface GenericCellRendererParams {
  singleClickEdit?: boolean;
  warning?: (props: ICellRendererParams) => string | boolean | undefined;
  info?: (props: ICellRendererParams) => string | boolean | undefined;
}

export const GridGenericCellRendererComponent = (props: ICellRendererParams): JSX.Element => {
  const { checkUpdating } = useContext(UpdatingContext);

  const cellRendererParams = props.colDef?.cellRendererParams as GenericCellRendererParams | undefined;
  const warningFn = cellRendererParams?.warning;
  const warningText = warningFn ? warningFn(props) : undefined;
  const infoFn = cellRendererParams?.info;
  const infoText = infoFn ? infoFn(props) : undefined;

  const defaultFormatter = (props: ValueFormatterParams): string => props.value;
  const formatter = props.colDef?.valueFormatter ?? defaultFormatter;
  if (typeof formatter === "string") {
    console.error("valueFormatter must be a function");
    return <span>valueFormatter must be a function</span>;
  }
  const formatted = formatter(props as ValueFormatterParams);

  return (
    <GridLoadableCell isLoading={checkUpdating(props.colDef?.field ?? props.colDef?.colId ?? "", props.data.id)}>
      <>
        {typeof warningText === "string" && <GridIcon icon={"ic_warning"} title={warningText} />}
        {typeof infoText === "string" && <GridIcon icon={"ic_info"} title={infoText} />}
        <span title={formatted}>{formatted}</span>
      </>
    </GridLoadableCell>
  );
};
