import "../../styles/GridFormMultiSelect.scss";

import { FocusableItem, MenuDivider, MenuHeader, MenuItem } from "../../react-menu3";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { isEmpty, pick } from "lodash-es";
import { LuiCheckboxInput } from "@linzjs/lui";
import { useGridPopoverHook } from "../GridPopoverHook";
import { MenuHeaderString, MenuSeparatorString } from "./GridFormDropDown";
import { CellEditorCommon } from "../GridCell";
import { ClickEvent } from "../../react-menu3/types";
import { GridSubComponentContext } from "contexts/GridSubComponentContext";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { isNotEmpty } from "../../utils/util";
import { matcher } from "matcher";
import { FormError } from "../../lui/FormError";

export interface MultiFinalSelectOption {
  value: any;
  label?: string;
  subComponent?: (props: any) => JSX.Element;
  subValue?: any;
  filter?: string;
  checked?: boolean;
}

export type MultiSelectOption = null | number | string | MultiFinalSelectOption;

export interface GridFormMultiSelectGroup {
  header: string;
  filter?: string;
}

export interface GridFormMultiSelectProps<RowType extends GridBaseRow> extends CellEditorCommon {
  className?:
    | "GridMultiSelect-containerSmall"
    | "GridMultiSelect-containerMedium"
    | "GridMultiSelect-containerLarge"
    | "GridMultiSelect-containerUnlimited"
    | string
    | undefined;
  filtered?: boolean;
  filterPlaceholder?: string;
  filterHelpText?: string | ((filter: string, options: MultiFinalSelectOption[]) => string | undefined);
  onSelectFilter?: (filter: string, options: MultiFinalSelectOption[]) => void;
  onSave?: (selectedRows: RowType[], selectedOptions: MultiFinalSelectOption[]) => Promise<boolean>;
  headers?: GridFormMultiSelectGroup[];
  options: MultiSelectOption[] | ((selectedRows: RowType[]) => Promise<MultiSelectOption[]> | MultiSelectOption[]);
  invalid?: (selectedRows: RowType[], selectedOptions: MultiFinalSelectOption[]) => boolean;
}

