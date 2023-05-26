import { LuiMiniSpinner } from "@linzjs/lui";

export const GridLoadableCell = () => (
  <LuiMiniSpinner
    size={22}
    divProps={{ className: "GridLoadableCell-container", role: "status", "aria-label": "Loading" }}
  />
);
