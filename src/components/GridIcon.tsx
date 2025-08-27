import { LuiIcon } from '@linzjs/lui';
import { IconName, IconSize } from '@linzjs/lui/dist/components/LuiIcon/LuiIcon';
import clsx from 'clsx';
import { ReactElement } from 'react';

export const GridIcon = (props: {
  icon: IconName;
  title: string;
  size?: IconSize;
  disabled?: boolean;
  className?: string;
}): ReactElement => (
  <LuiIcon
    name={props.icon}
    title={props.title}
    alt={props.title}
    size={props.size ?? 'md'}
    className={clsx(
      `step-ag-grid__alert-icon`,
      `AgGridGenericCellRenderer-${props.icon}Icon`,
      props.className,
      props.disabled && 'GridIcon-disabled',
    )}
  />
);