export const GridFormMultiSelect = <RowType extends GridBaseRow>(props: GridFormMultiSelectProps<RowType>) => {
  const { selectedRows, data } = useGridPopoverContext<RowType>();

  const subComponentIsValid = useRef<Record<string, boolean>>({});
  const [filter, setFilter] = useState("");
  const optionsInitialising = useRef(false);
  const [initialValues, setInitialValues] = useState("");
  const [options, setOptions] = useState<MultiFinalSelectOption[]>();

  const invalid = useCallback(() => {
    if (!options) return true;
    const selectedValues = options?.filter((o) => o.checked).map((o) => o.value);
    const validations = pick(subComponentIsValid.current, selectedValues);
    if (Object.values(validations).some((v) => !v)) return true;
    return props.invalid
      ? props.invalid(
          selectedRows,
          options.filter((o) => o.checked),
        )
      : false;
  }, [options, props, selectedRows]);

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (props.onSave) {
        if (!options) {
          console.error("options not initialised");
          return false;
        }

        if (initialValues === JSON.stringify(options)) {
          // No changes to save
          return true;
        }

        return await props.onSave(
          selectedRows,
          options.filter((o) => o.checked),
        );
      }
      return true;
    },
    [initialValues, options, props],
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

      const optionsList = optionsConf?.map((item) =>
        item == null || typeof item === "string" || typeof item === "number"
          ? ({ value: item, label: item } as MultiFinalSelectOption)
          : item,
      );

      setInitialValues(JSON.stringify(optionsList));
      setOptions(optionsList);
      optionsInitialising.current = false;
    })();
  }, [props.options, options, selectedRows]);

  const toggleValue = useCallback(
    (item: MultiFinalSelectOption) => {
      item.checked = !item.checked;
      options && setOptions([...options]);
    },
    [options],
  );

  const { popoverWrapper, triggerSave } = useGridPopoverHook({
    className: props.className,
    invalid,
    save,
  });

  const headerGroups = useMemo(() => {
    if (options == null) return undefined;

    let filterFn = (_: string | undefined) => true;
    if (props.filtered) {
      filterFn = (value) => {
        if (value === undefined) return true;
        const subFilters = filter.split(/\s+/).map((s) => ["*" + s, s + "*"]);
        return subFilters.every((subFilter) => isNotEmpty(matcher(value, subFilter)));
      };
    }
    const filteredOutValues =
      props.filtered &&
      new Set(options.map((option) => (filterFn(option.label) ? undefined : option.value)).filter((r) => r));

    const result: Record<string, MultiFinalSelectOption[]> = {};
    const headers = props?.headers ?? [{ filter: undefined, header: undefined }];
    headers.forEach((header) => (result[header.filter ?? ""] = []));

    options?.forEach((option) => {
      if (!filteredOutValues || !filteredOutValues.has(option.value)) {
        result[option.filter ?? ""].push(option);
      }
    });
    return result;
  }, [filter, options, props.filtered, props?.headers]);

  return popoverWrapper(
    <ComponentLoadingWrapper loading={!options} className={"GridFormMultiSelect-container"}>
      <>
        {options && props.filtered && (
          <>
            <FocusableItem className={"filter-item"} key={"filter"}>
              {(_: any) => (
                <>
                  <div style={{ width: "100%" }} className={"GridFormMultiSelect-filter"}>
                    <input
                      className={"LuiTextInput-input"}
                      type="text"
                      placeholder={props.filterPlaceholder ?? "Placeholder"}
                      data-testid={"filteredMenu-free-text-input"}
                      value={filter}
                      data-disableEnterAutoSave={true}
                      onChange={(e) => setFilter(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" && props.onSelectFilter) {
                          e.stopPropagation();
                          e.preventDefault();
                          const preFilterOptions = JSON.stringify(options);
                          props.onSelectFilter(filter.trim(), options);
                          if (preFilterOptions === JSON.stringify(options)) {
                            // Nothing changed
                            return;
                          }
                          setOptions([...options]);
                          setFilter(() => "");
                        }
                      }}
                    />
                    {props.filterHelpText && (
                      <FormError
                        error={null}
                        helpText={
                          typeof props.filterHelpText === "function"
                            ? props.filterHelpText(filter.trim(), options)
                            : props.filterHelpText
                        }
                      />
                    )}
                  </div>
                </>
              )}
            </FocusableItem>
            <MenuDivider key={`$$divider_filter`} />
          </>
        )}
        {headerGroups && (
          <div className={"GridFormMultiSelect-options"}>
            {(props.headers ?? [{ filter: undefined, header: undefined }]).map((header) => (
              <>
                {header?.header && !isEmpty(headerGroups[header.filter ?? ""]) && (
                  <MenuHeader key={`$$header_${header?.filter}`}>{header.header}</MenuHeader>
                )}
                {headerGroups[header.filter ?? ""]?.map((item, index) => {
                  return (
                    item.filter === header.filter &&
                    (item.value === MenuSeparatorString ? (
                      <MenuDivider key={`$$divider_${index}`} />
                    ) : item.value === MenuHeaderString ? (
                      <MenuHeader key={`$$header_${index}`}>{item.label}</MenuHeader>
                    ) : (
                      <div key={`${item.value}`}>
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
                            isChecked={item.checked ?? false}
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

                        {item.checked && item.subComponent && (
                          <FocusableItem className={"LuiDeprecatedForms"} key={`${item.value}_subcomponent`}>
                            {(_: any) =>
                              item.subComponent && (
                                <GridSubComponentContext.Provider
                                  value={{
                                    context: { options },
                                    data,
                                    value: item.subValue,
                                    setValue: (value: any) => {
                                      item.subValue = value;
                                      options && setOptions([...options]);
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
                    ))
                  );
                })}
              </>
            ))}
          </div>
        )}
      </>
    </ComponentLoadingWrapper>,
  );
};
