import "@szhsin/react-menu/dist/index.css";

import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./AgGrid";

export interface GridPopoutEditTextAreaProps<RowType> {
  multiEdit?: boolean;
  onSave?: (selectRows: RowType[], value: string) => boolean;
}

export interface GridPopoutEditTextAreaColDef<RowType> extends ColDef {
  cellEditorParams: GridPopoutEditTextAreaProps<RowType>;
}

export const GridPopoutEditTextArea = <RowType extends BaseAgGridRow, ValueType>(
  props: GridPopoutEditTextAreaColDef<RowType>,
): ColDef => ({
  ...props,
  editable: props.editable !== undefined ? props.editable : true,
  cellEditor: GridPopoutEditTextAreaComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GridPopoutICellEditorParams<RowType> extends ICellEditorParams {
  colDef: {
    cellEditorParams: GridPopoutEditTextAreaProps<RowType>;
  } & ColDef;
}

const GridPopoutEditTextAreaComp = <RowType extends BaseAgGridRow>(props: GridPopoutICellEditorParams<RowType>) => {
  const { data, api } = props;
  const { field, cellEditorParams } = props.colDef;
  const [value, setValue] = useState<string>(props.data[field as keyof RowType]);

  const defaultSave = useCallback(
    (value: string): boolean => {
      let selectedRows = api.getSelectedRows() as RowType[];
      if (!cellEditorParams?.multiEdit) {
        // You can't use data as it could be an orphaned reference due to updates
        selectedRows = selectedRows.filter((row) => row.id === data.id);
      }

      if (cellEditorParams?.onSave) {
        return cellEditorParams.onSave(selectedRows, value);
      }

      selectedRows.forEach((row) => {
        row[field as keyof RowType] = value as any;
      });

      return true;
    },
    [api, cellEditorParams, data.id, field],
  );

  const children = (
    <div>
      <textarea cols={40} rows={5} onChange={(e) => setValue(e.target.value)}>
        {value}
      </textarea>
    </div>
  );
  return GridPopoutComponent(props, { children, canClose: () => defaultSave(value) });
};
