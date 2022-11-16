import "../../styles/GridFormMultiSelect.scss";

import { FocusableItem, MenuDivider, MenuItem } from "../../react-menu3";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { delay, fromPairs, isEqual, omit, pick, toPairs } from "lodash-es";
import { LuiCheckboxInput } from "@linzjs/lui";
import { useGridPopoverHook } from "../GridPopoverHook";
import { MenuSeparatorString } from "./GridFormDropDown";
import { CellEditorCommon } from "../GridCell";
import { ClickEvent } from "../../react-menu3/types";
import { GridSubComponentContext } from "contexts/GridSubComponentContext";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";

interface MultiFinalSelectOption<ValueType> {
  value: ValueType;
  label?: JSX.Element | string;
  subComponent?: (props: any) => JSX.Element;
}

export type MultiSelectOption<ValueType> = ValueType | MultiFinalSelectOption<ValueType>;

export interface SelectedOptionResult<ValueType> extends MultiFinalSelectOption<ValueType> {
  subValue?: any;
}

export interface GridFormMultiSelectProps<RowType extends GridBaseRow, ValueType> extends CellEditorCommon {
  className?:
    | "GridMultiSelect-containerSmall"
    | "GridMultiSelect-containerMedium"
    | "GridMultiSelect-containerLarge"
    | "GridMultiSelect-containerUnlimited"
    | string
    | undefined;
  filtered?: boolean;
  filterPlaceholder?: string;
  onSave?: (selectedRows: RowType[], selectedOptions: SelectedOptionResult<ValueType>[]) => Promise<boolean>;
  options:
    | MultiSelectOption<ValueType>[]
    | ((selectedRows: RowType[]) => Promise<MultiSelectOption<ValueType>[]> | MultiSelectOption<ValueType>[]);
  initialSelectedValues?: (selectedRows: RowType[]) => any[] | Record<string, null | any>;
}

export const GridFormMultiSelect = <RowType extends GridBaseRow, ValueType>(
  props: GridFormMultiSelectProps<RowType, ValueType>,
) => {
  const { selectedRows, data } = useGridPopoverContext<RowType>();

  const initialiseValues = useMemo(() => {
    const r = props.initialSelectedValues && props.initialSelectedValues(selectedRows);
    // convert array of strings to object<value,null>
    return Array.isArray(r) ? fromPairs(r.map((v) => [v, null])) : r;
  }, [props, selectedRows]);

  const subComponentIsValid = useRef<Record<string, boolean>>({});
  const [selectedValues, setSelectedValues] = useState<Record<string, null | any>>(() => initialiseValues ?? {});

  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MultiFinalSelectOption<ValueType>[]>();

  const invalid = useCallback(() => {
    const validations = pick(subComponentIsValid.current, Object.keys(selectedValues));
    return Object.values(validations).some((v) => !v);
  }, [selectedValues]);

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (props.onSave) {
        if (!options) {
          console.error("options not initialised");
          return false;
        }

        const validations = pick(subComponentIsValid.current, Object.keys(selectedValues));
        const notValid = Object.values(validations).some((v) => !v);
        if (notValid) return false;

        const menuOptionSubValueResult = toPairs(selectedValues).map(([value, subValue]) => {
          const o = {
            ...options.find((o) => o.value == value),
          } as SelectedOptionResult<ValueType>;
          o.subValue = subValue;
          return o;
        });

        if (isEqual(initialiseValues, selectedValues)) {
          // No changes to save
          return true;
        }

        return await props.onSave(selectedRows, menuOptionSubValueResult);
      }
      return true;
    },
    [initialiseValues, options, props, selectedValues],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    let optionsConf = props.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        optionsConf = await optionsConf(selectedRows);
      }

      const optionsList = optionsConf?.map((item) => {
        if (item == null || typeof item === "string" || typeof item === "number") {
          item = { value: item as ValueType, label: item } as MultiFinalSelectOption<ValueType>;
        }
        return item;
      }) as any as MultiFinalSelectOption<ValueType>[];

      if (props.filtered) {
        // This is needed otherwise when filter input is rendered and sets autofocus
        // the mouse up of the double click edit triggers the cell to cancel editing
        delay(() => setOptions(optionsList), 100);
      } else {
        setOptions(optionsList);
      }
      optionsInitialising.current = false;
    })();
  }, [props.filtered, props.options, options, selectedRows]);

  useEffect(() => {
    if (!props.filtered || options == null) return;
    setFilteredValues(
      options
        .map((option) => {
          if (option.label != null && typeof option.label !== "string") {
            console.error("Cannot filter non-string labels", option);
            return undefined;
          }
          const str = (option.label as string) || "";
          return str.toLowerCase().indexOf(filter.trim()) === -1 ? option.value : undefined;
        })
        .filter((r) => r !== undefined),
    );
  }, [props.filtered, filter, options]);

  const toggleValue = useCallback(
    (item: MultiFinalSelectOption<ValueType>) => {
      if (`${item.value}` in selectedValues) {
        setSelectedValues(omit(selectedValues, [`${item.value}`]));
      } else {
        setSelectedValues({ ...selectedValues, [`${item.value}`]: null });
      }
    },
    [selectedValues],
  );

  const { popoverWrapper, triggerSave } = useGridPopoverHook({
    className: props.className,
    invalid,
    save,
  });
  return popoverWrapper(
    <ComponentLoadingWrapper loading={!options} className={"GridFormMultiSelect-container"}>
      <>
        {options && props.filtered && (
          <>
            <FocusableItem className={"filter-item"} key={"filter"}>
              {({ ref }: any) => (
                <div style={{ display: "flex", width: "100%" }} className={"GridFormMultiSelect-filter"}>
                  <input
                    autoFocus
                    className={"free-text-input"}
                    style={{ border: "0px" }}
                    ref={ref}
                    type="text"
                    placeholder={props.filterPlaceholder ?? "Placeholder"}
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
        <div className={"GridFormMultiSelect-options"}>
          {options?.map((item, index) =>
            item.value === MenuSeparatorString ? (
              <MenuDivider key={`$$divider_${index}`} />
            ) : filteredValues.includes(item.value) ? null : (
              <div key={`${index}`}>
                <MenuItem
                  onClick={(e: ClickEvent) => {
                    // Global react-menu MenuItem handler handles tabs
                    if (e.key !== "Tab") {
                      e.keepOpen = true;
                      toggleValue(item);
                    }
                  }}
                >
                  <LuiCheckboxInput
                    isChecked={`${item.value}` in selectedValues}
                    value={`${item.value}`}
                    label={item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
                    inputProps={{
                      onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      },
                    }}
                    onChange={() => {
                      /*Do nothing, change handled by menuItem*/
                    }}
                  />
                </MenuItem>

                {`${item.value}` in selectedValues && item.subComponent && (
                  <FocusableItem className={"LuiDeprecatedForms"} key={`${item.value}_subcomponent`}>
                    {(_: any) =>
                      item.subComponent && (
                        <GridSubComponentContext.Provider
                          value={{
                            data,
                            value: selectedValues[`${item.value}`],
                            setValue: (value: any) => {
                              setSelectedValues({
                                ...selectedValues,
                                [`${item.value}`]: value,
                              });
                            },
                            setValid: (valid: boolean) => {
                              subComponentIsValid.current[`${item.value}`] = valid;
                            },
                            triggerSave,
                          }}
                        >
                          <item.subComponent />
                        </GridSubComponentContext.Provider>
                      )
                    }
                  </FocusableItem>
                )}
              </div>
            ),
          )}
        </div>
      </>
    </ComponentLoadingWrapper>,
  );
};
