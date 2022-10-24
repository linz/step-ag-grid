import { useContext, useEffect, useState } from "react";
import { MyFormProps } from "../GridCell";
import { ICellEditorParams } from "ag-grid-community";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { BaseGridRow } from "../Grid";
import { GridContext } from "../../contexts/GridContext";
import { useGridPopoutHook } from "../GridPopoutHook";

export interface GridFormMessageProps<RowType extends BaseGridRow> {
  message: (
    selectedRows: RowType[],
    cellEditorParams: ICellEditorParams,
  ) => Promise<string | JSX.Element> | string | JSX.Element;
}

export const GridFormMessage = <RowType extends BaseGridRow>(props: MyFormProps) => {
  const { colDef } = props.cellEditorParams;
  const formProps: GridFormMessageProps<RowType> = colDef.cellEditorParams;
  const { getSelectedRows } = useContext(GridContext);

  const [message, setMessage] = useState<string | JSX.Element | null>(null);
  const { popoutWrapper } = useGridPopoutHook(props.cellEditorParams);

  useEffect(() => {
    (async () => {
      setMessage(await formProps.message(getSelectedRows(), props.cellEditorParams));
    })().then();
  }, [formProps, getSelectedRows, props]);

  return popoutWrapper(
    <ComponentLoadingWrapper loading={message === null}>
      <div style={{ maxWidth: 400, padding: 16 }}>{message}</div>
    </ComponentLoadingWrapper>,
  );
};
