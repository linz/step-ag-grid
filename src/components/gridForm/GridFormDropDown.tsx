import { FocusableItem, MenuDivider, MenuHeader, MenuItem } from "../../react-menu3";
import { useCallback, useEffect, useRef, useState } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { delay, isEmpty } from "lodash-es";
import debounce from "debounce-promise";
import { CellEditorCommon } from "../GridCell";
import { useGridPopoverHook } from "../GridPopoverHook";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { GridSubComponentContext } from "contexts/GridSubComponentContext";
import { ClickEvent, MenuInstance } from "../../react-menu3/types";
import { FormError } from "../../lui/FormError";
import { isNotEmpty } from "../../utils/util";

export interface GridPopoutEditDropDownSelectedItem<RowType> {
  // Note the row that was clicked on will be first
  selectedRows: RowType[];
  value: any;
  subComponentValue?: any;
}

interface FinalSelectOption {
  value: any;
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

export type SelectOption = null | string | FinalSelectOption;

export interface GridFormPopoutDropDownProps<RowType extends GridBaseRow> extends CellEditorCommon {
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
  filterHelpText?: string;
  onSelectedItem?: (props: GridPopoutEditDropDownSelectedItem<RowType>) => Promise<void>;
  onSelectFilter?: (props: GridPopoutEditDropDownSelectedItem<RowType>) => Promise<void>;
  options: SelectOption[] | ((selectedRows: RowType[], filter?: string) => Promise<SelectOption[]> | SelectOption[]);
  optionsRequestCancel?: () => void;
}

const fieldToString = (field: any) => {
  return typeof field == "symbol" ? field.toString() : `${field}`;
};

export const GridFormDropDown = <RowType extends GridBaseRow>(props: GridFormPopoutDropDownProps<RowType>) => {
  const { selectedRows, field, data } = useGridPopoverContext<RowType>();

  // Save triggers during async action processing which triggers another selectItem(), this ref blocks that
  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>();
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption[] | null>(null);
  const subComponentIsValid = useRef(false);
  const subComponentInitialValue = useRef<string | null>(null);
  const [subSelectedValue, setSubSelectedValue] = useState<any>(null);
  // Note: null is assumed to be the filter
  const [selectedItem, setSelectedItem] = useState<FinalSelectOption | null>(null);

  const selectItemHandler = useCallback(
    async (value: any, subComponentValue?: any): Promise<boolean> => {
      const hasChanged =
        selectedRows.some((row) => row[field as keyof RowType] !== value) ||
        (subComponentValue !== undefined && subComponentInitialValue.current !== JSON.stringify(subComponentValue));
      if (hasChanged) {
        if (props.onSelectedItem) {
          await props.onSelectedItem({ selectedRows, value, subComponentValue });
        } else {
          selectedRows.forEach((row) => (row[field] = value as any));
        }
      }
      return true;
    },
    [field, props, selectedRows],
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

      const optionsList = optionsConf?.map((item) =>
        item == null || typeof item == "string"
          ? ({
              value: item,
              label: item,
              disabled: false,
            } as FinalSelectOption)
          : item,
      );

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
            return str.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ? option : undefined;
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

  /**
   * Saves are wrapped in updateValue and triggered by blur events
   */
  const save = useCallback(async () => {
    if (!options) return true;

    // Filter saved
    if (selectedItem === null) {
      if (props.onSelectFilter) {
        const { onSelectFilter } = props;
        await onSelectFilter({ selectedRows, value: filter });
        return true;
      } else {
        if (filteredValues && filteredValues.length === 1) {
          if (filteredValues[0].subComponent) return false;
          return await selectItemHandler(filteredValues[0].value, null);
        }
      }
      return false;
    }
    if (selectedItem.subComponent && !subComponentIsValid.current) return false;
    await selectItemHandler(selectedItem.value, subSelectedValue);

    return true;
  }, [filter, filteredValues, options, props, selectItemHandler, selectedItem, selectedRows, subSelectedValue]);

  const { popoverWrapper } = useGridPopoverHook({
    className: props.className,
    invalid: () => !!(selectedItem && !subComponentIsValid.current),
    save,
  });

  return popoverWrapper(
    <>
      {props.filtered && (
        <div className={"GridFormDropDown-filter"}>
          <FocusableItem
            className={"filter-item"}
            onFocus={() => {
              setSelectedItem(null);
              setSubSelectedValue(null);
              subComponentIsValid.current = true;
            }}
          >
            {({ ref }: any) => (
              <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <input
                  className={"LuiTextInput-input"}
                  ref={ref}
                  type="text"
                  placeholder={props.filterPlaceholder ?? "Placeholder"}
                  data-testid={"filteredMenu-free-text-input"}
                  defaultValue={filter}
                  data-allowtabtosave={true}
                  data-disableenterautosave={
                    !props.onSelectFilter &&
                    !(filteredValues && filteredValues.length === 1 && !filteredValues[0].subComponent)
                  }
                  onChange={(e) => setFilter(e.target.value)}
                />
                {props.filterHelpText && isNotEmpty(filter) && (
                  <FormError error={null} helpText={props.filterHelpText} />
                )}
              </div>
            )}
          </FocusableItem>
          <MenuDivider key={`$$divider_filter`} />
        </div>
      )}
      <ComponentLoadingWrapper loading={!options} className={"GridFormDropDown-options"}>
        <>
          {options && filteredValues && isEmpty(filteredValues) && (
            <MenuItem key={`${fieldToString(field)}-empty`} className={"GridPopoverEditDropDown-noOptions"}>
              No Options
            </MenuItem>
          )}
          {options?.map((item: FinalSelectOption, index) =>
            item.value === MenuSeparatorString ? (
              <MenuDivider key={`$$divider_${index}`} />
            ) : item.value === MenuHeaderString ? (
              <MenuHeader key={`$$header_${index}`}>{item.label}</MenuHeader>
            ) : (
              (!filteredValues || filteredValues.includes(item)) && (
                <div key={`menu-wrapper-${index}`}>
                  <MenuItem
                    key={`${fieldToString(field)}-${index}`}
                    disabled={!!item.disabled}
                    title={item.disabled && typeof item.disabled !== "boolean" ? item.disabled : ""}
                    value={item.value}
                    onFocus={() => {
                      setSelectedItem(item);
                      if (item.subComponent) {
                        setSelectedItem(item);
                        subComponentIsValid.current = true;
                        subComponentInitialValue.current = null;
                      } else {
                        setSubSelectedValue(null);
                        subComponentIsValid.current = true;
                      }
                    }}
                    onClick={(e: ClickEvent) => {
                      if (item.subComponent) {
                        e.keepOpen = true;
                      }
                    }}
                  >
                    {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
                    {item.subComponent ? "..." : ""}
                  </MenuItem>

                  {item.subComponent && selectedItem === item && (
                    <FocusableItem className={"LuiDeprecatedForms"} key={`${item.label}_subcomponent`}>
                      {(ref: MenuInstance) => (
                        <GridSubComponentContext.Provider
                          value={{
                            context: { options },
                            data,
                            value: subSelectedValue,
                            setValue: (value: any) => {
                              setSubSelectedValue(value);
                              if (subComponentInitialValue.current === null) {
                                // copy the default value of the sub-component so we can change detect on save
                                subComponentInitialValue.current = JSON.stringify(value);
                              }
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
                            <div className={"subComponent"}>
                              <item.subComponent key={`${fieldToString(field)}-${index}_subcomponent_inner`} />
                            </div>
                          )}
                        </GridSubComponentContext.Provider>
                      )}
                    </FocusableItem>
                  )}
                </div>
              )
            ),
          )}
        </>
      </ComponentLoadingWrapper>
    </>,
  );
};
