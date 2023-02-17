import { ReactNode } from "react";

export interface GridFiltersProps {
  children: ReactNode;
}

export const GridFilters = ({ children }: GridFiltersProps) => <div className="Grid-container-filters">{children}</div>;
