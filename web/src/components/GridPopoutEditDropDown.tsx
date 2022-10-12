import "@szhsin/react-menu/dist/index.css";

import { MenuItem, MenuDivider, FocusableItem } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useEffect, useRef, useState, KeyboardEvent } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./AgGrid";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { AgGridContext } from "../contexts/AgGridContext";
import { delay } from "lodash-es";

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
  multiEdit: boolean;
  filtered?: boolean;
  filterPlaceholder?: string;
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
    field: string;
    cellEditorParams: GridPopoutEditDropDownProps<RowType, ValueType>;
  };
}

export const GridPopoutEditDropDownComp = <RowType extends BaseAgGridRow, ValueType>(
  props: GridPopoutEditDropDownICellEditorParams<RowType, ValueType>,
) => {
  const { api, data } = props;
  const { cellEditorParams, field } = props.colDef;
  const { multiEdit } = cellEditorParams;

  const { updatingCells, stopEditing } = useContext(AgGridContext);

  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[]>();

  const selectItemHandler = useCallback(
    async (value: ValueType): Promise<boolean> => {
      return await updatingCells({ data, field, multiEdit }, async (selectedRows) => {
        const hasChanged = selectedRows.some((row) => row[field as keyof RowType] !== value);
        if (hasChanged) {
          if (cellEditorParams?.onSelectedItem) {
            await cellEditorParams.onSelectedItem({ selectedRows, value });
          } else {
            selectedRows.forEach((row) => (row[field as keyof RowType] = value));
          }
        }
        return true;
      });
    },
    [cellEditorParams, data, field, multiEdit, updatingCells],
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

  const onFilterKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (!options) return;
      if (e.key == "Enter" || e.key == "Tab") {
        const activeOptions = options.filter((option) => !filteredValues.includes(option.value));
        if (activeOptions.length == 1) {
          await selectItemHandler(activeOptions[0].value);
          stopEditing();
        } else {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    },
    [filteredValues, options, selectItemHandler, stopEditing],
  );

  const children = (
    <ComponentLoadingWrapper loading={!options}>
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
                    onKeyDown={(e) => onFilterKeyDown(e)}
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
            <MenuItem
              key={`${item.value}`}
              value={item.value}
              onClick={() => selectItemHandler(item.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  selectItemHandler(item.value).then(() => {
                    stopEditing();
                  });
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
            </MenuItem>
          ),
        )}
      </>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children });
};
