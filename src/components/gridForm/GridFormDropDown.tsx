import "../../react-menu3/styles/index.scss";

import { MenuItem, MenuDivider, FocusableItem, MenuHeader } from "@react-menu3";
import { useCallback, useContext, useEffect, useRef, useState, KeyboardEvent } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridContext } from "@contexts/GridContext";
import { delay } from "lodash-es";
import debounce from "debounce-promise";
import { GenericCellEditorParams, GridFormProps } from "../GridCell";
import { useGridPopoverHook } from "../GridPopoverHook";

export interface GridPopoutEditDropDownSelectedItem<RowType, ValueType> {
  selectedRows: RowType[];
  value: ValueType;
}

interface FinalSelectOption<ValueType> {
  value: ValueType;
  label?: JSX.Element | string;
  disabled?: boolean | string;
}

export const MenuSeparatorString = "_____MENU_SEPARATOR_____";
export const MenuSeparator = Object.freeze({ value: MenuSeparatorString });

export const MenuHeaderString = "_____MENU_HEADER_____";
export const MenuHeaderItem = (title:string)=> {
  return {label: title, value: MenuHeaderString }
}

export type SelectOption<ValueType> = ValueType | FinalSelectOption<ValueType>;

export interface GridFormPopoutDropDownProps<RowType extends GridBaseRow, ValueType>
  extends GenericCellEditorParams<RowType> {
  filtered?: "local" | "reload";
  filterPlaceholder?: string;
  onSelectedItem?: (props: GridPopoutEditDropDownSelectedItem<RowType, ValueType>) => Promise<void>;
  onSelectFilter?: (props: GridPopoutEditDropDownSelectedItem<RowType, string>) => Promise<void>;
  options:
    | SelectOption<ValueType>[]
    | ((selectedRows: RowType[], filter?: string) => Promise<SelectOption<ValueType>[]> | SelectOption<ValueType>[]);
  optionsRequestCancel?: () => void;
}

export const GridFormDropDown = <RowType extends GridBaseRow, ValueType>(props: GridFormProps<RowType>) => {
  const { popoverWrapper } = useGridPopoverHook(props);
  const formProps = props.formProps as GridFormPopoutDropDownProps<RowType, ValueType>;

  const { updatingCells, stopEditing } = useContext(GridContext);

  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[] | null>(null);

  const selectItemHandler = useCallback(
    async (value: ValueType): Promise<boolean> => {
      const field = props.field;
      return await updatingCells({ selectedRows: props.selectedRows, field }, async (selectedRows) => {
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
    [formProps, props.field, props.selectedRows, updatingCells],
  );

  const selectFilterHandler = useCallback(
    async (value: string): Promise<boolean> => {
      const field = props.field;
      return await updatingCells({ selectedRows: props.selectedRows, field }, async (selectedRows) => {
        if (formProps.onSelectFilter) {
          await formProps.onSelectFilter({ selectedRows, value });
        }
        return true;
      });
    },
    [formProps, props.field, props.selectedRows, updatingCells],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    let optionsConf = formProps.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        optionsConf = await optionsConf(props.selectedRows, filter);
      }

      const optionsList = optionsConf?.map((item) => {
        if (item == null || typeof item == "string" || typeof item == "number") {
          item = { value: item as ValueType, label: item, disabled: false } as FinalSelectOption<ValueType>;
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
  }, [filter, options, formProps.filtered, formProps.options, props.selectedRows]);

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
        } else if (formProps.onSelectFilter) {
          await selectFilterHandler(filter);
          stopEditing();
        } else {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    },
    [filteredValues, options, selectItemHandler, selectFilterHandler, stopEditing, filter, formProps],
  );

  return popoverWrapper(
    <>
      {formProps.filtered && (
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
            ) : item.value === MenuHeaderString ? (
              <MenuHeader>{item.label}</MenuHeader>
            ) : filteredValues.includes(item.value) ? null : (
              <MenuItem
                key={`${props.field}-${index}`}
                disabled={!!item.disabled}
                title={item.disabled && typeof item.disabled !== "boolean" ? item.disabled : ""}
                value={item.value}
                onClick={() => selectItemHandler(item.value)}
              >
                {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
              </MenuItem>
            ),
          )}
        </>
      </ComponentLoadingWrapper>
    </>,
  );
};
