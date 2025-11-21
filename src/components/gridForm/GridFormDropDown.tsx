import debounce from 'debounce-promise';
import { compact, isEmpty } from 'lodash-es';
import { Fragment, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGridPopoverContext } from '../../contexts/GridPopoverContext';
import { GridSubComponentContext } from '../../contexts/GridSubComponentContext';
import { FormError } from '../../lui/FormError';
import { usePrevious } from '../../lui/reactUtils';
import { FocusableItem, MenuDivider, MenuHeader, MenuItem } from '../../react-menu3';
import { ClickEvent } from '../../react-menu3/types';
import { textMatch } from '../../utils/textMatcher';
import { isNotEmpty } from '../../utils/util';
import { ComponentLoadingWrapper } from '../ComponentLoadingWrapper';
import { CellEditorCommon } from '../GridCell';
import { useGridPopoverHook } from '../GridPopoverHook';
import { GridBaseRow } from '../types';

export interface GridPopoutEditDropDownSelectedItem<TData extends GridBaseRow, TOption> {
  // Note the row that was clicked on will be first
  selectedRows: TData[];
  selectedRowIds: TData['id'][];
  value: TOption;
  subComponentValue?: any;
}

interface FinalSelectOption<TOptionValue> {
  value: TOptionValue;
  label?: ReactElement | string;
  disabled?: boolean | string;
  subComponent?: (props: any, ref: any) => any;
}

export const primitiveToSelectOption = <T,>(value: T): SelectOption<T> => {
  return {
    value: value,
    label: value ? String(value) : '-',
  };
};

export const MenuSeparatorString = '_____MENU_SEPARATOR_____';
export const MenuSeparator = Object.freeze({ value: MenuSeparatorString });

export const MenuHeaderString = '_____MENU_HEADER_____';
export const MenuHeaderItem = (title: string) => {
  return { label: title, value: MenuHeaderString };
};

export type SelectOption<TOptionValue = any> = FinalSelectOption<TOptionValue>;

export type MaybePromise<T> = T | Promise<T>;

export interface GridFormDropDownProps<TData extends GridBaseRow, TOptionValue> extends CellEditorCommon {
  // This overrides CellEditorCommon to provide some common class options
  className?: // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | 'GridPopoverEditDropDown-containerSmall'
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | 'GridPopoverEditDropDown-containerMedium'
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | 'GridPopoverEditDropDown-containerLarge'
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | 'GridPopoverEditDropDown-containerUnlimited'
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | 'GridPopoverEditDropDown-containerAutoWidth'
    | string
    | undefined;
  // local means the use the local filter, otherwise it's expected options will be passed a function that takes a filter
  filtered?: 'local' | 'reload';
  filterDefaultValue?: string;
  filterPlaceholder?: string;
  filterHelpText?: string;
  noOptionsMessage?: string;
  onSelectedItem?: (props: GridPopoutEditDropDownSelectedItem<TData, TOptionValue>) => Promise<void> | void;
  onSelectFilter?: (props: GridPopoutEditDropDownSelectedItem<TData, TOptionValue>) => Promise<void> | void;
  options:
    | FinalSelectOption<TOptionValue>[]
    | ((selectedRows: TData[], filter?: string) => MaybePromise<FinalSelectOption<TOptionValue>[] | undefined>)
    | undefined;
  topComponent?: () => ReactElement;
}

const fieldToString = (field: any) => {
  return typeof field === 'symbol' ? field.toString() : `${field}`;
};

