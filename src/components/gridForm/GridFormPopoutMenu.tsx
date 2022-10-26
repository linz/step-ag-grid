import { GridBaseRow } from "../Grid";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "../../contexts/GridContext";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { MenuDivider, MenuItem } from "@szhsin/react-menu";
import { GenericCellEditorParams, GridFormProps } from "../GridCell";
import { useGridPopoutHook } from "../GridPopoutHook";

export interface GridFormPopoutMenuProps<RowType extends GridBaseRow> extends GenericCellEditorParams<RowType> {
  options: (selectedRows: RowType[]) => Promise<MenuOption<RowType>[]>;
}

/** Menu configuration types **/
export const MenuSeparator = Object.freeze({ __isMenuSeparator__: true });

interface MenuSeparatorType {
  __isMenuSeparator__: boolean;
}

export interface MenuOption<RowType> {
  label: JSX.Element | string | MenuSeparatorType;
  action: (selectedRows: RowType[]) => Promise<boolean>;
  multiEdit: boolean;
}

/**
 * NOTE: If the popout menu doesn't appear on single click when also selecting row it's because
 * you need a useMemo around your columnDefs
 */
export const GridFormPopoutMenu = <RowType extends GridBaseRow>(props: GridFormProps<RowType>) => {
  const formProps = props.formProps as GridFormPopoutMenuProps<RowType>;

  const { updatingCells } = useContext(GridContext);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MenuOption<RowType>[]>();

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    const optionsConf = formProps.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        setOptions(await optionsConf(props.selectedRows));
      } else {
        setOptions(optionsConf);
      }

      optionsInitialising.current = false;
    })();
  }, [options, formProps.options, props.selectedRows]);

  const actionClick = useCallback(
    async (menuOption: MenuOption<any>) => {
      return await updatingCells({ selectedRows: props.selectedRows, field: props.field }, async (selectedRows) => {
        await menuOption.action(selectedRows);
        return true;
      });
    },
    [props.field, props.selectedRows, updatingCells],
  );

  const selectedRowCount = props.selectedRows.length;

  const filteredOptions = options?.filter((menuOption) => {
    return menuOption.label === MenuSeparator || selectedRowCount === 1 || menuOption.multiEdit;
  });

  const { popoutWrapper } = useGridPopoutHook(props);
  return popoutWrapper(
    <ComponentLoadingWrapper loading={!filteredOptions}>
      <>
        {options?.map((item, index) =>
          item.label === MenuSeparator ? (
            <MenuDivider key={`$$divider_${index}`} />
          ) : (
            <MenuItem
              key={`${item.label}`}
              onClick={() => actionClick(item)}
              disabled={!filteredOptions?.includes(item)}
            >
              {item.label as JSX.Element | string}
            </MenuItem>
          ),
        )}
      </>
    </ComponentLoadingWrapper>,
  );
};
