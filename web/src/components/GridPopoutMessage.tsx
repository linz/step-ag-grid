import "@szhsin/react-menu/dist/index.css";

import { GridPopoutComponent } from "./GridPopout";
import { useContext, useEffect, useRef, useState } from "react";
import { UpdatingContext } from "../contexts/UpdatingContext";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";

export interface GridPopoutCellEditorParams<RowType> {
  message: (data: RowType) => Promise<JSX.Element> | JSX.Element;
}

export interface GridPopoutMessageColDef<RowType> extends ColDef {
  cellEditorParams: GridPopoutCellEditorParams<RowType>;
}

export const GridPopoutMessage = <RowType extends unknown>(props: GridPopoutMessageColDef<RowType>): ColDef => ({
  ...props,
  editable: true,
  cellEditor: GridPopoutMessageComponent,
});

interface GridPopoutICellEditorParams<RowType> extends ICellEditorParams {
  data: RowType;
  colDef: {
    cellEditorParams: GridPopoutCellEditorParams<RowType>;
  } & ColDef;
}

/**
 * Pops out a message box on editing a cell.
 * This is not really an edit but requires the cell to be in editing state to display.
 */
export const GridPopoutMessageComponent = <RowType extends unknown>(props: GridPopoutICellEditorParams<RowType>) => {
  const { modifyUpdating } = useContext(UpdatingContext);
  const loading = useRef<boolean>();
  const [message, setMessage] = useState<JSX.Element>();

  useEffect(() => {
    if (loading.current != null) return;
    loading.current = true;

    (async () => {
      setMessage(await props.colDef.cellEditorParams.message(props.data));
      loading.current = false;
    })();
  }, [modifyUpdating, props]);

  const children = (
    <div onClick={() => props.api.stopEditing()}>
      <ComponentLoadingWrapper loading={message == null}>
        <div style={{ maxWidth: 400, padding: 16 }}>{message}</div>
      </ComponentLoadingWrapper>
    </div>
  );
  return GridPopoutComponent(props, { children });
};
