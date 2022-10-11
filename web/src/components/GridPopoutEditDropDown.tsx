import "@szhsin/react-menu/dist/index.css";

import { MenuItem, MenuDivider } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./AgGrid";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { AgGridContext } from "../contexts/AgGridContext";

export interface GridPopoutEditDropDownSelectedItem<RowType, ValueType> {
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

export interface GridPopoutEditDropDownProps<RowType, ValueType> {
  multiEdit?: boolean;
  onSelectedItem?: (props: GridPopoutEditDropDownSelectedItem<RowType, ValueType>) => Promise<void>;
  options:
    | SelectOption<ValueType>[]
    | ((selectedRows: RowType[]) => Promise<SelectOption<ValueType>[]> | SelectOption<ValueType>[]);
}

export interface GridDropDownColDef<RowType, ValueType> extends ColDef {
  cellEditorParams?: GridPopoutEditDropDownProps<RowType, ValueType>;
}

export const GridPopoutEditDropDown = <RowType extends BaseAgGridRow, ValueType>(
  props: GridDropDownColDef<RowType, ValueType>,
): ColDef => ({
  ...props,
  editable: props.editable !== undefined ? props.editable : true,
  cellEditor: GridPopoutEditDropDownComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GridPopoutEditDropDownICellEditorParams<RowType extends BaseAgGridRow, ValueType> extends ICellEditorParams {
  data: RowType;
  colDef: {
    field: string | undefined;
    cellEditorParams: GridPopoutEditDropDownProps<RowType, ValueType>;
  };
}

export const GridPopoutEditDropDownComp = <RowType extends BaseAgGridRow, ValueType>(
  props: GridPopoutEditDropDownICellEditorParams<RowType, ValueType>,
) => {
  const { api } = props;
  const { cellEditorParams } = props.colDef;
  const field = props.colDef.field ?? "";

  const { updatingCells } = useContext(AgGridContext);
  const initialValue = useRef(props.data[field as keyof RowType] as ValueType);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[]>();

  const selectItemHandler = useCallback(
    async (value: ValueType): Promise<boolean> => {
      if (value === initialValue.current) return true; // Nothing changed
      return await updatingCells(props, async (selectedRows) => {
        if (cellEditorParams?.onSelectedItem) {
          await cellEditorParams.onSelectedItem({ selectedRows, value });
        } else {
          selectedRows.forEach((row) => (row[field as keyof RowType] = value));
        }
        return true;
      });
    },
    [cellEditorParams, field, props, updatingCells],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    let optionsConf = cellEditorParams?.options ?? [];

    (async () => {
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
      optionsInitialising.current = false;
    })();
  }, [api, cellEditorParams?.options, field, options]);

  const children = (
    <ComponentLoadingWrapper loading={!options}>
      <>
        {options?.map((item) =>
          item.value === MenuSeparatorString ? (
            <MenuDivider />
          ) : (
            <MenuItem key={`${item.value}`} value={item.value} onClick={() => selectItemHandler(item.value)}>
              {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
            </MenuItem>
          ),
        )}
      </>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children });
};
