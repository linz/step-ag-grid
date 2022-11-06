import "../../styles/GridFormMultiSelect.scss";

import { MenuItem, MenuDivider, FocusableItem } from "../../react-menu3";
import { useCallback, useEffect, useRef, useState, KeyboardEvent } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { delay, fromPairs } from "lodash-es";
import { LuiCheckboxInput } from "@linzjs/lui";
import { useGridPopoverHook } from "../GridPopoverHook";
import { MenuSeparatorString } from "../../components/gridForm/GridFormDropDown";
import { CellEditorCommon, CellParams } from "../../components/GridCell";
import { ClickEvent } from "../../react-menu3/types";

interface MultiFinalSelectOption<ValueType> {
  value: ValueType;
  label?: JSX.Element | string;
  subComponent?: (props: any, ref: any) => any;
}

export type MultiSelectOption<ValueType> = ValueType | MultiFinalSelectOption<ValueType>;

export interface MultiSelectResult<RowType> {
  selectedRows: RowType[];
  values: Record<string, any>;
}

export interface GridFormMultiSelectProps<RowType extends GridBaseRow, ValueType> extends CellEditorCommon {
  // This overrides CellEditorCommon to provide some common class options
  className?:
    | "GridMultiSelect-containerSmall"
    | "GridMultiSelect-containerMedium"
    | "GridMultiSelect-containerLarge"
    | string
    | undefined;
  filtered?: boolean;
  filterPlaceholder?: string;
  onSave?: (props: MultiSelectResult<RowType>) => Promise<boolean>;
  options:
    | MultiSelectOption<ValueType>[]
    | ((selectedRows: RowType[]) => Promise<MultiSelectOption<ValueType>[]> | MultiSelectOption<ValueType>[]);
  initialSelectedValues?: (selectedRows: RowType[]) => any[];
}

export const GridFormMultiSelect = <RowType extends GridBaseRow, ValueType>(
  props: GridFormMultiSelectProps<RowType, ValueType>,
) => {
  const { selectedRows } = props as unknown as CellParams<RowType>;
  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MultiFinalSelectOption<ValueType>[]>();
  const subSelectedValues = useRef<Record<string, any>>({});
  const [selectedValues, setSelectedValues] = useState<any[]>(() =>
    props.initialSelectedValues ? props.initialSelectedValues(selectedRows) : [],
  );

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      const values: Record<string, any> = fromPairs(
        selectedValues.map((value) => [value, subSelectedValues.current[value] ?? true]),
      );
      if (props.onSave) {
        return await props.onSave({ selectedRows, values });
      }
      return true;
    },
    [props, selectedValues],
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
              </div>
            ),
          )}
        </div>
      </>
    </ComponentLoadingWrapper>,
  );
};
