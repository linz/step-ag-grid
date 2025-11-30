import { LuiIcon } from '@linzjs/lui';
import clsx from 'clsx';
import { ReactElement, useCallback, useMemo } from 'react';

import { typedEntries } from '../lui/tsUtils';
import { MenuDivider, MenuHeader, MenuItem } from '../react-menu3';
import { GridContextMenuComponentProps } from './gridHook';
import { CopyOptionsKey, gridCopyOptions } from './gridHook/useGridCopySettings';
import { GridBaseRow } from './types';

export interface CopyOptionsContext {
  onCopy: (type?: CopyOptionsKey) => void;
  copyType: CopyOptionsKey;
  setCopyType: (copyType: CopyOptionsKey) => void;
}

export const GridRangeSelectContextMenu = <TData extends GridBaseRow>({
  event,
  context,
}: GridContextMenuComponentProps<TData, CopyOptionsContext>): ReactElement => {
  const developerContextMenu: boolean = !!(event?.event as { ctrlKey?: boolean })?.ctrlKey;
  const onCopy = useMemo(() => context?.onCopy, [context?.onCopy]);
  const onClick = useCallback(
    (type: CopyOptionsKey) => {
      onCopy?.(type);
    },
    [onCopy],
  );

  return (
    <>
      <MenuHeader>Copy as</MenuHeader>
      {typedEntries(gridCopyOptions).map(([key, { icon, text, developer }]) => {
        return (
          (!developer || developerContextMenu) && (
            <MenuItem key={key} onClick={() => void onClick(key)}>
              <div className={'copyMenuMenuItem'}>
                <LuiIcon name={icon} alt={text} size={'md'} />
                <div className={'copyMenuMenuItem__text'}>{text}</div>
              </div>
            </MenuItem>
          )
        );
      })}
      <MenuDivider />
      <MenuHeader>Set copy default</MenuHeader>
      {typedEntries(gridCopyOptions).map(([key, { text, developer }]) => {
        return (
          !developer && (
            <MenuItem
              key={'default_' + key}
              onClick={(e) => {
                context?.setCopyType(key);
                e.keepOpen = true;
              }}
            >
              <div
                className={clsx(
                  'copyMenuMenuItem',
                  context?.copyType === key ? '' : 'copyMenuMenuItem__buttonDefault--hidden',
                )}
              >
                <LuiIcon name={'ic_tick'} alt={'CSV'} size={'sm'} />
                <div className={'copyMenuMenuItem__text'}>{text}</div>
              </div>
            </MenuItem>
          )
        );
      })}
    </>
  );
};
