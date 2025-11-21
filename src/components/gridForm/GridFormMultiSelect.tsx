import { LuiCheckboxInput } from '@linzjs/lui';
import { defer, fromPairs, groupBy, isEmpty, pick, toPairs } from 'lodash-es';
import React, {
  Dispatch,
  ForwardedRef,
  Fragment,
  KeyboardEvent,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useGridPopoverContext } from '../../contexts/GridPopoverContext';
import { GridSubComponentContext } from '../../contexts/GridSubComponentContext';
import { FormError } from '../../lui/FormError';
import { FocusableItem, MenuDivider, MenuHeader, MenuItem } from '../../react-menu3';
import { ClickEvent } from '../../react-menu3/types';
import { textMatch } from '../../utils/textMatcher';
import { ComponentLoadingWrapper } from '../ComponentLoadingWrapper';
import { CellEditorCommon } from '../GridCell';
import { GridIcon } from '../GridIcon';
import { useGridPopoverHook } from '../GridPopoverHook';
import { GridBaseRow } from '../types';
import { MenuSeparatorString } from './GridFormDropDown';

type HeaderGroupType = Record<string, MultiSelectOption[]> | undefined;

export interface MultiSelectOption {
  value: any;
  label?: string;
  subComponent?: (props: any) => ReactElement;
  subValue?: any;
  filter?: string;
  checked?: boolean;
  warning?: string | undefined;
}

export interface GridFormMultiSelectGroup {
  header: string;
  filter?: string;
}

export interface GridFormMultiSelectSaveProps<TData extends GridBaseRow> {
  selectedRows: TData[];
  selectedOptions: MultiSelectOption[];
}

export interface GridFormMultiSelectProps<TData extends GridBaseRow> extends CellEditorCommon {
  className?: // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | 'GridMultiSelect-containerSmall'
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | 'GridMultiSelect-containerMedium'
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | 'GridMultiSelect-containerLarge'
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | 'GridMultiSelect-containerUnlimited'
    | string
    | undefined;
  filtered?: boolean;
  filterPlaceholder?: string;
  filterHelpText?: string | ((filter: string, options: MultiSelectOption[]) => string | undefined);
  noOptionsMessage?: string;
  onSelectFilter?: (props: { filter: string; options: MultiSelectOption[] }) => void;
  onSave?: (props: GridFormMultiSelectSaveProps<TData>) => Promise<boolean>;
  headers?: GridFormMultiSelectGroup[];
  options: MultiSelectOption[] | ((selectedRows: TData[]) => Promise<MultiSelectOption[]> | MultiSelectOption[]);
  invalid?: (selectedRows: TData[], selectedOptions: MultiSelectOption[]) => boolean;
}

