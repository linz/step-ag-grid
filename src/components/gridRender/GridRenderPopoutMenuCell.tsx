import { ICellRendererParams } from "ag-grid-community";

import { LuiIcon } from "@linzjs/lui";

import { fnOrVar } from "../../utils/util";

export const GridRenderPopoutMenuCell = (props: ICellRendererParams) => {
  const disabled = !fnOrVar(props.colDef?.editable, props);

  return (
    <LuiIcon
      name={"ic_more_vert"}
      alt={"More actions"}
      size={"md"}
      className={disabled ? `GridPopoutMenu-burgerDisabled` : `GridPopoutMenu-burger`}
    />
  );
};
