import "@szhsin/react-menu/dist/index.css";

import { GridPopoutComponent } from "./GridPopout";
import { useContext, useEffect, useRef, useState } from "react";
import { UpdatingContext } from "../contexts/UpdatingContext";
import { ColDef, ICellEditorParams } from "ag-grid-community";

export interface GridPopoutCellEditorParams<RowType> {
  message: (data: RowType) => JSX.Element;
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

export const GridPopoutMessageComponent = <RowType extends unknown>(props: GridPopoutICellEditorParams<RowType>) => {
  const { modifyUpdating } = useContext(UpdatingContext);
  const loading = useRef<boolean>();
  const [message, setMessage] = useState<JSX.Element>();

  useEffect(() => {
    if (loading.current != null) return;
    const data = props.data;
    loading.current = true;

    (async () => {
      await modifyUpdating(
        props.colDef.field ?? "",
        props.api.getSelectedRows().map((data) => data.id),
        async () => {
          setMessage(await props.colDef.cellEditorParams.message(data));
        },
      );
      loading.current = false;
    })();
  }, [modifyUpdating, props]);

  const children = (
    <div style={{ maxWidth: 400, padding: 16 }} onClick={() => props.api.stopEditing()}>
      {message}
    </div>
  );
  return GridPopoutComponent(props, { children });
};
