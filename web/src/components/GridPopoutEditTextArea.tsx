import "@szhsin/react-menu/dist/index.css";

import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./AgGrid";
import { AgGridContext } from "../contexts/AgGridContext";

export interface GridPopoutEditTextAreaProps<RowType> {
  multiEdit?: boolean;
  onSave?: (selectRows: RowType[], value: string) => Promise<boolean> | boolean;
}

export interface GridPopoutEditTextAreaColDef<RowType> extends ColDef {
  cellEditorParams: GridPopoutEditTextAreaProps<RowType>;
}

/**
 * For editing a text area.
 */
export const GridPopoutEditTextArea = <RowType extends BaseAgGridRow, ValueType>(
  props: GridPopoutEditTextAreaColDef<RowType>,
): ColDef => ({
  ...props,
  editable: props.editable ?? true,
  cellEditor: GridPopoutEditTextAreaComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GridPopoutICellEditorParams<RowType extends BaseAgGridRow> extends ICellEditorParams {
  data: RowType;
  colDef: {
    field: string | undefined;
    cellEditorParams: GridPopoutEditTextAreaProps<RowType>;
  };
}

const GridPopoutEditTextAreaComp = <RowType extends BaseAgGridRow>(props: GridPopoutICellEditorParams<RowType>) => {
  const { cellEditorParams } = props.colDef;
  const field = props.colDef.field ?? "";

  const { updatingCells } = useContext(AgGridContext);

  const initialValue = useRef(props.data[field as keyof RowType] as string);
  const [value, setValue] = useState(initialValue.current);
  const [saving, setSaving] = useState(false);

  const updateValue = useCallback(
    async (value: string): Promise<boolean> => {
      // Nothing changed
      if (value === initialValue.current) return true;
      return await updatingCells(
        props,
        async (selectedRows) => {
          if (cellEditorParams?.onSave) {
            return cellEditorParams.onSave(selectedRows, value);
          }
          selectedRows.forEach((row) => (row[field as keyof RowType] = value));
          return true;
        },
        setSaving,
      );
    },
    [cellEditorParams, field, props, updatingCells],
  );

  const children = (
    <div>
      <textarea cols={40} rows={5} onChange={(e) => setValue(e.target.value)} disabled={saving} defaultValue={value} />
    </div>
  );
  return GridPopoutComponent(props, { children, canClose: () => updateValue(value) });
};
