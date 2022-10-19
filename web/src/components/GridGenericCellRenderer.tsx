import "./GridGenericCellRenderer.scss";

import { useContext } from "react";
import { UpdatingContext } from "../contexts/UpdatingContext";
import { GridLoadableCell } from "./GridLoadableCell";
import { GridIcon } from "./GridIcon";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

/**
 * Generic read only cell.
 */
export const GridGenericCell = (props: GenericCellRendererColDef | undefined): ColDef => ({
  sortable: true,
  resizable: true,
  cellRenderer: props?.cellRenderer ?? GridGenericCellRendererComponent,
  ...props,
});

interface GenericCellComponentParams extends ICellRendererParams {
  colDef: GenericCellRendererColDef;
}

export interface GenericCellRendererColDef extends ColDef {
  cellRendererParams?: GenericCellRendererParams;
}

export interface GenericCellRendererParams {
  singleClickEdit?: boolean;
  warning?: (props: ICellRendererParams) => string | boolean | undefined;
  info?: (props: ICellRendererParams) => string | boolean | undefined;
}

export const GridGenericCellRendererComponent = (props: GenericCellComponentParams): JSX.Element => {
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
    <GridLoadableCell isLoading={checkUpdating(props.colDef?.field ?? "", props.data.id)}>
      <>
        {typeof warningText === "string" && <GridIcon icon={"ic_warning"} title={warningText} />}
        {typeof infoText === "string" && <GridIcon icon={"ic_info"} title={infoText} />}
        <span title={formatted}>{formatted}</span>
      </>
    </GridLoadableCell>
  );
};
