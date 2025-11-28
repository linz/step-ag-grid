import { isEmpty } from 'lodash-es';
import { Fragment, ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import { useGridPopoverContext } from '../../contexts/GridPopoverContext';
import { GridSubComponentContext } from '../../contexts/GridSubComponentContext';
import { FocusableItem, MenuDivider, MenuItem, SubMenu } from '../../react-menu3';
import { ClickEvent } from '../../react-menu3/types';
import { ComponentLoadingWrapper } from '../ComponentLoadingWrapper';
import { CellEditorCommon } from '../GridCell';
import { useGridPopoverHook } from '../GridPopoverHook';
import { GridBaseRow } from '../types';
import { MaybePromise } from './GridFormDropDown';

export interface GridFormPopoverMenuProps<TData extends GridBaseRow> extends CellEditorCommon {
  options: (selectedRows: TData[]) => Promise<MenuOption<TData>[]> | MenuOption<TData>[];
  defaultAction?: (props: {
    selectedRows: TData[];
    menuOption: SelectedMenuOptionResult<TData>;
  }) => Promise<void> | void;
}

/** Menu configuration types **/
const __isMenuSeparator__ = '__isMenuSeparator__';
export const PopoutMenuSeparator = Object.freeze({ label: __isMenuSeparator__ });

interface MenuSeparatorType {
  __isMenuSeparator__: boolean;
}

export interface SelectedMenuOptionResult<TData extends GridBaseRow> extends MenuOption<TData> {
  subValue: any;
}

export interface MenuOption<TData extends GridBaseRow> {
  label: ReactElement | string | MenuSeparatorType;
  subMenu?: () => ReactElement;
  action?: (props: { selectedRows: TData[]; menuOption: SelectedMenuOptionResult<TData> }) => MaybePromise<void>;
  disabled?: string | boolean;
  hidden?: boolean;
  subComponent?: (props: any) => ReactElement;
}

/**
 * NOTE: If the popout menu doesn't appear on single click when also selecting row it's because
 * you need a useMemo around your columnDefs
 */
export const GridFormPopoverMenu = <TData extends GridBaseRow>(props: GridFormPopoverMenuProps<TData>) => {
  const { selectedRows, updateValue, data } = useGridPopoverContext<TData>();

  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MenuOption<TData>[]>();

  const [subComponentSelected, setSubComponentSelected] = useState<MenuOption<TData> | null>(null);
  const subComponentIsValid = useRef(false);
  const [subSelectedValue, setSubSelectedValue] = useState<any>();

  const defaultAction = useCallback(
    async (params: { selectedRows: TData[]; menuOption: SelectedMenuOptionResult<TData> }) => {
      if (props.defaultAction) await props.defaultAction(params);
      else console.error(`No action specified for ${String(params.menuOption.label)} menu options`);
    },
    [props],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    const optionsConf = props.options ?? [];

    void (async () => {
      const newOptions = typeof optionsConf === 'function' ? await optionsConf(selectedRows) : optionsConf;
      setOptions(newOptions);
      if (!props.defaultAction) {
        const anyOptionsAreMissingAction = newOptions.some((option) => !option.action);
        if (anyOptionsAreMissingAction) {
          console.error("There's no default action handler and some Menu options are missing an action handler", {
            invalidMenuOptions: newOptions.filter((option) => !option.action),
          });
        }
      }
      optionsInitialising.current = false;
    })();
  }, [options, props.defaultAction, props.options, selectedRows]);

  const actionClick = useCallback(
    async (menuOption: MenuOption<TData>) => {
      await (menuOption.action ?? defaultAction)({
        selectedRows,
        menuOption: { ...menuOption, subValue: subSelectedValue },
      });
      return true;
    },
    [defaultAction, selectedRows, subSelectedValue],
  );

  const onMenuItemClick = useCallback(
    async (e: ClickEvent, item: MenuOption<TData>) => {
      if (item.subComponent) {
        subComponentIsValid.current = false;
        setSubSelectedValue(null);
        setSubComponentSelected(subComponentSelected === item ? null : item);
        e.keepOpen = true;
      } else {
        subComponentIsValid.current = true;
        setSubSelectedValue(null);
        await updateValue(async () => actionClick(item), e.key === 'Tab' ? (e.shiftKey ? -1 : 1) : 0);
      }
    },
    [actionClick, subComponentSelected, updateValue],
  );

  const save = useCallback(async () => {
    // if a subcomponent is open we assume that it's meant to be saved.
    if (subComponentSelected) {
      if (!subComponentIsValid.current) return false;
      await actionClick(subComponentSelected);
    }
    // Close the menu
    return true;
  }, [actionClick, subComponentSelected]);

  const { popoverWrapper, triggerSave } = useGridPopoverHook({
    className: props.className,
    invalid: () => subComponentSelected && !subComponentIsValid.current,
    save,
  });

  return popoverWrapper(
    <ComponentLoadingWrapper loading={!options} className={'GridFormPopupMenu'}>
      <>
        {isEmpty(options) ? (
          <MenuItem key={`GridPopoverMenu-empty`} className={'GridPopoverMenu-noOptions'} disabled={true}>
            No actions
          </MenuItem>
        ) : (
          options?.map((item, index) =>
            item.label === '__isMenuSeparator__' ? (
              <MenuDivider key={`$$divider_${index}`} />
            ) : (
              !item.hidden && (
                <Fragment key={`${String(item.label)}`}>
                  {item.subMenu ? (
                    <SubMenu
                      key={`${String(item.label)}`}
                      disabled={!!item.disabled}
                      label={item.label as string}
                      title={item.disabled && typeof item.disabled !== 'boolean' ? item.disabled : ''}
                    >
                      <item.subMenu />
                    </SubMenu>
                  ) : (
                    <MenuItem
                      key={`${String(item.label)}`}
                      onClick={(e: ClickEvent) => void onMenuItemClick(e, item)}
                      disabled={!!item.disabled}
                      title={item.disabled && typeof item.disabled !== 'boolean' ? item.disabled : ''}
                    >
                      {item.label as ReactElement | string}
                    </MenuItem>
                  )}
                  {item.subComponent && subComponentSelected === item && (
                    <FocusableItem className={'LuiDeprecatedForms'} key={`${String(item.label)}_subcomponent`}>
                      {() => (
                        <GridSubComponentContext.Provider
                          value={{
                            context: {},
                            data,
                            value: subSelectedValue,
                            setValue: (value: any) => {
                              setSubSelectedValue(value);
                            },
                            setValid: (valid: boolean) => {
                              subComponentIsValid.current = valid;
                            },
                            triggerSave,
                          }}
                        >
                          <div className={'subComponent'}>{item.subComponent && <item.subComponent />}</div>
                        </GridSubComponentContext.Provider>
                      )}
                    </FocusableItem>
                  )}
                </Fragment>
              )
            ),
          )
        )}
      </>
    </ComponentLoadingWrapper>,
  );
};
