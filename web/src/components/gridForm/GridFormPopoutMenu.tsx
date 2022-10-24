import { BaseGridRow } from "../Grid";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "../../contexts/GridContext";
import { ComponentLoadingWrapper } from "../ComponentLoadingWrapper";
import { MenuDivider, MenuItem } from "@szhsin/react-menu";
import { MyFormProps } from "../GridCell";
import { useGridPopoutHook } from "../GridPopoutHook";

export interface GridFormPopoutMenuProps<RowType> {
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
export const GridFormPopoutMenu = <RowType extends BaseGridRow>(props: MyFormProps) => {
  const { popoutWrapper } = useGridPopoutHook(props.cellEditorParams);
  const { colDef } = props.cellEditorParams;
  const formProps: GridFormPopoutMenuProps<RowType> = colDef.cellEditorParams;
  const { getSelectedRows } = useContext(GridContext);

  const { cellEditorParams } = props;
  const { data } = cellEditorParams;
  const field = colDef.field ?? colDef.colId ?? "";

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
        setOptions(await optionsConf(getSelectedRows()));
      } else {
        setOptions(optionsConf);
      }

      optionsInitialising.current = false;
    })();
  }, [getSelectedRows, options, formProps.options]);

  const actionClick = useCallback(
    async (menuOption: MenuOption<any>) => {
      return await updatingCells({ data, field, multiEdit: menuOption.multiEdit }, async (selectedRows) => {
        await menuOption.action(selectedRows);
        return true;
      });
    },
    [data, field, updatingCells],
  );

  const selectedRowCount = getSelectedRows().length;
  const filteredOptions = options?.filter(
    (menuOption) => menuOption.label === MenuSeparator || selectedRowCount === 1 || menuOption.multiEdit,
  );

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
