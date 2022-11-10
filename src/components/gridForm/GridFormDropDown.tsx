import "../../styles/GridFormDropDown.scss";

import { MenuItem, MenuDivider, FocusableItem, MenuHeader } from "../../react-menu3";
import { useCallback, useContext, useEffect, useRef, useState, KeyboardEvent } from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { GridContext } from "../../contexts/GridContext";
import { delay } from "lodash-es";
import debounce from "debounce-promise";
import { CellEditorCommon, CellParams } from "../GridCell";
import { useGridPopoverHook } from "../GridPopoverHook";

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
  filtered?: "local" | "reload";
  filterPlaceholder?: string;
  onSelectedItem?: (props: GridPopoutEditDropDownSelectedItem<RowType, ValueType>) => Promise<void>;
  onSelectFilter?: (props: GridPopoutEditDropDownSelectedItem<RowType, string>) => Promise<void>;
  options:
    | SelectOption<ValueType>[]
    | ((selectedRows: RowType[], filter?: string) => Promise<SelectOption<ValueType>[]> | SelectOption<ValueType>[]);
  optionsRequestCancel?: () => void;
}

export const GridFormDropDown = <RowType extends GridBaseRow, ValueType>(
  _props: GridFormPopoutDropDownProps<RowType, ValueType>,
) => {
  const props = _props as GridFormPopoutDropDownProps<RowType, ValueType> & CellParams<RowType>;
  const { updatingCells, stopEditing } = useContext(GridContext);

  const [filter, setFilter] = useState("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<FinalSelectOption<ValueType>[] | null>(null);
  const [subComponentValues, setSubComponentValues] = useState<{ optionValue: any; subComponentValue: any }[]>([]);

  const selectItemHandler = useCallback(
    async (value: ValueType, subComponentValue?: ValueType): Promise<boolean> => {
      const field = props.field;
      return await updatingCells({ selectedRows: props.selectedRows, field }, async (selectedRows) => {
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
    [props, updatingCells],
  );

  const selectFilterHandler = useCallback(
    async (value: string): Promise<boolean> => {
      const field = props.field;
      return await updatingCells({ selectedRows: props.selectedRows, field }, async (selectedRows) => {
        if (props.onSelectFilter) {
          await props.onSelectFilter({ selectedRows, value });
        }
        return true;
      });
    },
    [props, updatingCells],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    let optionsConf = props.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        optionsConf = await optionsConf(props.selectedRows, filter);
      }

      const optionsList = (optionsConf?.map((item) => {
        if (item == null || typeof item == "string" || typeof item == "number") {
          item = ({
            value: (item as unknown) as ValueType,
            label: item,
            disabled: false,
          } as unknown) as FinalSelectOption<ValueType>;
        }
        return item;
      }) as any) as FinalSelectOption<ValueType>[];

      if (props.filtered) {
        // This is needed otherwise when filter input is rendered and sets autofocus
        // the mouse up of the double click edit triggers the cell to cancel editing
        delay(() => setOptions(optionsList), 100);
      } else {
        setOptions(optionsList);
      }
      optionsInitialising.current = false;
    })();
  }, [filter, options, props]);

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
  const { popoverWrapper } = useGridPopoverHook({ className: props.className });
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
            <MenuItem key={`${props.field}-empty`}>[Empty]</MenuItem>
          )}
          {options?.map((item: FinalSelectOption<ValueType | string>, index) =>
            item.value === MenuSeparatorString ? (
              <MenuDivider key={`$$divider_${index}`} />
            ) : item.value === MenuHeaderString ? (
              <MenuHeader key={`$$header_${index}`}>{item.label}</MenuHeader>
            ) : filteredValues.includes(item.value) ? null : (
              <div key={`menu-wrapper-${index}`}>
                {!item.subComponent ? (
                  <MenuItem
                    key={`${props.field}-${index}`}
                    disabled={!!item.disabled}
                    title={item.disabled && typeof item.disabled !== "boolean" ? item.disabled : ""}
                    value={item.value}
                    onClick={() => {
                      selectItemHandler(item.value as ValueType);
                    }}
                  >
                    {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
                  </MenuItem>
                ) : (
                  <FocusableItem className={"LuiDeprecatedForms"} key={`${props.field}-${index}_subcomponent`}>
                    {(ref: any) =>
                      item.subComponent &&
                      item.subComponent(
                        {
                          setValue: (value: any) => {
                            const localSubComponentValues = [...subComponentValues];
                            const subComponentValueIndex = localSubComponentValues.findIndex(
                              ({ optionValue }) => optionValue === item.value,
                            );
                            if (subComponentValueIndex !== -1) {
                              localSubComponentValues[subComponentValueIndex].subComponentValue = value;
                            } else {
                              localSubComponentValues.push({
                                subComponentValue: value,
                                optionValue: item.value,
                              });
                            }
                            setSubComponentValues(localSubComponentValues);
                          },
                          keyDown: (key: string) => {
                            const subComponentItem = subComponentValues.find(
                              ({ optionValue }) => optionValue === item.value,
                            );
                            if ((key === "Enter" || key === "Tab") && subComponentItem) {
                              return selectItemHandler(
                                item.value as ValueType,
                                subComponentItem.subComponentValue,
                              ).then(() => {
                                ref.closeMenu();
                                return true;
                              });
                            }
                            return false;
                          },
                          key: `${props.field}-${index}_subcomponent_inner`,
                        },
                        ref,
                      )
                    }
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
