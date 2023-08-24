import clsx from "clsx";
import { ReactElement, useEffect, useState } from "react";

import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridBaseRow } from "../Grid";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverHook } from "../GridPopoverHook";

export interface GridFormMessageProps<RowType extends GridBaseRow> extends CellEditorCommon {
  message: (selectedRows: RowType[]) => Promise<string | ReactElement> | string | ReactElement;
}

export const GridFormMessage = <RowType extends GridBaseRow>(props: GridFormMessageProps<RowType>) => {
  const { selectedRows } = useGridPopoverContext<RowType>();

  const [message, setMessage] = useState<string | ReactElement | null>(null);
  const { popoverWrapper } = useGridPopoverHook({ className: props.className });

  useEffect(() => {
    (async () => {
      setMessage(await props.message(selectedRows));
    })().then();
  }, [props, selectedRows]);

  return popoverWrapper(
    <ComponentLoadingWrapper loading={message === null} className={clsx("GridFormMessage-container", props.className)}>
      <>{message}</>
    </ComponentLoadingWrapper>,
  );
};
