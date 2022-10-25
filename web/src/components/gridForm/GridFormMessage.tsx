import { useEffect, useState } from "react";
import { GridFormProps } from "../GridCell";
import { ICellEditorParams } from "ag-grid-community";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridBaseRow } from "../Grid";
import { useGridPopoutHook } from "../GridPopoutHook";

export interface GridFormMessageProps<RowType extends GridBaseRow> {
  message: (
    selectedRows: RowType[],
    cellEditorParams: ICellEditorParams,
  ) => Promise<string | JSX.Element> | string | JSX.Element;
}

export const GridFormMessage = <RowType extends GridBaseRow>(props: GridFormProps<RowType>) => {
  const formProps = props.formProps as GridFormMessageProps<RowType>;

  const [message, setMessage] = useState<string | JSX.Element | null>(null);
  const { popoutWrapper } = useGridPopoutHook(props);

  useEffect(() => {
    (async () => {
      setMessage(await formProps.message(props.selectedRows, props.cellEditorParams));
    })().then();
  }, [formProps, props.selectedRows, props]);

  return popoutWrapper(
    <ComponentLoadingWrapper loading={message === null}>
      <div style={{ maxWidth: 400, padding: 16 }}>{message}</div>
    </ComponentLoadingWrapper>,
  );
};
