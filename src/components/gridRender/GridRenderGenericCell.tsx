import "../../styles/GridRenderGenericCell.scss";

import { useContext } from "react";
import { GridUpdatingContext } from "@contexts/GridUpdatingContext";
import { GridLoadableCell } from "../GridLoadableCell";
import { GridIcon } from "../GridIcon";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridBaseRow } from "../Grid";
import { ColDefT } from "@components/GridCell";

export interface RowICellRendererParams<RowType extends GridBaseRow> extends ICellRendererParams {
  data: RowType;
}

export interface GenericCellColDef<RowType extends GridBaseRow> extends ColDefT<RowType> {
  cellRendererParams?: GenericCellRendererParams<RowType>;
}

export interface GenericCellRendererParams<RowType extends GridBaseRow> {
  singleClickEdit?: boolean;
  warning?: (props: RowICellRendererParams<RowType>) => string | boolean | null | undefined;
  info?: (props: RowICellRendererParams<RowType>) => string | boolean | null | undefined;
}

export const GridRendererGenericCell = <RowType extends GridBaseRow>(props: ICellRendererParams): JSX.Element => {
  const { checkUpdating } = useContext(GridUpdatingContext);

  const colDef = props.colDef as ColDef;
  const cellRendererParams = colDef.cellRendererParams as GenericCellRendererParams<RowType> | undefined;
  const warningFn = cellRendererParams?.warning;
  const warningText = warningFn ? warningFn(props) : undefined;
  const infoFn = cellRendererParams?.info;
  const infoText = infoFn ? infoFn(props) : undefined;

  const defaultFormatter = (props: ValueFormatterParams): string => props.value;
  const formatter = colDef.valueFormatter ?? defaultFormatter;
  if (typeof formatter === "string") {
    console.error("valueFormatter must be a function");
    return <span>valueFormatter must be a function</span>;
  }
  const formatted = formatter(props as ValueFormatterParams);

  return (
    <GridLoadableCell isLoading={checkUpdating(colDef.field ?? colDef.colId ?? "", props.data.id)}>
      <>
        {typeof warningText === "string" && <GridIcon icon={"ic_warning"} title={warningText} />}
        {typeof infoText === "string" && <GridIcon icon={"ic_info"} title={infoText} />}
        <span title={formatted}>{formatted}</span>
      </>
    </GridLoadableCell>
  );
};
