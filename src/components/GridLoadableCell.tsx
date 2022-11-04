import "./GridLoadableCell.scss";

import { LuiMiniSpinner } from "@linzjs/lui";
import clsx from "clsx";

export const GridLoadableCell = (props: {
  isLoading: boolean;
  dataTestId?: string;
  children: JSX.Element | string;
  className?: string;
}): JSX.Element => {
  if (props.isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <LuiMiniSpinner size={22} divProps={{ role: "status", "aria-label": "Loading", style: { marginBottom: 4 } }} />
      </div>
    );
  }
  // only add test id into ONE of the columns in a grid. this way each row will have one unique id :)
  return (
    <div data-testid={props.dataTestId} className={clsx("GridLoadableCell-container", props.className)}>
      {props.children}
    </div>
  );
};
