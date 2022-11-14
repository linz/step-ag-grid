import "../../styles/GridFormDropDown.scss";

import { FocusableItem, MenuDivider, MenuHeader, MenuItem } from "../../react-menu3";
import { KeyboardEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridContext } from "../../contexts/GridContext";
import { delay } from "lodash-es";
import debounce from "debounce-promise";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverHook } from "../GridPopoverHook";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { GridSubComponentContext } from "contexts/GridSubComponentContext";
import { ClickEvent, MenuInstance } from "../../react-menu3/types";

export interface GridPopoutEditDropDownSelectedItem<RowType, ValueType> {
  // Note the row that was clicked on will be first
  selectedRows: RowType[];
  value: ValueType;
  subComponentValue?: ValueType;
}

interface FinalSelectOption<ValueType> {
  value: ValueType;
  label?: JSX.Element | string;
  disabled?: boolean | string;
  subComponent?: (props: any, ref: any) => any;
}

export const MenuSeparatorString = "_____MENU_SEPARATOR_____";
export const MenuSeparator = Object.freeze({ value: MenuSeparatorString });

export const MenuHeaderString = "_____MENU_HEADER_____";
export const MenuHeaderItem = (title: string) => {
  return { label: title, value: MenuHeaderString };
};

export type SelectOption<ValueType> = ValueType | FinalSelectOption<ValueType>;

export interface GridFormPopoutDropDownProps<RowType extends GridBaseRow, ValueType> extends CellEditorCommon {
  // This overrides CellEditorCommon to provide some common class options
  className?:
    | "GridPopoverEditDropDown-containerSmall"
    | "GridPopoverEditDropDown-containerMedium"
    | "GridPopoverEditDropDown-containerLarge"
    | "GridPopoverEditDropDown-containerUnlimited"
    | string
    | undefined;
  // local means the filter won't change if it's reloaded, reload means it does change
  filtered?: "local" | "reload";
  filterPlaceholder?: string;
  onSelectedItem?: (props: GridPopoutEditDropDownSelectedItem<RowType, ValueType>) => Promise<void>;
  onSelectFilter?: (props: GridPopoutEditDropDownSelectedItem<RowType, string>) => Promise<void>;
  options:
    | SelectOption<ValueType>[]
    | ((selectedRows: RowType[], filter?: string) => Promise<SelectOption<ValueType>[]> | SelectOption<ValueType>[]);
  optionsRequestCancel?: () => void;
}

const fieldToString = (field: any) => {
  return typeof field == "symbol" ? field.toString() : `${field}`;
};

