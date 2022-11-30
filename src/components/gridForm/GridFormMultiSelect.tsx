import { FocusableItem, MenuDivider, MenuHeader, MenuItem } from "../../react-menu3";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
  SetStateAction,
  Dispatch,
  Fragment,
} from "react";
import { GridBaseRow } from "../Grid";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { fromPairs, groupBy, isEmpty, pick, toPairs } from "lodash-es";
import { LuiCheckboxInput } from "@linzjs/lui";
import { useGridPopoverHook } from "../GridPopoverHook";
import { MenuSeparatorString } from "./GridFormDropDown";
import { CellEditorCommon } from "../GridCell";
import { ClickEvent } from "../../react-menu3/types";
import { GridSubComponentContext } from "contexts/GridSubComponentContext";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { FormError } from "../../lui/FormError";
import { textMatch } from "../../utils/textMatcher";
import { GridIcon } from "../GridIcon";

type HeaderGroupType = Record<string, MultiSelectOption[]> | undefined;

export interface MultiSelectOption {
  value: any;
  label?: string;
  subComponent?: (props: any) => JSX.Element;
  subValue?: any;
  filter?: string;
  checked?: boolean;
  warning?: string | undefined;
}

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
  filterHelpText?: string | ((filter: string, options: MultiSelectOption[]) => string | undefined);
  onSelectFilter?: (filter: string, options: MultiSelectOption[]) => void;
  onSave?: (selectedRows: RowType[], selectedOptions: MultiSelectOption[]) => Promise<boolean>;
  headers?: GridFormMultiSelectGroup[];
  options: MultiSelectOption[] | ((selectedRows: RowType[]) => Promise<MultiSelectOption[]> | MultiSelectOption[]);
  invalid?: (selectedRows: RowType[], selectedOptions: MultiSelectOption[]) => boolean;
}

export const GridFormMultiSelect = <RowType extends GridBaseRow>(props: GridFormMultiSelectProps<RowType>) => {
  const { selectedRows, data } = useGridPopoverContext<RowType>();

  const subComponentIsValidRef = useRef<Record<string, boolean>>({});
  const optionsInitialising = useRef(false);

  const [filter, setFilter] = useState("");
  const [initialValues, setInitialValues] = useState("");
  const [options, setOptions] = useState<MultiSelectOption[]>();

  const invalid = useCallback(() => {
    if (!options) return true;
    const selectedValues = options.filter((o) => o.checked).map((o) => o.value);
    const subValidations = pick(subComponentIsValidRef.current, selectedValues);
    if (Object.values(subValidations).some((v) => !v)) return true;
    return (
      props.invalid &&
      props.invalid(
        selectedRows,
        options.filter((o) => o.checked),
      )
    );
  }, [options, props, selectedRows]);

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (!options || !props.onSave) return true;

      // Any changes to save?
      if (initialValues === JSON.stringify(options)) return true;

      return props.onSave(
        selectedRows,
        options.filter((o) => o.checked),
      );
    },
    [initialValues, options, props],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;

    (async () => {
      const optionsList = typeof props.options === "function" ? await props.options(selectedRows) : props.options;
      setInitialValues(JSON.stringify(optionsList));
      setOptions(optionsList);
      optionsInitialising.current = false;
    })();
  }, [options, props, selectedRows]);

  /**
   * Groups options into their header groups
   */
  const headerGroups = useMemo(() => {
    if (!options) return undefined;
    const result = groupBy(
      options.filter((o) => textMatch(o.label, filter) && o.value),
      "filter",
    );
    // remove leading/trailing/duplicate dividers
    return fromPairs(
      toPairs(result).map(([key, arr]) => {
        let lastWasDivider = true;
        return [
          key,
          arr
            .map((row, index) => {
              if (row.value === MenuSeparatorString) {
                if (lastWasDivider) return null;
                if (index === arr.length - 1) return null;
                lastWasDivider = true;
              } else {
                lastWasDivider = false;
              }
              return row;
            })
            .filter((r) => r),
        ];
      }),
    ) as HeaderGroupType;
  }, [filter, options]);

  const headers: GridFormMultiSelectGroup[] = useMemo(() => props.headers ?? [{ header: "" }], [props.headers]);

  const { popoverWrapper, triggerSave } = useGridPopoverHook({
    className: props.className,
    invalid,
    save,
  });

  return popoverWrapper(
    <ComponentLoadingWrapper loading={!options} className={"GridFormMultiSelect-container"}>
      {options && (
        <>
          {props.filtered && (
            <FilterInput
              {...{ headerGroups, options, setOptions, filter, setFilter, triggerSave }}
              filterHelpText={props.filterHelpText}
              onSelectFilter={props.onSelectFilter}
              filterPlaceholder={props.filterPlaceholder}
            />
          )}

          {headerGroups && (
            <div className={"GridFormMultiSelect-options"}>
              {headers.map((header) => {
                const subOptions = headerGroups[`${header.filter}`];
                return (
                  !isEmpty(subOptions) && (
                    <>
                      {header.header && <MenuHeader>{header.header}</MenuHeader>}
                      {subOptions.map((item, index) =>
                        item.value === MenuSeparatorString ? (
                          <MenuDivider key={`div_${index}`} />
                        ) : (
                          <Fragment key={`val_${item.value}`}>
                            <MenuRadioItem item={item} options={options} setOptions={setOptions} />

                            {item.checked && item.subComponent && (
                              <MenuSubComponent
                                {...{ item, options, setOptions, data, triggerSave }}
                                subComponentIsValid={subComponentIsValidRef.current}
                              />
                            )}
                          </Fragment>
                        ),
                      )}
                    </>
                  )
                );
              })}
            </div>
          )}
        </>
      )}
    </ComponentLoadingWrapper>,
  );
};

