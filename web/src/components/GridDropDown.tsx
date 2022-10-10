import "@szhsin/react-menu/dist/index.css";

import { MenuItem, MenuDivider } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopout } from "./GridPopout";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { LuiMiniSpinner } from "@linzjs/lui";
import { UpdatingContext } from "../contexts/UpdatingContext";

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
  onSelectedItem?: (props: GridDropDownSelectedItem<RowType, ValueType>) => Promise<void>;
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
  const { cellEditorParams } = props.colDef as GridDropDownColDef<RowType, ValueType>;
  const field = props.colDef.field ?? "";

  const { modifyUpdating } = useContext(UpdatingContext);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[]>();

  const selectItemHandler = useCallback(
    async (value: any) => {
      let selectedRows = api.getSelectedRows() as RowType[];
      if (!cellEditorParams?.multiEdit) {
        // You can't use data as it could be an orphaned reference due to updates
        selectedRows = selectedRows.filter((row) => row.id === data.id);
      }

      if (cellEditorParams?.onSelectedItem) {
        await modifyUpdating(
          field,
          selectedRows.map((data) => data.id),
          () => cellEditorParams.onSelectedItem && cellEditorParams.onSelectedItem({ selectedRows, value }),
        );
        return;
      }

      selectedRows.forEach((row) => {
        row[field as keyof RowType] = value;
      });
    },
    [api, cellEditorParams, data.id, field, modifyUpdating],
  );

  useEffect(() => {
    (async () => {
      if (options || optionsInitialising.current) return;

      optionsInitialising.current = true;
      let optionsConf = cellEditorParams?.options ?? [];

      if (typeof optionsConf == "function") {
        await modifyUpdating(
          field,
          api.getSelectedRows().map((data) => data.id),
          async () => {
            if (typeof optionsConf == "function") {
              optionsConf = await optionsConf(api.getSelectedRows());
            }
          },
        );
      }

      const optionsList = (optionsConf as SelectOption<ValueType>[])?.map((item) => {
        if (item == null || typeof item == "string" || typeof item == "number") {
          item = { value: item as ValueType } as FinalSelectOption<ValueType>;
        }
        return item;
      }) as any as FinalSelectOption<ValueType>[];

      setOptions(optionsList);
      optionsInitialising.current = false;
    })();
  }, [api, cellEditorParams?.options, field, modifyUpdating]);

  const children = (
    <>
      {options ? (
        options.map((item) =>
          item.value === MenuSeparatorString ? (
            <MenuDivider />
          ) : (
            <MenuItem key={`${item.value}`} value={item.value} onClick={() => selectItemHandler(item.value)}>
              {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
            </MenuItem>
          ),
        )
      ) : (
        <div style={{ padding: "4px 10px" }}>
          <LuiMiniSpinner size={22} divProps={{ role: "status", ["aria-label"]: "Loading" }} />
        </div>
      )}
    </>
  );
  return GridPopout({ ...props, children });
};
