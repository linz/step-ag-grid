import "@szhsin/react-menu/dist/index.css";

import { MenuItem } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopout } from "./GridPopout";
import { useCallback } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";

export interface BaseRow {
  id: string | number;
}

export interface GridDropDownSelectedItem<RowType, ValueType> {
  selectedRows: RowType[];
  value: ValueType;
}

export interface SelectOption<ValueType> {
  value: ValueType;
  label?: JSX.Element | string;
}

export interface GridDropDownProps<RowType, ValueType> {
  multiEdit?: boolean;
  onSelectedItem?: (props: GridDropDownSelectedItem<RowType, ValueType>) => void;
  options: SelectOption<ValueType>[] | ValueType[];
}

export interface GridDropDownColDef<RowType, ValueType> extends ColDef {
  cellEditorParams?: GridDropDownProps<RowType, ValueType>;
}

export const GridDropDown = <RowType extends BaseRow, ValueType>(
  props: GridDropDownColDef<RowType, ValueType>,
): ColDef => ({
  ...props,
  editable: props.editable !== undefined ? props.editable : true,
  cellEditor: GridDropDownComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

export const GridDropDownComp = <RowType extends BaseRow, ValueType>(props: ICellEditorParams) => {
  const { data, api } = props;
  const colDef = props.colDef as GridDropDownColDef<RowType, ValueType>;

  const selectItemHandler = useCallback(
    (value: any) => {
      let selectedRows = api.getSelectedRows() as RowType[];
      if (!colDef.cellEditorParams?.multiEdit) {
        // You can't use data as it could be an orphaned reference due to updates
        selectedRows = selectedRows.filter((row) => row.id === data.id);
      }

      if (colDef.cellEditorParams?.onSelectedItem) {
        colDef.cellEditorParams.onSelectedItem({ selectedRows, value });
        return;
      }
      const field = colDef.field;
      if (!field) {
        console.error("Cannot update cell as field is not defined in colDef: ", colDef);
        return;
      }
      selectedRows.forEach((row) => {
        row[field as keyof RowType] = value;
      });
    },
    [api, colDef, data],
  );

  const options = colDef.cellEditorParams?.options?.map((item) => {
    if (item == null || typeof item !== "object") {
      item = { value: item as ValueType } as SelectOption<ValueType>;
    }
    return item;
  }) as any as SelectOption<ValueType>[];

  const children = (
    <>
      {options.map((item) => {
        return (
          <MenuItem key={`${item.value}`} value={item.value} onClick={() => selectItemHandler(item.value)}>
            {item.label ?? item.value == null ? `<${item.value}>` : `${item.value}`}
          </MenuItem>
        );
      })}
    </>
  );
  return GridPopout({ ...props, children });
};
