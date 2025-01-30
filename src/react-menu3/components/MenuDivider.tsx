import { forwardRef, LegacyRef, memo } from 'react';

import { useBEM } from '../hooks';
import { BaseProps } from '../types';
import { menuClass, menuDividerClass } from '../utils';

const MenuDividerFr = ({ className, ...restProps }: BaseProps, externalRef: LegacyRef<HTMLLIElement>) => {
  return (
    <li
      role="separator"
      {...restProps}
      ref={externalRef}
      className={useBEM({ block: menuClass, element: menuDividerClass, className })}
    />
  );
};

export const MenuDivider = memo(forwardRef(MenuDividerFr));
