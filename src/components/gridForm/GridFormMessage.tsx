import { useEffect, useState } from "react";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridBaseRow } from "../Grid";
import { useGridPopoverHook } from "../GridPopoverHook";
import { CellParams } from "@components/GridCell";

export interface GridFormMessageProps<RowType extends GridBaseRow> {
  multiEdit?: boolean;
  message: (cellParams: CellParams<RowType>) => Promise<string | JSX.Element> | string | JSX.Element;
}

export const GridFormMessage = <RowType extends GridBaseRow>(
  props: GridFormMessageProps<RowType> & CellParams<RowType>,
) => {
  const [message, setMessage] = useState<string | JSX.Element | null>(null);
  const { popoverWrapper } = useGridPopoverHook();

  useEffect(() => {
    (async () => {
      setMessage(await props.message(props));
    })().then();
  }, [props]);

  return popoverWrapper(
    <ComponentLoadingWrapper loading={message === null}>
      <div style={{ maxWidth: 400 }} className={"Grid-popoverContainer"}>
        {message}
      </div>
    </ComponentLoadingWrapper>,
  );
};
