import { GridBaseRow } from "../Grid";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { FocusableItem, MenuDivider, MenuItem } from "../../react-menu3";
import { useGridPopoverHook } from "../GridPopoverHook";
import { CellEditorCommon } from "../GridCell";
import { GridSubComponentContext } from "../../contexts/GridSubComponentContext";
import { ClickEvent } from "../../react-menu3/types";
import { useGridPopoverContext } from "../../contexts/GridPopoverContext";

export interface GridFormPopoverMenuProps<RowType extends GridBaseRow> extends CellEditorCommon {
  options: (selectedRows: RowType[]) => Promise<MenuOption<RowType>[]>;
  defaultAction?: (props: { selectedRows: RowType[]; menuOption: SelectedMenuOptionResult<RowType> }) => Promise<void>;
}

/** Menu configuration types **/
const __isMenuSeparator__ = "__isMenuSeparator__";
export const PopoutMenuSeparator = Object.freeze({ label: __isMenuSeparator__ });

interface MenuSeparatorType {
  __isMenuSeparator__: boolean;
}

export interface SelectedMenuOptionResult<RowType extends GridBaseRow> extends MenuOption<RowType> {
  subValue: any;
}

export interface MenuOption<RowType extends GridBaseRow> {
  label: JSX.Element | string | MenuSeparatorType;
  action?: (props: { selectedRows: RowType[]; menuOption: SelectedMenuOptionResult<RowType> }) => Promise<void>;
  disabled?: string | boolean;
  hidden?: boolean;
  subComponent?: (props: any) => JSX.Element;
}

/**
 * NOTE: If the popout menu doesn't appear on single click when also selecting row it's because
 * you need a useMemo around your columnDefs
 */
export const GridFormPopoverMenu = <RowType extends GridBaseRow>(props: GridFormPopoverMenuProps<RowType>) => {
  const { selectedRows, updateValue, data } = useGridPopoverContext<RowType>();

  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MenuOption<RowType>[]>();

  const [subComponentSelected, setSubComponentSelected] = useState<MenuOption<RowType> | null>(null);
  const subComponentIsValid = useRef(false);
  const [subSelectedValue, setSubSelectedValue] = useState<any>();

  const defaultAction = useCallback(
    async (params: { selectedRows: RowType[]; menuOption: SelectedMenuOptionResult<RowType> }) => {
      if (props.defaultAction) await props.defaultAction(params);
      else console.error(`No action specified for ${params.menuOption.label} menu options`);
    },
    [props],
  );

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    const optionsConf = props.options ?? [];

    (async () => {
      const newOptions = typeof optionsConf == "function" ? await optionsConf(selectedRows) : optionsConf;
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
    async (menuOption: MenuOption<RowType>) => {
      await (menuOption.action ?? defaultAction)({
        selectedRows,
        menuOption: { ...menuOption, subValue: subSelectedValue },
      });
      return true;
    },
    [defaultAction, selectedRows, subSelectedValue],
  );

  const onMenuItemClick = useCallback(
    async (e: ClickEvent, item: MenuOption<RowType>) => {
      if (item.subComponent) {
        subComponentIsValid.current = false;
        setSubSelectedValue(null);
        setSubComponentSelected(subComponentSelected === item ? null : item);
        e.keepOpen = true;
      } else {
        subComponentIsValid.current = true;
        setSubSelectedValue(null);
        await updateValue(async () => actionClick(item), e.key === "Tab" ? (e.shiftKey ? -1 : 1) : 0);
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
    <ComponentLoadingWrapper loading={!options} className={"GridFormPopupMenu"}>
      <>
        {options?.length === 0 ? (
          <MenuItem key={`GridPopoverMenu-empty`} className={"GridPopoverMenu-noOptions"} disabled={true}>
            No actions
          </MenuItem>
        ) : (
          options?.map((item, index) =>
            item.label === "__isMenuSeparator__" ? (
              <MenuDivider key={`$$divider_${index}`} />
            ) : (
              !item.hidden && (
                <Fragment key={`${item.label}`}>
                  <MenuItem
                    key={`${item.label}`}
                    onClick={(e: ClickEvent) => onMenuItemClick(e, item)}
                    disabled={!!item.disabled}
                    title={item.disabled && typeof item.disabled !== "boolean" ? item.disabled : ""}
                  >
                    {item.label as JSX.Element | string}
                  </MenuItem>
                  {item.subComponent && subComponentSelected === item && (
                    <FocusableItem className={"LuiDeprecatedForms"} key={`${item.label}_subcomponent`}>
                      {(_: any) =>
                        item.subComponent && (
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
                            <div className={"subComponent"}>
                              <item.subComponent />
                            </div>
                          </GridSubComponentContext.Provider>
                        )
                      }
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
