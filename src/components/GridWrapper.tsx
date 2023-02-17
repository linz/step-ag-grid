import { ReactNode } from "react";

export interface GridWrapperProps {
  children: ReactNode;
  maxHeight?: number | string;
}

export const GridWrapper = ({ children, maxHeight }: GridWrapperProps) => (
  <div className={"Grid-wrapper"} style={{ maxHeight }}>
    {children}
  </div>
);
