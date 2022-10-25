import "@szhsin/react-menu/dist/index.css";

import { MenuItem, MenuDivider, FocusableItem } from "@szhsin/react-menu";
import { useCallback, useContext, useEffect, useRef, useState, KeyboardEvent } from "react";
import { BaseGridRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridContext } from "../../contexts/GridContext";
import { delay } from "lodash-es";
import debounce from "debounce-promise";
import { GridFormProps } from "../GridCell";
import { useGridPopoutHook } from "../GridPopoutHook";

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

export interface GridFormPopoutDropDownProps<RowType, ValueType> {
  filtered?: "local" | "reload";
  filterPlaceholder?: string;
  onSelectedItem?: (props: GridPopoutEditDropDownSelectedItem<RowType, ValueType>) => Promise<void>;
  options:
    | SelectOption<ValueType>[]
    | ((selectedRows: RowType[], filter?: string) => Promise<SelectOption<ValueType>[]> | SelectOption<ValueType>[]);
  optionsRequestCancel?: () => void;
}

export const GridFormDropDown = <RowType extends BaseGridRow, ValueType>(props: GridFormProps) => {
  const { getSelectedRows } = useContext(GridContext);
  const { popoutWrapper } = useGridPopoutHook(props);

  const { cellEditorParams } = props;
  const { data, colDef } = cellEditorParams;
  const formProps: GridFormPopoutDropDownProps<RowType, ValueType> = colDef.cellEditorParams;
  const field = colDef.field ?? colDef.colId ?? "";
  const { multiEdit } = colDef.cellEditorParams;

  const { updatingCells, stopEditing } = useContext(GridContext);

  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[] | null>(null);

  const selectItemHandler = useCallback(
    async (value: ValueType): Promise<boolean> => {
      return await updatingCells({ data, field, multiEdit }, async (selectedRows) => {
        const hasChanged = selectedRows.some((row) => row[field as keyof RowType] !== value);
        if (hasChanged) {
          if (formProps.onSelectedItem) {
            await formProps.onSelectedItem({ selectedRows, value });
          } else {
            selectedRows.forEach((row) => (row[field as keyof RowType] = value));
          }
        }
        return true;
      });
    },
    [data, field, formProps, multiEdit, updatingCells],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    let optionsConf = formProps.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        optionsConf = await optionsConf(getSelectedRows(), filter);
      }

      const optionsList = optionsConf?.map((item) => {
        if (item == null || typeof item == "string" || typeof item == "number") {
          item = { value: item as ValueType, label: item } as FinalSelectOption<ValueType>;
        }
        return item;
      }) as any as FinalSelectOption<ValueType>[];

      if (formProps.filtered) {
        // This is needed otherwise when filter input is rendered and sets autofocus
        // the mouse up of the double click edit triggers the cell to cancel editing
        delay(() => setOptions(optionsList), 100);
      } else {
        setOptions(optionsList);
      }
      optionsInitialising.current = false;
    })();
  }, [filter, getSelectedRows, options, formProps.filtered, formProps.options]);

  // Local filtering
  useEffect(() => {
    if (formProps.filtered == "local") {
      if (options == null) return;
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
    }
  }, [formProps.filtered, filter, options]);

  const researchOnFilterChange = debounce(
    useCallback(() => {
      setOptions(null);
    }, []),
    500,
  );

  const previousFilter = useRef<string>(filter);

  // Reload filtering
  useEffect(() => {
    if (previousFilter.current != filter && formProps.filtered == "reload") {
      previousFilter.current = filter;
      formProps.optionsRequestCancel && formProps.optionsRequestCancel();
      researchOnFilterChange().then();
    }
  }, [filter, formProps, props, researchOnFilterChange]);

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

  return popoutWrapper(
    <>
      {formProps.filtered && (
        <>
          <FocusableItem className={"filter-item"} index={-1}>
            {({ ref }: any) => (
              <div style={{ display: "flex", width: "100%" }}>
                <input
                  autoFocus
                  className={"free-text-input"}
                  style={{ border: "0px" }}
                  ref={ref}
                  type="text"
                  placeholder={formProps.filterPlaceholder ?? "Placeholder"}
                  data-testid={"filteredMenu-free-text-input"}
                  defaultValue={filter}
                  onChange={(e) => setFilter(e.target.value.toLowerCase())}
                  onKeyDown={(e) => onFilterKeyDown(e)}
                />
              </div>
            )}
          </FocusableItem>
          <MenuDivider key={`$$divider_filter`} />
        </>
      )}
      <ComponentLoadingWrapper loading={!options}>
        <>
          {options && options.length == filteredValues?.length && <MenuItem>[Empty]</MenuItem>}
          {options?.map((item, index) =>
            item.value === MenuSeparatorString ? (
              <MenuDivider key={`$$divider_${index}`} />
            ) : filteredValues.includes(item.value) ? null : (
              <MenuItem key={`${item.value}`} value={item.value} onClick={() => selectItemHandler(item.value)}>
                {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
              </MenuItem>
            ),
          )}
        </>
      </ComponentLoadingWrapper>
    </>,
  );
};