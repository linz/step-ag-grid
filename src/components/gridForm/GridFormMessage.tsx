import clsx from 'clsx';
import { ReactElement, useEffect, useState } from 'react';

import { useGridPopoverContext } from '../../contexts/GridPopoverContext';
import { ComponentLoadingWrapper } from '../ComponentLoadingWrapper';
import { CellEditorCommon } from '../GridCell';
import { useGridPopoverHook } from '../GridPopoverHook';
import { GridBaseRow } from '../types';

export interface GridFormMessageProps<TData extends GridBaseRow> extends CellEditorCommon {
  message: (selectedRows: TData[]) => Promise<string | ReactElement> | string | ReactElement;
}

export const GridFormMessage = <TData extends GridBaseRow>(props: GridFormMessageProps<TData>): ReactElement => {
  const { selectedRows } = useGridPopoverContext<TData>();

  const [message, setMessage] = useState<string | ReactElement | null>(null);
  const { popoverWrapper } = useGridPopoverHook({ className: props.className });

  useEffect(() => {
    void (async () => {
      setMessage(await props.message(selectedRows));
    })();
  }, [props, selectedRows]);

  return popoverWrapper(
    <ComponentLoadingWrapper loading={message === null} className={clsx('GridFormMessage-container', props.className)}>
      <>{message}</>
    </ComponentLoadingWrapper>,
  );
};
