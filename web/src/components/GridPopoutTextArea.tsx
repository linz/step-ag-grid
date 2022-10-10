import "@szhsin/react-menu/dist/index.css";

import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopout } from "./GridPopout";
import { useCallback, useState } from "react";
import { BaseRow } from "./GridDropDown";
import { GenericMultiEditCellClass } from "./GenericCellClass";

export interface GridPopoutMessageProps<RowType> {
  multiEdit?: boolean;
  onSave?: (selectRows: RowType[], value: string) => boolean;
}

export interface GridPopoutMessageColDef<RowType> extends ColDef {
  cellEditorParams?: GridPopoutMessageProps<RowType>;
}

export const GridPopoutTextArea = <RowType extends BaseRow, ValueType>(
  props: GridPopoutMessageColDef<RowType>,
): ColDef => ({
  ...props,
  editable: props.editable !== undefined ? props.editable : true,
  cellEditor: GridPopoutTextAreaComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

export const GridPopoutTextAreaComp = <RowType extends BaseRow>(props: ICellEditorParams) => {
  const { data, api } = props;
  const { field, cellEditorParams } = props.colDef as GridPopoutMessageColDef<RowType>;
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
  return GridPopout({ ...props, children, canClose: () => defaultSave(value) });
};
