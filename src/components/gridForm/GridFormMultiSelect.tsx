import "../../styles/GridFormMultiSelect.scss";

import { MenuItem, MenuDivider, FocusableItem } from "../../react-menu3";
import { useCallback, useEffect, useRef, useState, KeyboardEvent, useMemo } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { delay, pick, pickBy } from "lodash-es";
import { LuiCheckboxInput } from "@linzjs/lui";
import { useGridPopoverHook } from "../GridPopoverHook";
import { MenuSeparatorString } from "./GridFormDropDown";
import { CellEditorCommon, CellParams } from "../GridCell";
import { ClickEvent } from "../../react-menu3/types";
import { GridSubComponentContext } from "contexts/GridSubComponentContext";

interface MultiFinalSelectOption<ValueType> {
  value: ValueType;
  label?: JSX.Element | string;
  subComponent?: (props: any) => JSX.Element;
}

export type MultiSelectOption<ValueType> = ValueType | MultiFinalSelectOption<ValueType>;

export interface SelectedOptionResult<ValueType> extends MultiFinalSelectOption<ValueType> {
  subValue: any;
}

export interface GridFormMultiSelectProps<RowType extends GridBaseRow, ValueType> extends CellEditorCommon {
  // This overrides CellEditorCommon to provide some common class options
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
  initialSelectedValues?: (selectedRows: RowType[]) => any[] | Record<string, any>;
}

export const GridFormMultiSelect = <RowType extends GridBaseRow, ValueType>(
  props: GridFormMultiSelectProps<RowType, ValueType>,
) => {
  const { selectedRows } = props as unknown as CellParams<RowType>;

  const initialiseValues = useMemo(
    () => props.initialSelectedValues && props.initialSelectedValues(selectedRows),
    [props, selectedRows],
  );

  const subComponentIsValid = useRef<Record<string, boolean>>({});
  const [subSelectedValues, setSubSelectedValues] = useState<Record<string, any>>(
    initialiseValues && !Array.isArray(initialiseValues)
      ? pickBy(initialiseValues, (value) => typeof value !== "boolean")
      : {},
  );
  const [selectedValues, setSelectedValues] = useState<any[]>(() =>
    initialiseValues ? (Array.isArray(initialiseValues) ? initialiseValues : Object.keys(initialiseValues)) : [],
  );

  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MultiFinalSelectOption<ValueType>[]>();

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (props.onSave) {
        const validations = pick(subComponentIsValid.current, selectedValues);
        const notValid = Object.values(validations).some((v) => !v);
        if (notValid) return false;

        const selectedOptions = selectedValues.map((row) => (options ?? []).find((opt) => opt.value == row)) ?? [];
        const selectedResults = selectedOptions.map(
          (selectedOption) =>
            ({
              ...selectedOption,
              subValue: subSelectedValues[`${selectedOption?.value}`],
            } as SelectedOptionResult<ValueType>),
        );
        return await props.onSave(selectedRows, selectedResults);
      }
      return true;
    },
    [options, props, selectedValues, subSelectedValues],
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
        if (item == null || typeof item == "string" || typeof item == "number") {
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

  const { popoverWrapper, triggerSave } = useGridPopoverHook({ className: props.className, save });
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
                  key={`${index}`}
                  onClick={(e: ClickEvent) => {
                    e.keepOpen = true;
                    if (selectedValues.includes(item.value)) {
                      setSelectedValues(selectedValues.filter((value) => value != item.value));
                    } else {
                      setSelectedValues([...selectedValues, item.value]);
                    }
                  }}
                  onKeyDown={async (e: KeyboardEvent) => {
                    if (e.key === "Enter") triggerSave().then();
                    else if (e.key === " ") {
                      if (selectedValues.includes(item.value)) {
                        setSelectedValues(selectedValues.filter((value) => value != item.value));
                      } else {
                        setSelectedValues([...selectedValues, item.value]);
                      }
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <LuiCheckboxInput
                    isChecked={selectedValues.includes(item.value)}
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

                {selectedValues.includes(item.value) && item.subComponent && (
                  <FocusableItem className={"LuiDeprecatedForms"} key={`${item.value}_subcomponent`}>
                    {(_: any) =>
                      item.subComponent && (
                        <GridSubComponentContext.Provider
                          value={{
                            value: subSelectedValues[`${item.value}`],
                            setValue: (value: any) => {
                              subSelectedValues[`${item.value}`] = value;
                              setSubSelectedValues({ ...subSelectedValues });
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
