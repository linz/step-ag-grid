import "./GridPopoutMenu.scss";
import "@szhsin/react-menu/dist/index.css";

import { MenuItem, MenuDivider } from "@szhsin/react-menu";
import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./AgGrid";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { LuiIcon } from "@linzjs/lui";
import { AgGridContext } from "../contexts/AgGridContext";

export const MenuSeparator = Object.freeze({ __isMenuSeparator__: true });

interface MenuSeparatorType {
  __isMenuSeparator__: boolean;
}

export interface MenuOption<RowType> {
  label: JSX.Element | string | MenuSeparatorType;
  action: (selectedRows: RowType[]) => Promise<boolean>;
  multiEdit: boolean;
}

export interface GridPopoutMenuProps<RowType> {
  options: (selectedRows: RowType[]) => Promise<MenuOption<RowType>[]>;
}

export interface GridDropDownColDef<RowType> extends ColDef {
  cellEditorParams?: GridPopoutMenuProps<RowType>;
}

export const GridPopoutMenu = <RowType extends BaseAgGridRow>(props: GridDropDownColDef<RowType>): ColDef => ({
  ...props,
  editable: props.editable !== undefined ? props.editable : true,
  maxWidth: 64,
  cellRenderer: GridPopoutCellRender,
  cellRendererParams: {
    singleClickEdit: true,
  },
  cellEditor: GridPopoutMenuComp,
  cellClass: GenericMultiEditCellClass,
});

interface GridPopoutMenuICellEditorParams<RowType extends BaseAgGridRow> extends ICellEditorParams {
  data: RowType;
  colDef: {
    field: string;
    cellEditorParams: GridPopoutMenuProps<RowType>;
  };
}

export const GridPopoutCellRender = () => {
  return <LuiIcon name={"ic_more_vert"} alt={"More actions"} size={"md"} className={"GridPopoutMenu-burger"} />;
};

/**
 * NOTE: If the popout menu doesn't appear on single click when also selecting row it's because
 * you need a useMemo around your columnDefs
 */
export const GridPopoutMenuComp = <RowType extends BaseAgGridRow>(props: GridPopoutMenuICellEditorParams<RowType>) => {
  const { api, data } = props;
  const { cellEditorParams } = props.colDef;
  const field = props.colDef.field ?? "";

  const { updatingCells } = useContext(AgGridContext);
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
