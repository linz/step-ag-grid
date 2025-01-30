import { ForwardedRef, forwardRef, memo } from 'react';

import { useBEM } from '../hooks';
import { BasePropsWithChildren } from '../types';
import { menuClass, menuHeaderClass } from '../utils';

export const MenuHeaderFr = (
  { className, ...restProps }: BasePropsWithChildren,
  externalRef: ForwardedRef<HTMLLIElement>,
) => {
  return (
    <li
      role="presentation"
      {...restProps}
      ref={externalRef}
      className={useBEM({ block: menuClass, element: menuHeaderClass, className })}
    />
  );
};

export const MenuHeader = memo(forwardRef(MenuHeaderFr));
