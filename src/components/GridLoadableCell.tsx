import clsx from "clsx";

import { LuiMiniSpinner } from "@linzjs/lui";

export const GridLoadableCell = (props: { isLoading: boolean; children: JSX.Element | string; className?: string }) => (
  <div className={clsx("GridLoadableCell-container", props.className)}>
    {props.isLoading ? (
      <LuiMiniSpinner size={22} divProps={{ role: "status", "aria-label": "Loading", style: { marginBottom: 4 } }} />
    ) : (
      props.children
    )}
  </div>
);
