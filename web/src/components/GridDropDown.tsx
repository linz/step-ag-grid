import "@szhsin/react-menu/dist/index.css";

import { MenuItem } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopout } from "./GridPopout";
import { useCallback, useEffect, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { LuiMiniSpinner } from "@linzjs/lui";

export interface BaseRow {
  id: string | number;
}

export interface GridDropDownSelectedItem<RowType, ValueType> {
  selectedRows: RowType[];
  value: ValueType;
}

interface FinalSelectOption<ValueType> {
  value: ValueType;
  label?: JSX.Element | string;
}

export const MenuSeparatorString = "_____MENU_SEPARATOR_____";
export const MenuSeparator = Object.freeze({ value: MenuSeparatorString });

export type SelectOption<ValueType> = ValueType | FinalSelectOption<ValueType>;

export interface GridDropDownProps<RowType, ValueType> {
  multiEdit?: boolean;
  onSelectedItem?: (props: GridDropDownSelectedItem<RowType, ValueType>) => void;
  options:
    | SelectOption<ValueType>[]
    | ((selectedRows: RowType[]) => Promise<SelectOption<ValueType>[]> | SelectOption<ValueType>[]);
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
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[]>();

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

  useEffect(() => {
    (async () => {
      let optionsConf = colDef.cellEditorParams?.options ?? [];

      if (typeof optionsConf == "function") {
        optionsConf = await optionsConf(api.getSelectedRows());
      }

      const optionsList = optionsConf?.map((item) => {
        if (item == null || typeof item == "string" || typeof item == "number") {
          item = { value: item as ValueType } as FinalSelectOption<ValueType>;
        }
        return item;
      }) as any as FinalSelectOption<ValueType>[];

      setOptions(optionsList);
    })();
  }, [api, colDef.cellEditorParams?.options]);

  const children = (
    <>
      {options ? (
        options.map((item) =>
          item.value === MenuSeparatorString ? (
            <hr />
          ) : (
            <MenuItem key={`${item.value}`} value={item.value} onClick={() => selectItemHandler(item.value)}>
              {item.label ?? item.value == null ? `<${item.value}>` : `${item.value}`}
            </MenuItem>
          ),
        )
      ) : (
        <LuiMiniSpinner size={22} divProps={{ role: "status", ["aria-label"]: "Loading" }} />
      )}
    </>
  );
  return GridPopout({ ...props, children });
};
