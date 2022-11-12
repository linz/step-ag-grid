import { GridBaseRow } from "../Grid";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { FocusableItem, MenuDivider, MenuItem } from "../../react-menu3";
import { useGridPopoverHook } from "../GridPopoverHook";
import { CellEditorCommon } from "../GridCell";
import { GridSubComponentContext } from "../../contexts/GridSubComponentContext";
import { ClickEvent } from "../../react-menu3/types";
import { GridPopoverContext } from "../../contexts/GridPopoverContext";

export interface GridFormPopoutMenuProps<RowType extends GridBaseRow> extends CellEditorCommon {
  options: (selectedRows: RowType[]) => Promise<MenuOption<RowType>[]>;
}

/** Menu configuration types **/
export const PopoutMenuSeparator = Object.freeze({ __isMenuSeparator__: true });

interface MenuSeparatorType {
  __isMenuSeparator__: boolean;
}

export interface SelectedMenuOptionResult<RowType extends GridBaseRow> extends MenuOption<RowType> {
  subValue: any;
}

export interface MenuOption<RowType extends GridBaseRow> {
  label: JSX.Element | string | MenuSeparatorType;
  action?: (selectedRows: RowType[], menuOption: SelectedMenuOptionResult<RowType>) => Promise<void>;
  disabled?: string | boolean;
  supportsMultiEdit: boolean;
  hidden?: boolean;
  subComponent?: (props: any) => JSX.Element;
}

/**
 * NOTE: If the popout menu doesn't appear on single click when also selecting row it's because
 * you need a useMemo around your columnDefs
 */
export const GridFormPopoverMenu = <RowType extends GridBaseRow>(props: GridFormPopoutMenuProps<RowType>) => {
  const { selectedRows, updateValue } = useContext(GridPopoverContext);

  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MenuOption<RowType>[]>();

  // Save triggers during async action processing which triggers another action(), this ref blocks that
  const actionProcessing = useRef(false);
  const [subComponentSelected, setSubComponentSelected] = useState<MenuOption<RowType> | null>(null);
  const subComponentIsValid = useRef(false);
  const [subSelectedValue, setSubSelectedValue] = useState<any>();

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    const optionsConf = props.options ?? [];

    (async () => {
      setOptions(typeof optionsConf == "function" ? await optionsConf(selectedRows) : optionsConf);
      optionsInitialising.current = false;
    })();
  }, [options, props.options, selectedRows]);

  const actionClick = useCallback(
    async (menuOption: MenuOption<RowType>) => {
      actionProcessing.current = true;
      return updateValue(async () => {
        const result = { ...menuOption, subValue: subSelectedValue };
        menuOption.action && (await menuOption.action(selectedRows, result));
        actionProcessing.current = false;
        return true;
      });
    },
    [selectedRows, subSelectedValue, updateValue],
  );

  const onMenuItemClick = useCallback(
    (e: ClickEvent, item: MenuOption<RowType>) => {
      if (item.subComponent) {
        subComponentIsValid.current = false;
        setSubSelectedValue(null);
        setSubComponentSelected(subComponentSelected === item ? null : item);
        e.keepOpen = true;
      } else {
        setSubComponentSelected(null);
        actionClick(item).then();
      }
    },
    [actionClick, subComponentSelected],
  );

  const selectedRowCount = selectedRows.length;

  const filteredOptions = options?.filter((menuOption) => {
    return menuOption.label === PopoutMenuSeparator || selectedRowCount === 1 || menuOption.supportsMultiEdit;
  });

  const save = useCallback(async () => {
    // if a subcomponent is open we assume that it's meant to be saved.
    if (!actionProcessing.current && subComponentSelected) {
      if (!subComponentIsValid.current) return false;
      await actionClick(subComponentSelected);
    }
    return true;
  }, [actionClick, subComponentSelected]);

  const { popoverWrapper, triggerSave } = useGridPopoverHook({ className: props.className, save });

  const localTriggerSave = async (reason?: string) => {
    if (!subComponentIsValid.current) return;
    return triggerSave(reason);
  };

  return popoverWrapper(
    <ComponentLoadingWrapper loading={!filteredOptions} className={"GridFormPopupMenu"}>
      <>
        {options?.map((item, index) =>
          item.label === PopoutMenuSeparator ? (
            <MenuDivider key={`$$divider_${index}`} />
          ) : (
            !item.hidden && (
              <>
                <MenuItem
                  key={`${item.label}`}
                  onClick={(e: ClickEvent) => onMenuItemClick(e, item)}
                  disabled={!!item.disabled || !filteredOptions?.includes(item)}
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
                            value: subSelectedValue,
                            setValue: (value: any) => {
                              setSubSelectedValue(value);
                            },
                            setValid: (valid: boolean) => {
                              subComponentIsValid.current = valid;
                            },
                            triggerSave: localTriggerSave,
                          }}
                        >
                          <item.subComponent />
                        </GridSubComponentContext.Provider>
                      )
                    }
                  </FocusableItem>
                )}
              </>
            )
          ),
        )}
      </>
    </ComponentLoadingWrapper>,
  );
};
