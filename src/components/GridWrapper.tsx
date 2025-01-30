import { PropsWithChildren } from 'react';

export interface GridWrapperProps {
  maxHeight?: number | string;
}

export const GridWrapper = ({ children, maxHeight }: PropsWithChildren<GridWrapperProps>) => (
  <div className={'Grid-wrapper'} style={{ maxHeight }}>
    {children}
  </div>
);