export const GridFormDropDown = <RowType extends GridBaseRow, ValueType>(
  props: GridFormPopoutDropDownProps<RowType, ValueType>,
) => {
  const { selectedRows, field, updateValue, data } = useGridPopoverContext<RowType>();
  const { stopEditing } = useContext(GridContext);

  // Save triggers during async action processing which triggers another selectItem(), this ref blocks that
  const hasSubmitted = useRef(false);
  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[] | null>(null);
  const subComponentIsValid = useRef(false);
  const [subSelectedValue, setSubSelectedValue] = useState<any>();
  const [selectedSubComponent, setSelectedSubComponent] = useState<FinalSelectOption<any> | null>(null);

  const selectItemHandler = useCallback(
    async (value: ValueType, subComponentValue?: ValueType): Promise<boolean> => {
      if (hasSubmitted.current || (subComponentValue !== undefined && !subComponentIsValid.current)) return false;
      hasSubmitted.current = true;

      return updateValue(async (selectedRows) => {
        const hasChanged = selectedRows.some((row) => row[field as keyof RowType] !== value);
        if (hasChanged) {
          if (props.onSelectedItem) {
            await props.onSelectedItem({ selectedRows, value, subComponentValue });
          } else {
            selectedRows.forEach((row) => (row[field as keyof RowType] = value));
          }
        }
        return true;
      });
    },
    [field, props, updateValue],
  );

  const selectFilterHandler = useCallback(
    async (value: string) =>
      updateValue(async (selectedRows) => {
        props.onSelectFilter && (await props.onSelectFilter({ selectedRows, value }));
        return true;
      }),
    [props, updateValue],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    let optionsConf = props.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        optionsConf = await optionsConf(selectedRows, filter);
      }

      const optionsList = optionsConf?.map((item) => {
        if (item == null || typeof item == "string" || typeof item == "number") {
          item = {
            value: item as unknown as ValueType,
            label: item,
            disabled: false,
          } as unknown as FinalSelectOption<ValueType>;
        }
        return item;
      }) as any as FinalSelectOption<ValueType>[];

      if (props.filtered) {
        // This is needed otherwise when filter input is rendered and sets autofocus
        // the mouse up of the double click edit triggers the cell to cancel editing
        delay(() => setOptions(optionsList), 100);
      } else {
        setOptions(optionsList);
      }
      optionsInitialising.current = false;
    })();
  }, [filter, options, props, selectedRows]);

  // Local filtering.
  useEffect(() => {
    if (props.filtered == "local") {
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
  }, [props.filtered, filter, options]);

  const researchOnFilterChange = debounce(
    useCallback(() => {
      setOptions(null);
    }, []),
    500,
  );

  const previousFilter = useRef<string>(filter);

  // Reload filtering.
  useEffect(() => {
    if (previousFilter.current != filter && props.filtered == "reload") {
      previousFilter.current = filter;
      props.optionsRequestCancel && props.optionsRequestCancel();
      researchOnFilterChange().then();
    }
  }, [filter, props, researchOnFilterChange]);

  const onFilterKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (!options) return;
      if (e.key == "Enter" || e.key == "Tab") {
        const activeOptions = options.filter((option) => !filteredValues.includes(option.value));
        if (activeOptions.length == 1) {
          await selectItemHandler(activeOptions[0].value);
          stopEditing();
        } else if (props.onSelectFilter) {
          await selectFilterHandler(filter);
          stopEditing();
        } else {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    },
    [filteredValues, options, selectItemHandler, selectFilterHandler, stopEditing, filter, props],
  );

  const save = useCallback(async () => {
    // Handler for sub-selected value
    if (!selectedSubComponent) return true;
    if (selectedSubComponent.subComponent && !subComponentIsValid.current) return false;
    await selectItemHandler(selectedSubComponent.value as ValueType, subSelectedValue);
    return true;
  }, [selectItemHandler, selectedSubComponent, subSelectedValue]);

  const { popoverWrapper } = useGridPopoverHook({
    className: props.className,
    invalid: () => !!(selectedSubComponent && !subComponentIsValid.current),
    save,
  });
  return popoverWrapper(
    <>
      {props.filtered && (
        <div className={"GridFormDropDown-filter"}>
          <FocusableItem className={"filter-item"}>
            {({ ref }: any) => (
              <div style={{ display: "flex", width: "100%" }}>
                <input
                  autoFocus
                  className={"free-text-input"}
                  style={{ border: "0px" }}
                  ref={ref}
                  type="text"
                  placeholder={props.filterPlaceholder ?? "Placeholder"}
                  data-testid={"filteredMenu-free-text-input"}
                  defaultValue={filter}
                  onChange={(e) => setFilter(e.target.value.toLowerCase())}
                  onKeyDown={(e) => onFilterKeyDown(e)}
                />
              </div>
            )}
          </FocusableItem>
          <MenuDivider key={`$$divider_filter`} />
        </div>
      )}
      <ComponentLoadingWrapper loading={!options} className={"GridFormDropDown-options"}>
        <>
          {options && options.length == filteredValues?.length && (
            <MenuItem key={`${fieldToString(field)}-empty`}>[Empty]</MenuItem>
          )}
          {options?.map((item: FinalSelectOption<ValueType | string>, index) =>
            item.value === MenuSeparatorString ? (
              <MenuDivider key={`$$divider_${index}`} />
            ) : item.value === MenuHeaderString ? (
              <MenuHeader key={`$$header_${index}`}>{item.label}</MenuHeader>
            ) : filteredValues.includes(item.value) ? null : (
              <div key={`menu-wrapper-${index}`}>
                <MenuItem
                  key={`${fieldToString(field)}-${index}`}
                  disabled={!!item.disabled}
                  title={item.disabled && typeof item.disabled !== "boolean" ? item.disabled : ""}
                  value={item.value}
                  onClick={(e: ClickEvent) => {
                    if (item.subComponent) {
                      if (selectedSubComponent === item) {
                        // toggle selection off
                        setSelectedSubComponent(null);
                        subComponentIsValid.current = true;
                      } else {
                        // toggle selection on
                        setSelectedSubComponent(item);
                      }
                      e.keepOpen = true;
                    } else {
                      selectItemHandler(item.value as ValueType).then();
                    }
                  }}
                >
                  {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
                  {item.subComponent ? "..." : ""}
                </MenuItem>

                {item.subComponent && selectedSubComponent === item && (
                  <FocusableItem className={"LuiDeprecatedForms"} key={`${item.label}_subcomponent`}>
                    {(ref: MenuInstance) => (
                      <GridSubComponentContext.Provider
                        value={{
                          data,
                          value: subSelectedValue,
                          setValue: (value: any) => {
                            setSubSelectedValue(value);
                          },
                          setValid: (valid: boolean) => {
                            subComponentIsValid.current = valid;
                          },
                          triggerSave: async () => {
                            ref.closeMenu();
                          },
                        }}
                      >
                        {item.subComponent && (
                          <item.subComponent key={`${fieldToString(field)}-${index}_subcomponent_inner`} />
                        )}
                      </GridSubComponentContext.Provider>
                    )}
                  </FocusableItem>
                )}
              </div>
            ),
          )}
        </>
      </ComponentLoadingWrapper>
    </>,
  );
};