const FilterInput = (props: {
  options: MultiSelectOption[];
  setOptions: (options: MultiSelectOption[]) => void;
  onSelectFilter?: (filter: string, options: MultiSelectOption[]) => void;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  headerGroups: HeaderGroupType;
  filterPlaceholder?: string;
  filterHelpText?: string | ((filter: string, options: MultiSelectOption[]) => string | undefined);
  triggerSave: () => Promise<void>;
}) => {
  const {
    options,
    setOptions,
    onSelectFilter,
    filter,
    setFilter,
    headerGroups,
    filterPlaceholder,
    filterHelpText,
    triggerSave,
  } = props;

  const enterHasBeenPressed = useRef(false);
  const lastKeyWasEnter = useRef(false);

  const toggleSelectAllVisible = useCallback(() => {
    if (!options || !headerGroups) return;

    if (isEmpty(filter.trim())) {
      // Toggle off if any items are checked otherwise on
      const anyChecked = options.some((o) => o.checked);
      options.forEach((o) => {
        if (o.label !== undefined) o.checked = !anyChecked;
      });
    } else {
      // Toggle on if any filtered items are checked otherwise off
      const anyChecked = Object.values(headerGroups).some((headerOptions) =>
        headerOptions.some((o) => o.checked === false),
      );
      Object.values(headerGroups).forEach((headerOptions) => {
        headerOptions.forEach((o) => {
          if (o.label !== undefined) o.checked = anyChecked;
        });
      });
    }
    setOptions([...options]);
  }, [filter, headerGroups, options, setOptions]);

  const addCustomFilterValue = useCallback(() => {
    if (!options || !onSelectFilter) return;

    const filterTrimmed = filter.trim();
    if (isEmpty(filterTrimmed)) {
      triggerSave().then();
      return;
    }

    const preFilterOptions = JSON.stringify(options);
    onSelectFilter(filterTrimmed, options);
    // Detect if options list changed and update
    if (preFilterOptions === JSON.stringify(options)) return;

    setOptions([...options]);
    setFilter("");
  }, [filter, onSelectFilter, options, setFilter, setOptions, triggerSave]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      enterHasBeenPressed.current = true;
    }
  }, []);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.stopPropagation();
        e.preventDefault();

        if (e.ctrlKey) toggleSelectAllVisible();
        else if (enterHasBeenPressed.current) {
          const filterTrimmed = filter.trim();
          if (isEmpty(filterTrimmed)) {
            triggerSave().then();
            return;
          }
          onSelectFilter && addCustomFilterValue();
        }
        lastKeyWasEnter.current = true;
      } else if (e.key === "Control") {
        lastKeyWasEnter.current && setFilter("");
        lastKeyWasEnter.current = false;
      } else {
        lastKeyWasEnter.current = false;
      }
    },
    [addCustomFilterValue, filter, onSelectFilter, setFilter, toggleSelectAllVisible, triggerSave],
  );

  return (
    <>
      <FocusableItem className={"filter-item"} key={"filter"}>
        {(_: any) => (
          <div style={{ width: "100%" }} className={"GridFormMultiSelect-filter"}>
            <input
              className={"LuiTextInput-input"}
              type="text"
              placeholder={filterPlaceholder ?? "Placeholder"}
              data-testid={"filteredMenu-free-text-input"}
              value={filter}
              data-disableenterautosave={true}
              data-allowtabtosave={true}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            />
            {filterHelpText && (
              <FormError
                error={null}
                helpText={
                  typeof filterHelpText === "function" ? filterHelpText(filter.trim(), options) : filterHelpText
                }
              />
            )}
          </div>
        )}
      </FocusableItem>
      <MenuDivider key={`$$divider_filter`} />
      {headerGroups && !toPairs(headerGroups).some(([_, options]) => !isEmpty(options)) && (
        <div className={"szh-menu__item GridPopoverEditDropDown-noOptions"}>No Options</div>
      )}
    </>
  );
};

const MenuRadioItem = (props: {
  item: MultiSelectOption;
  options: MultiSelectOption[];
  setOptions: (options: MultiSelectOption[]) => void;
}) => {
  const { item, options, setOptions } = props;

  const toggleValue = useCallback(
    (item: MultiSelectOption) => {
      item.checked = !item.checked;
      setOptions([...options]);
    },
    [options, setOptions],
  );

  return (
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
        label={
          <>
            {item.warning && <GridIcon icon={"ic_warning"} title={item.warning} />}
            {item.label ?? (item.value == null ? `<${item.value}>` : `${item.value}`)}
          </>
        }
        inputProps={{
          onClick: (e) => {
            // Click is handled by MenuItem onClick
            e.preventDefault();
            e.stopPropagation();
          },
        }}
        onChange={() => {
          /*Do nothing, change handled by menuItem*/
        }}
      />
    </MenuItem>
  );
};

const MenuSubComponent = (props: {
  data: any;
  item: MultiSelectOption;
  options: MultiSelectOption[];
  setOptions: (options: MultiSelectOption[]) => void;
  subComponentIsValid: Record<string, boolean>;
  triggerSave: () => Promise<void>;
}) => {
  const { data, item, options, setOptions, subComponentIsValid, triggerSave } = props;
  return (
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
                setOptions([...options]);
              },
              setValid: (valid: boolean) => {
                subComponentIsValid[`${item.value}`] = valid;
              },
              triggerSave,
            }}
          >
            <div className={"subComponent"}>
              <item.subComponent />
            </div>
          </GridSubComponentContext.Provider>
        )
      }
    </FocusableItem>
  );
};
