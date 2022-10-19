import "@szhsin/react-menu/dist/index.css";

import { MenuItem, MenuDivider, FocusableItem } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseGridRow } from "./Grid";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { GridContext } from "../contexts/GridContext";
import { delay } from "lodash-es";
import { LuiCheckboxInput } from "@linzjs/lui";

interface FinalSelectOption<ValueType> {
  value: ValueType;
  label?: JSX.Element | string;
  subComponent?: (props: any, ref: any) => any;
}

export const MenuSeparatorString = "_____MENU_SEPARATOR_____";
export const MenuSeparator = Object.freeze({ value: MenuSeparatorString });

export type SelectOption<ValueType> = ValueType | FinalSelectOption<ValueType>;

export interface MultiSelectResult<RowType> {
  selectedRows: RowType[];
  values: Record<string, any>;
}

export interface GridPopoutEditMultiSelectProps<RowType, ValueType> {
  multiEdit: boolean;
  filtered?: boolean;
  filterPlaceholder?: string;
  onSave?: (props: MultiSelectResult<RowType>) => Promise<boolean>;
  options:
    | SelectOption<ValueType>[]
    | ((selectedRows: RowType[]) => Promise<SelectOption<ValueType>[]> | SelectOption<ValueType>[]);
}

export interface GridDropDownColDef<RowType, ValueType> extends ColDef {
  cellEditorParams?: GridPopoutEditMultiSelectProps<RowType, ValueType>;
}

export const GridPopoutEditMultiSelect = <RowType extends BaseGridRow, ValueType>(
  props: GridDropDownColDef<RowType, ValueType>,
): ColDef => ({
  ...props,
  editable: props.editable !== undefined ? props.editable : true,
  cellEditor: GridPopoutEditMultiSelectComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GridPopoutEditMultiSelectICellEditorParams<RowType extends BaseGridRow, ValueType> extends ICellEditorParams {
  data: RowType;
  colDef: {
    field: string;
    cellEditorParams: GridPopoutEditMultiSelectProps<RowType, ValueType>;
  };
}

export const GridPopoutEditMultiSelectComp = <RowType extends BaseGridRow, ValueType>(
  props: GridPopoutEditMultiSelectICellEditorParams<RowType, ValueType>,
) => {
  const { api, data } = props;
  const { cellEditorParams, field } = props.colDef;
  const { multiEdit } = cellEditorParams;

  const { updatingCells } = useContext(GridContext);

  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[]>();
  const subSelectedValues = useRef<Record<string, any>>({});
  const [selectedValues, setSelectedValues] = useState<any[]>([]);

  const onSave = useCallback(async (): Promise<boolean> => {
    const values: Record<string, any> = {};
    selectedValues.forEach((value) => {
      values[value] = subSelectedValues.current[value] ?? true;
    });

    return await updatingCells(
      { data, field, multiEdit },
      async (selectedRows) => {
        if (!cellEditorParams.onSave) return true;
        return cellEditorParams.onSave({ selectedRows, values });
      },
      setSaving,
    );
  }, [cellEditorParams, data, field, multiEdit, selectedValues, updatingCells]);

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
          item = { value: item as ValueType, label: item } as FinalSelectOption<ValueType>;
        }
        return item;
      }) as any as FinalSelectOption<ValueType>[];

      if (cellEditorParams.filtered) {
        // This is needed otherwise when filter input is rendered and sets autofocus
        // the mouse up of the double click edit triggers the cell to cancel editing
        delay(() => setOptions(optionsList), 100);
      } else {
        setOptions(optionsList);
      }
      optionsInitialising.current = false;
    })();
  }, [api, cellEditorParams.filtered, cellEditorParams?.options, field, options]);

  useEffect(() => {
    if (!cellEditorParams.filtered || options == null) return;
    setFilteredValues(
      options
        .map((option) => {
          if (option.label != null && typeof option.label !== "string") {
            console.error("Cannot filter non-string labels", option);
            return undefined;
          }
          const str = (option.label as string) || "";
          return str.toLowerCase().indexOf(filter) === -1 ? option.value : undefined;
        })
        .filter((r) => r !== undefined),
    );
  }, [cellEditorParams.filtered, filter, options]);

  const children = (
    <ComponentLoadingWrapper loading={!options} saving={saving}>
      <>
        {options && cellEditorParams.filtered && (
          <>
            <FocusableItem className={"filter-item"}>
              {({ ref }: any) => (
                <div style={{ display: "flex", width: "100%" }}>
                  <input
                    autoFocus
                    className={"free-text-input"}
                    style={{ border: "0px" }}
                    ref={ref}
                    type="text"
                    placeholder={cellEditorParams.filterPlaceholder ?? "Placeholder"}
                    data-testid={"filteredMenu-free-text-input"}
                    defaultValue={""}
                    onChange={(e) => setFilter(e.target.value.toLowerCase())}
                  />
                </div>
              )}
            </FocusableItem>
            <MenuDivider key={`$$divider_filter`} />
          </>
        )}
        {options?.map((item, index) =>
          item.value === MenuSeparatorString ? (
            <MenuDivider key={`$$divider_${index}`} />
          ) : filteredValues.includes(item.value) ? null : (
            <>
              <MenuItem
                key={`${item.value}`}
                onClick={(e) => {
                  e.keepOpen = true;
                  // onSelectMenuOption(itemIndex, e.value);
                  return false;
                }}
              >
                <LuiCheckboxInput
                  isChecked={selectedValues.includes(item.value)}
                  value={`${item.value}`}
                  label={item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedValues([...selectedValues, item.value as string]);
                    } else {
                      setSelectedValues(selectedValues.filter((value) => value != item.value));
                    }
                  }}
                />
              </MenuItem>
              <FocusableItem className={"LuiDeprecatedForms"} key={`${item.value}_subcomponent`}>
                {(ref) =>
                  selectedValues.includes(item.value) &&
                  item.subComponent &&
                  item.subComponent(
                    {
                      setValue: (value: any) => {
                        subSelectedValues.current[item.value as string] = value;
                      },
                    },
                    ref,
                  )
                }
              </FocusableItem>
            </>
          ),
        )}
      </>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children, canClose: () => onSave() });
};