export const GridFormDropDown = <TData extends GridBaseRow, TOptionValue>(
  props: GridFormDropDownProps<TData, TOptionValue>,
) => {
  const { selectedRows, field, data } = useGridPopoverContext<TData>();
  const { onSelectFilter, options: propOptions, onSelectedItem } = props;

  // Save triggers during async action processing which triggers another selectItem(), this ref blocks that
  const [filter, setFilter] = useState(props.filterDefaultValue ?? '');
  const [filteredValues, setFilteredValues] = useState<any[]>();
  const [options, setOptions] = useState<FinalSelectOption<TOptionValue>[] | null>(
    !!propOptions && typeof propOptions !== 'function' ? propOptions : null,
  );
  const subComponentIsValid = useRef(false);
  const subComponentInitialValue = useRef<string | null>(null);
  const [subSelectedValue, setSubSelectedValue] = useState<any>(null);
  // Note: null is assumed to be the filter
  const [selectedItem, setSelectedItem] = useState<FinalSelectOption<TOptionValue> | null>(null);

  const selectItemHandler = useCallback(
    async (value: any, subComponentValue?: any): Promise<boolean> => {
      const hasChanged =
        selectedRows.some((row) => row[field] !== value) ||
        (subComponentValue !== undefined && subComponentInitialValue.current !== JSON.stringify(subComponentValue));
      if (hasChanged) {
        if (onSelectedItem) {
          await onSelectedItem({
            selectedRows,
            selectedRowIds: selectedRows.map((row) => row.id),
            value,
            subComponentValue,
          });
        } else {
          selectedRows.forEach((row) => (row[field] = value));
        }
      }
      return true;
    },
    [field, onSelectedItem, selectedRows],
  );

  /**
   * Saves are wrapped in updateValue and triggered by blur events
   */
  const save = useCallback(async () => {
    if (!options) {
      return true;
    }

    // Filter saved
    if (selectedItem === null) {
      if (onSelectFilter) {
        if (!isEmpty(filter)) {
          await onSelectFilter({
            selectedRows,
            selectedRowIds: selectedRows.map((row) => row.id),
            value: filter as any,
          });
        }

        return true;
      } else {
        if (filteredValues && filteredValues.length === 1) {
          if (filteredValues[0].subComponent) return false;
          return await selectItemHandler(filteredValues[0].value, null);
        }
      }
      return false;
    }
    if (selectedItem.subComponent && !subComponentIsValid.current) {
      return false;
    }
    await selectItemHandler(selectedItem.value, subSelectedValue);

    return true;
  }, [
    filter,
    filteredValues,
    onSelectFilter,
    options,
    selectItemHandler,
    selectedItem,
    selectedRows,
    subSelectedValue,
  ]);

  const { popoverWrapper } = useGridPopoverHook({
    className: props.className,
    invalid: () => !options || !!(selectedItem && !subComponentIsValid.current),
    save,
    dontSaveOnExternalClick: true,
  });

  // Load up options list if it's async function
  useEffect(() => {
    // If options is null then we need to load/reload
    // Options will be set to null during a reload based filter, or on open popup
    if (options !== null) {
      return;
    }

    // propOptions is a const list
    if (typeof propOptions !== 'function') {
      if (propOptions) {
        setOptions(propOptions);
      }
      return;
    }

    // propOptions is function, probably loading from web
    void (async () => {
      const r = await propOptions(selectedRows, filter);
      setOptions(r ?? []);
    })();
  }, [filter, options, propOptions, selectedRows]);

  // Local filtering.
  useEffect(() => {
    if (props.filtered !== 'local') {
      return;
    }
    if (options == null) {
      setFilteredValues([]);
      return;
    }

    setFilteredValues(
      compact(
        options.map((option) => {
          if (option.label != null && typeof option.label !== 'string') {
            console.warn('GridFormDropDown: Cannot filter non-string labels', option);
            return undefined;
          }
          return textMatch((option.label as string) || '', filter) ? option : undefined;
        }),
      ),
    );
  }, [props.filtered, filter, options]);

  const reSearchOnFilterChange = useMemo(
    () =>
      debounce(() => {
        setOptions(null);
      }, 500),
    [],
  );

  const previousFilter = usePrevious(filter);
  useEffect(() => {
    if (previousFilter != null && previousFilter != filter && props.filtered === 'reload') {
      void reSearchOnFilterChange();
    }
  }, [filter, previousFilter, props.filtered, reSearchOnFilterChange]);

  let lastHeader: ReactElement | null = null;
  let showHeader: ReactElement | null = null;

  return popoverWrapper(
    <>
      {props.filtered && (
        <div className={'GridFormDropDown-filter'}>
          <FocusableItem
            className={'filter-item'}
            onFocus={() => {
              setSelectedItem(null);
              setSubSelectedValue(null);
              subComponentIsValid.current = true;
            }}
          >
            {({ ref }: any) => (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <input
                  className={'LuiTextInput-input'}
                  ref={ref}
                  type="text"
                  placeholder={props.filterPlaceholder ?? 'Filter...'}
                  data-testid={'filteredMenu-free-text-input'}
                  defaultValue={filter}
                  data-allowtabtosave={true}
                  data-disableenterautosave={
                    !props.onSelectFilter &&
                    !(filteredValues && filteredValues.length === 1 && !filteredValues[0].subComponent)
                  }
                  onChange={(e) => setFilter(e.target.value.trim())}
                />
                {props.filterHelpText && isNotEmpty(filter) && (
                  <FormError error={null} helpText={props.filterHelpText} />
                )}
              </div>
            )}
          </FocusableItem>
          <MenuDivider key={`$$divider_filter`} />
          {props.topComponent && (
            <div>
              <props.topComponent />
              <MenuDivider key={`$$divider_filter`} />
            </div>
          )}
        </div>
      )}
      <ComponentLoadingWrapper loading={!options} className={'GridFormDropDown-options'}>
        <>
          {options && (isEmpty(options) || (filteredValues && isEmpty(filteredValues))) && (
            <MenuItem
              key={`${fieldToString(field)}-empty`}
              className={'GridPopoverEditDropDown-noOptions'}
              disabled={true}
            >
              {props.noOptionsMessage ?? 'No Options'}
            </MenuItem>
          )}
          {options?.map((item: FinalSelectOption<TOptionValue>, index) => {
            showHeader = null;
            if (item.value === MenuSeparatorString) {
              return <MenuDivider key={`$$divider_${index}`} />;
            } else if (item.value === MenuHeaderString) {
              lastHeader = <MenuHeader key={`$$header_${index}`}>{item.label}</MenuHeader>;
              return <></>;
            } else {
              if (lastHeader) {
                showHeader = lastHeader;
                lastHeader = null;
              }
            }
            return (
              (!filteredValues || filteredValues.includes(item)) && (
                <Fragment key={`${index}`}>
                  {showHeader}
                  <div key={`menu-wrapper-${index}`}>
                    <MenuItem
                      key={`${fieldToString(field)}-${index}`}
                      disabled={!!item.disabled}
                      title={item.disabled && typeof item.disabled !== 'boolean' ? item.disabled : ''}
                      value={item.value}
                      onFocus={() => {
                        if (selectedItem !== item) {
                          setSelectedItem(item);
                          setSubSelectedValue(null);
                          subComponentIsValid.current = true;
                          if (item.subComponent) {
                            subComponentInitialValue.current = null;
                          }
                        }
                      }}
                      onClick={(e: ClickEvent) => {
                        e.keepOpen = !!item.subComponent;
                      }}
                    >
                      {item.label ?? (item.value == null ? `<${String(item.value)}>` : `${String(item.value)}`)}
                      {item.subComponent ? '...' : ''}
                    </MenuItem>

                    {item.subComponent && selectedItem === item && (
                      <FocusableItem className={'LuiDeprecatedForms'} key={`${String(item.label)}_subcomponent`}>
                        {() => (
                          <GridSubComponentContext.Provider
                            value={{
                              context: { options },
                              data,
                              value: subSelectedValue,
                              setValue: (value: any) => {
                                setSubSelectedValue(value);
                                if (subComponentInitialValue.current === null) {
                                  // copy the default value of the subcomponent, so we can change detect on save
                                  subComponentInitialValue.current = JSON.stringify(value);
                                }
                              },
                              setValid: (valid: boolean) => {
                                subComponentIsValid.current = valid;
                              },
                              triggerSave: async () => {
                                // empty
                              },
                            }}
                          >
                            {item.subComponent && (
                              <div className={'subComponent'}>
                                <item.subComponent />
                              </div>
                            )}
                          </GridSubComponentContext.Provider>
                        )}
                      </FocusableItem>
                    )}
                  </div>
                </Fragment>
              )
            );
          })}
        </>
      </ComponentLoadingWrapper>
    </>,
  );
};
