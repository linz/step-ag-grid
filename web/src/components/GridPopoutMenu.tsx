import "./GridPopoutMenu.scss";
import "@szhsin/react-menu/dist/index.css";

import { MenuItem, MenuDivider } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseGridRow } from "./Grid";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { LuiIcon } from "@linzjs/lui";
import { GridContext } from "../contexts/GridContext";
import { UpdatingContext } from "../contexts/UpdatingContext";
import { GridLoadableCell } from "./GridLoadableCell";

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
 * Popout burger menu
 */
export const GridPopoutMenu = <RowType extends BaseGridRow>(props: GridDropDownColDef<RowType>): ColDef => ({
  ...props,
  editable: props.editable != null ? props.editable : true,
  sortable: false,
  maxWidth: 64,
  cellRenderer: GridPopoutCellRenderer,
  cellRendererParams: {
    // Menus open on single click, this parameter is picked up in Grid.tsx
    singleClickEdit: true,
  },
  cellEditor: GridPopoutMenuComponent,
  cellClass: GenericMultiEditCellClass,
});

export interface GridPopoutMenuProps<RowType> {
  options: (selectedRows: RowType[]) => Promise<MenuOption<RowType>[]>;
}

export interface GridDropDownColDef<RowType> extends ColDef {
  field: string;
  cellEditorParams?: GridPopoutMenuProps<RowType>;
}

interface GridPopoutMenuICellEditorParams<RowType extends BaseGridRow> extends ICellEditorParams {
  data: RowType;
  colDef: GridDropDownColDef<RowType>;
}

export const GridPopoutCellRenderer = (props: ICellRendererParams) => {
  const { checkUpdating } = useContext(UpdatingContext);
  const isLoading = checkUpdating(props.colDef?.field ?? "", props.data.id);
  const disabled = !props.colDef?.editable;

  return (
    <GridLoadableCell isLoading={isLoading}>
      <LuiIcon
        name={"ic_more_vert"}
        alt={"More actions"}
        size={"md"}
        className={disabled ? `GridPopoutMenu-burgerDisabled` : `GridPopoutMenu-burger`}
      />
    </GridLoadableCell>
  );
};

/**
 * NOTE: If the popout menu doesn't appear on single click when also selecting row it's because
 * you need a useMemo around your columnDefs
 */
export const GridPopoutMenuComponent = <RowType extends BaseGridRow>(
  props: GridPopoutMenuICellEditorParams<RowType>,
) => {
  const { api, data } = props;
  const { cellEditorParams } = props.colDef;
  const field = props.colDef.field ?? "";

  const { updatingCells } = useContext(GridContext);
  const optionsInitialising = useRef(false);
  const [options, setOptions] = useState<MenuOption<RowType>[]>();

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;
    const optionsConf = cellEditorParams?.options ?? [];

    (async () => {
      if (typeof optionsConf == "function") {
        setOptions(await optionsConf(api.getSelectedRows()));
      } else {
        setOptions(optionsConf);
      }

      optionsInitialising.current = false;
    })();
  }, [api, cellEditorParams?.options, options]);

  const actionClick = useCallback(
    async (menuOption: MenuOption<any>) => {
      return await updatingCells({ data, field, multiEdit: menuOption.multiEdit }, async (selectedRows) => {
        await menuOption.action(selectedRows);
        return true;
      });
    },
    [data, field, updatingCells],
  );

  const selectedRowCount = api.getSelectedRows().length;
  const filteredOptions = options?.filter(
    (menuOption) => menuOption.label === MenuSeparator || selectedRowCount === 1 || menuOption.multiEdit,
  );

  const children = (
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
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children });
};
