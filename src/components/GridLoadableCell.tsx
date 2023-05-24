import clsx from "clsx";

import { LuiMiniSpinner } from "@linzjs/lui";

export const GridLoadableCell = () => (
  <div className={clsx("GridLoadableCell-container")}>
    <LuiMiniSpinner size={22} divProps={{ role: "status", "aria-label": "Loading", style: { marginBottom: 4 } }} />
  </div>
);
