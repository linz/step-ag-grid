import { GridBaseRow } from "../Grid";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "@contexts/GridContext";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { MenuDivider, MenuItem } from "@react-menu3";
import { useGridPopoverHook } from "../GridPopoverHook";
import { CellParams } from "@components/GridCell";

export interface GridFormPopoutMenuProps<RowType extends GridBaseRow> {
  multiEdit?: boolean;
  options: (selectedRows: RowType[]) => Promise<MenuOption<RowType>[]>;
}

/** Menu configuration types **/
export const PopoutMenuSeparator = Object.freeze({ __isMenuSeparator__: true });

interface MenuSeparatorType {
  __isMenuSeparator__: boolean;
}

export interface MenuOption<RowType> {
  label: JSX.Element | string | MenuSeparatorType;
  action?: (selectedRows: RowType[]) => Promise<boolean>;
  disabled?: string | boolean;
  supportsMultiEdit: boolean;
  hidden?: boolean;
}

/**
 * NOTE: If the popout menu doesn't appear on single click when also selecting row it's because
 * you need a useMemo around your columnDefs
 */
export const GridFormPopoutMenu = <RowType extends GridBaseRow>(
  props: GridFormPopoutMenuProps<RowType> & CellParams<RowType>,
) => {
  const { updatingCells } = useContext(GridContext);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MenuOption<RowType>[]>();

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    const optionsConf = props.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        setOptions(await optionsConf(props.selectedRows));
      } else {
        setOptions(optionsConf);
      }

      optionsInitialising.current = false;
    })();
  }, [options, props.options, props.selectedRows]);

  const actionClick = useCallback(
    async (menuOption: MenuOption<any>) => {
      return await updatingCells({ selectedRows: props.selectedRows, field: props.field }, async (selectedRows) => {
        menuOption.action && (await menuOption.action(selectedRows));
        return true;
      });
    },
    [props.field, props.selectedRows, updatingCells],
  );

  const selectedRowCount = props.selectedRows.length;

  const filteredOptions = options?.filter((menuOption) => {
    return menuOption.label === PopoutMenuSeparator || selectedRowCount === 1 || menuOption.supportsMultiEdit;
  });

  const { popoverWrapper } = useGridPopoverHook();
  return popoverWrapper(
    <ComponentLoadingWrapper loading={!filteredOptions}>
      <div className={"Grid-popoverContainerList"}>
        {options?.map((item, index) =>
          item.label === PopoutMenuSeparator ? (
            <MenuDivider key={`$$divider_${index}`} />
          ) : (
            !item.hidden && (
              <MenuItem
                key={`${item.label}`}
                onClick={() => actionClick(item)}
                disabled={!!item.disabled || !filteredOptions?.includes(item)}
                title={item.disabled && typeof item.disabled !== "boolean" ? item.disabled : ""}
              >
                {item.label as JSX.Element | string}
              </MenuItem>
            )
          ),
        )}
      </div>
    </ComponentLoadingWrapper>,
  );
};
