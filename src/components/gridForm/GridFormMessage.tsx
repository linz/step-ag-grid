import clsx from "clsx";
import { useEffect, useState } from "react";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridBaseRow } from "../Grid";
import { useGridPopoverHook } from "../GridPopoverHook";
import { CellEditorCommon, CellParams } from "../GridCell";

export interface GridFormMessageProps<RowType extends GridBaseRow> extends CellEditorCommon {
  message: (cellParams: CellParams<RowType>) => Promise<string | JSX.Element> | string | JSX.Element;
}

export const GridFormMessage = <RowType extends GridBaseRow>(_props: GridFormMessageProps<RowType>) => {
  const props = _props as GridFormMessageProps<RowType> & CellParams<RowType>;
  const [message, setMessage] = useState<string | JSX.Element | null>(null);
  const { popoverWrapper } = useGridPopoverHook({ className: props.className });

  useEffect(() => {
    (async () => {
      setMessage(await props.message(props));
    })().then();
  }, [props]);

  return popoverWrapper(
    <ComponentLoadingWrapper loading={message === null} className={clsx("GridFormMessage-container", props.className)}>
      <>{message}</>
    </ComponentLoadingWrapper>,
  );
};
