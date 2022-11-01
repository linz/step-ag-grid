import "../../react-menu3/styles/index.scss";

import { MenuItem, MenuDivider, FocusableItem, ClickEvent } from "@react-menu3";
import { Fragment, useCallback, useEffect, useRef, useState, KeyboardEvent } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { delay } from "lodash-es";
import { LuiCheckboxInput } from "@linzjs/lui";
import { GenericCellEditorParams, GridFormProps } from "../GridCell";
import { useGridPopoverHook } from "../GridPopoverHook";

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

export interface GridFormMultiSelectProps<RowType extends GridBaseRow, ValueType>
  extends GenericCellEditorParams<RowType> {
  filtered?: boolean;
  filterPlaceholder?: string;
  onSave?: (props: MultiSelectResult<RowType>) => Promise<boolean>;
  options:
    | SelectOption<ValueType>[]
    | ((selectedRows: RowType[]) => Promise<SelectOption<ValueType>[]> | SelectOption<ValueType>[]);
  initialSelectedValues?: any[];
}

export const GridFormMultiSelect = <RowType extends GridBaseRow, ValueType>(props: GridFormProps<RowType>) => {
  const formProps = props.formProps as GridFormMultiSelectProps<RowType, ValueType>;

  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[]>();
  const subSelectedValues = useRef<Record<string, any>>({});
  const [selectedValues, setSelectedValues] = useState<any[]>([]);

  if (formProps.initialSelectedValues) {
    setSelectedValues(formProps.initialSelectedValues);
  }

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      const values: Record<string, any> = selectedValues.reduce((previousValue, value) => {
        previousValue[value] = subSelectedValues.current[value] ?? true;
        return previousValue;
      }, {});
      if (formProps.onSave) {
        return await formProps.onSave({ selectedRows, values });
      }
      return true;
    },
    [formProps, selectedValues],
  );
  const { popoverWrapper, triggerSave } = useGridPopoverHook(props, save);

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    let optionsConf = formProps.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        optionsConf = await optionsConf(props.selectedRows);
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
  }, [formProps.filtered, formProps.options, options, props.selectedRows]);

  useEffect(() => {
    if (!formProps.filtered || options == null) return;
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
  }, [formProps.filtered, filter, options]);

  return popoverWrapper(
    <ComponentLoadingWrapper loading={!options}>
      <div className={"Grid-popoverContainerList"}>
        {options && formProps.filtered && (
          <>
            <FocusableItem className={"filter-item"} key={"filter"}>
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
            <Fragment key={`${index}`}>
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
                  {(ref: any) =>
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
              )}
            </Fragment>
          ),
        )}
      </div>
    </ComponentLoadingWrapper>,
  );
};