export const GridFormMultiSelect = <TData extends GridBaseRow>(props: GridFormMultiSelectProps<TData>) => {
  const { selectedRows, data } = useGridPopoverContext<TData>();

  const subComponentIsValidRef = useRef<Record<string, boolean>>({});
  const optionsInitialising = useRef(false);
  const firstInputSubComponent = useRef<HTMLInputElement | null>(null);

  const [filter, setFilter] = useState('');
  const [initialValues, setInitialValues] = useState('');
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
    async (selectedRows: TData[]): Promise<boolean> => {
      if (!options || !props.onSave) {
        return true;
      }

      // Any changes to save?
      if (initialValues === JSON.stringify(options)) {
        return true;
      }

      return props.onSave({
        selectedRows,
        selectedOptions: options.filter((o) => o.checked),
      });
    },
    [initialValues, options, props],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;

    void (async () => {
      const optionsList = typeof props.options === 'function' ? await props.options(selectedRows) : props.options;
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
      options.filter((o) => textMatch(o.label, filter) && o.value != null),
      'filter',
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

  const headers: GridFormMultiSelectGroup[] = useMemo(() => props.headers ?? [{ header: '' }], [props.headers]);

  const { popoverWrapper, triggerSave } = useGridPopoverHook({
    className: props.className,
    invalid,
    save,
  });

  return popoverWrapper(
    <ComponentLoadingWrapper loading={!options} className={'GridFormMultiSelect-container'}>
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
          {headerGroups &&
            (isEmpty(headerGroups) || !toPairs(headerGroups).some(([_, options]) => !isEmpty(options))) && (
              <MenuItem key={'noOptions'} className={'GridMultiSelect-noOptions'} disabled={true}>
                {props.noOptionsMessage ?? 'No Options'}
              </MenuItem>
            )}
          {headerGroups && !isEmpty(headerGroups) && (
            <div className={'GridFormMultiSelect-options'}>
              {headers.map((header, index) => {
                const subOptions = headerGroups[`${header.filter}`];
                return (
                  !isEmpty(subOptions) && (
                    <Fragment key={`group_${index}`}>
                      {header.header && <MenuHeader>{header.header}</MenuHeader>}
                      {subOptions.map((item, index) =>
                        item.value === MenuSeparatorString ? (
                          <MenuDivider key={`div_${index}`} />
                        ) : (
                          <Fragment key={`val_${item.value}`}>
                            <MenuRadioItem
                              item={item}
                              options={options}
                              setOptions={setOptions}
                              onChecked={() => {
                                // Default to focus on first input in subComponent
                                defer(() => {
                                  firstInputSubComponent.current?.focus();
                                });
                              }}
                            />
                            {item.checked && item.subComponent && (
                              <MenuSubComponent
                                {...{ item, options, setOptions, data, triggerSave }}
                                ref={firstInputSubComponent}
                                subComponentIsValid={subComponentIsValidRef.current}
                              />
                            )}
                          </Fragment>
                        ),
                      )}
                    </Fragment>
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
  onSelectFilter?: (props: { filter: string; options: MultiSelectOption[] }) => void;
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
    if (!options || !onSelectFilter) {
      return;
    }

    const filterTrimmed = filter.trim();
    if (isEmpty(filterTrimmed)) {
      void triggerSave();
      return;
    }

    const preFilterOptions = JSON.stringify(options);
    onSelectFilter({ filter: filterTrimmed, options });
    // Detect if options list changed and update
    if (preFilterOptions === JSON.stringify(options)) {
      return;
    }

    setOptions([...options]);
    setFilter('');
  }, [filter, onSelectFilter, options, setFilter, setOptions, triggerSave]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      enterHasBeenPressed.current = true;
    }
  }, []);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.stopPropagation();
        e.preventDefault();

        if (e.ctrlKey) toggleSelectAllVisible();
        else if (enterHasBeenPressed.current) {
          const filterTrimmed = filter.trim();
          if (isEmpty(filterTrimmed)) {
            void triggerSave();
            return;
          }
          onSelectFilter && addCustomFilterValue();
        }
        lastKeyWasEnter.current = true;
      } else if (e.key === 'Control') {
        lastKeyWasEnter.current && setFilter('');
        lastKeyWasEnter.current = false;
      } else {
        lastKeyWasEnter.current = false;
      }
    },
    [addCustomFilterValue, filter, onSelectFilter, setFilter, toggleSelectAllVisible, triggerSave],
  );

  return (
    <>
      <FocusableItem className={'filter-item'} key={'filter'}>
        {(_: any) => (
          <div style={{ width: '100%' }} className={'GridFormMultiSelect-filter'}>
            <input
              className={'LuiTextInput-input'}
              type="text"
              placeholder={filterPlaceholder ?? 'Filter...'}
              data-testid={'filteredMenu-free-text-input'}
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
                  typeof filterHelpText === 'function' ? filterHelpText(filter.trim(), options) : filterHelpText
                }
              />
            )}
          </div>
        )}
      </FocusableItem>
      <MenuDivider key={`$$divider_filter`} />
    </>
  );
};

const MenuRadioItem = (props: {
  item: MultiSelectOption;
  options: MultiSelectOption[];
  setOptions: (options: MultiSelectOption[]) => void;
  onChecked?: () => void;
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
        if (e.key !== 'Tab' && e.key !== 'Enter') {
          e.keepOpen = true;
          toggleValue(item);
        }
        item.checked && props.onChecked && props.onChecked();
      }}
    >
      <LuiCheckboxInput
        isChecked={item.checked ?? false}
        value={`${item.value}`}
        label={
          <>
            {item.warning && <GridIcon icon={'ic_warning_outline'} title={item.warning} />}
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

const MenuSubComponent = React.forwardRef(MenuSubComponentFr);

function MenuSubComponentFr(
  props: {
    data: any;
    item: MultiSelectOption;
    options: MultiSelectOption[];
    setOptions: (options: MultiSelectOption[]) => void;
    subComponentIsValid: Record<string, boolean>;
    triggerSave: () => Promise<void>;
  },
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { data, item, options, setOptions, subComponentIsValid, triggerSave } = props;
  const focusableRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (focusableRef.current) {
      const firstInputElement = focusableRef.current.querySelectorAll('input')[0] ?? null;
      if (typeof ref === 'function') {
        ref(firstInputElement);
      } else if (ref) {
        ref.current = firstInputElement;
      }
    }
  }, [ref]);

  return (
    <FocusableItem className={'LuiDeprecatedForms'} key={`${item.value}_subcomponent`} ref={focusableRef}>
      {() => (
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
          <div className={'subComponent'}>{item.subComponent && <item.subComponent />}</div>
        </GridSubComponentContext.Provider>
      )}
    </FocusableItem>
  );
}
