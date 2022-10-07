import "@szhsin/react-menu/dist/index.css";

import { MenuItem } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopout } from "./GridPopout";
import { useCallback } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";

export interface GridDropDownSelectedItem {
  selectedRows: any[];
  value: any;
}

export interface SelectOption {
  value: any;
  label?: JSX.Element | string;
}

export interface GridDropDownProps {
  multiEdit?: boolean;
  onSelectedItem?: (props: GridDropDownSelectedItem) => void;
  options: SelectOption[] | any[];
}

export interface GridDropDownColDef extends ColDef {
  cellEditorParams?: GridDropDownProps;
}

export const GridDropDown = (props: GridDropDownColDef): ColDef => ({
  ...props,
  editable: props.editable !== undefined ? props.editable : true,
  cellEditor: GridDropDownComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

export const GridDropDownComp = (props: ICellEditorParams) => {
  const { data, api } = props;
  const colDef = props.colDef as GridDropDownColDef;

  const selectItemHandler = useCallback(
    (value: any) => {
      let selectedRows = api.getSelectedRows();
      if (!colDef.cellEditorParams?.multiEdit) {
        // You can't use data as it could be an orphaned reference due to updates
        selectedRows = selectedRows.filter((row) => row.id == data.id);
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
        row[field] = value;
      });
      api.refreshCells();
    },
    [api, colDef, data],
  );

  const children = (
    <>
      {colDef.cellEditorParams?.options.map((item) => {
        if (typeof item !== "object") {
          item = { value: item };
        }
        return (
          <MenuItem key={item.value} value={item.value} onClick={() => selectItemHandler(item.value)}>
            {item.label ?? item.value}
          </MenuItem>
        );
      })}
    </>
  );
  return GridPopout({ ...props, children });
};
