import clsx from 'clsx';
import { forwardRef, PropsWithChildren } from 'react';

export interface GridWrapperProps {
  className?: string | undefined;
  maxHeight?: number | string;
}

export const GridWrapper = forwardRef<HTMLDivElement, PropsWithChildren<GridWrapperProps>>(function GridWrapperFr(
  { children, maxHeight, className },
  ref,
) {
  return (
    <div className={clsx('Grid-wrapper', className)} style={{ maxHeight }} ref={ref}>
      {children}
    </div>
  );
});
