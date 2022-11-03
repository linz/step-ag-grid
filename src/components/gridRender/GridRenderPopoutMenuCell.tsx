import { useContext } from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { GridUpdatingContext } from "@contexts/GridUpdatingContext";
import { GridLoadableCell } from "../GridLoadableCell";
import { LuiIcon } from "@linzjs/lui";
import { Column } from "ag-grid-community/dist/lib/entities/column";

export const GridRenderPopoutMenuCell = (props: ICellRendererParams) => {
  const { checkUpdating } = useContext(GridUpdatingContext);
  const isLoading = checkUpdating(props.colDef?.field ?? "", props.data.id);
  const editable = props.colDef?.editable;
  const disabled = !(typeof editable === "function"
    ? editable({
        node: props.node,
        data: props.data,
        column: props.column as Column,
        colDef: props.colDef as ColDef,
        api: props.api,
        columnApi: props.columnApi,
        context: props.context,
      })
    : editable);

  return (
    <GridLoadableCell
      isLoading={isLoading}
      className={disabled ? `GridPopoutMenu-burgerDisabled` : `GridPopoutMenu-burger`}
    >
      <LuiIcon name={"ic_more_vert"} alt={"More actions"} size={"md"} />
    </GridLoadableCell>
  );
};
