import { ICellRendererParams } from "ag-grid-community";
import { useContext } from "react";
import { UpdatingContext } from "../../contexts/UpdatingContext";
import { GridLoadableCell } from "../GridLoadableCell";
import { LuiIcon } from "@linzjs/lui";

export const GridRenderPopoutMenuCell = (props: ICellRendererParams) => {
  const { checkUpdating } = useContext(UpdatingContext);
  const isLoading = checkUpdating(props.colDef?.field ?? "", props.data.id);
  const disabled = !props.colDef?.editable;

  return (
    <GridLoadableCell isLoading={isLoading}>
      <LuiIcon
        name={"ic_more_vert"}
        alt={"More actions"}
        size={"md"}
        className={disabled ? `GridPopoutMenu-burgerDisabled` : `GridPopoutMenu-burger`}
      />
    </GridLoadableCell>
  );
};
