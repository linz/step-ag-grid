import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridBaseRow } from "../Grid";
import { useGridPopoverHook } from "../GridPopoverHook";
import { CellEditorCommon } from "../GridCell";
import { GridPopoverContext } from "../../contexts/GridPopoverContext";

export interface GridFormMessageProps<RowType extends GridBaseRow> extends CellEditorCommon {
  message: (selectedRows: RowType[]) => Promise<string | JSX.Element> | string | JSX.Element;
}

export const GridFormMessage = <RowType extends GridBaseRow>(props: GridFormMessageProps<RowType>) => {
  const { selectedRows } = useContext(GridPopoverContext);
  const [message, setMessage] = useState<string | JSX.Element | null>(null);
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
