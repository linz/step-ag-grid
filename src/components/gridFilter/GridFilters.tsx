import { PropsWithChildren } from "react";

export const GridFilters = ({ children }: PropsWithChildren<void>) => (
  <div className="Grid-container-filters">{children}</div>
);
