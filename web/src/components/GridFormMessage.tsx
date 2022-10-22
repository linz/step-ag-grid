import { useCallback, useContext, useEffect, useState } from "react";
import { GridGenericCellEditorFormContextParams } from "./GridGenericCellEditor";
import { ICellEditorParams } from "ag-grid-community";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { BaseGridRow } from "./Grid";
import { GridContext } from "../contexts/GridContext";

export interface GridFormMessageProps<RowType extends BaseGridRow> {
  message: (
    selectedRows: RowType[],
    cellEditorParams: ICellEditorParams,
  ) => Promise<string | JSX.Element> | string | JSX.Element;
}

export const GridFormMessage = <RowType extends BaseGridRow>(props: GridFormMessageProps<RowType>): JSX.Element => {
  const { getSelectedRows } = useContext(GridContext);
  const { saveRef, cellEditorParamsRef } = props as any as GridGenericCellEditorFormContextParams;
  saveRef.current = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const [message, setMessage] = useState<string | JSX.Element | null>(null);

  useEffect(() => {
    (async () => {
      setMessage(await props.message(getSelectedRows(), cellEditorParamsRef.current));
    })().then();
  }, [cellEditorParamsRef, props]);

  return (
    <ComponentLoadingWrapper loading={message === null}>
      <div style={{ maxWidth: 400, padding: 16 }}>{message}</div>
    </ComponentLoadingWrapper>
  );
};
