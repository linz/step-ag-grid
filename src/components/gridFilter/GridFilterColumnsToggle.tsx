import clsx from "clsx";
import { useContext } from "react";

import { LuiCheckboxInput, LuiIcon } from "@linzjs/lui";

import { GridContext } from "../../contexts/GridContext";
import { Menu, MenuDivider, MenuItem } from "../../react-menu3";
import { ClickEvent } from "../../react-menu3/types";
import { GridBaseRow } from "../Grid";
import { ColDefT } from "../GridCell";
import { GridFilterHeaderIconButton } from "./GridFilterHeaderIconButton";

export const GridFilterColumnsToggle = (): JSX.Element => {
  const { getColumns, toggleColumnVisibility, columnVisible, resetColumnVisibility } = useContext(GridContext);

  const toggleColumn = <T extends GridBaseRow>(col: ColDefT<T>) => {
    toggleColumnVisibility(col.colId ?? "");
  };

  const resetColumns = () => {
    resetColumnVisibility();
  };

  return (
    <div className={clsx("lui-margin-top-xxs lui-margin-bottom-xxs")} style={{ display: "flex", alignItems: "center" }}>
      <>
        <Menu menuButton={<GridFilterHeaderIconButton icon={"ic_columns"} />} menuClassName={"step-ag-grid-react-menu"}>
          {getColumns()
            .filter((col) => !!col.headerName)
            .map((col) => (
              <MenuItem
                key={col.colId}
                disabled={col.lockVisible}
                onClick={(e: ClickEvent) => {
                  // Global react-menu MenuItem handler handles tabs
                  if (e.key !== "Tab" && e.key !== "Enter") {
                    e.keepOpen = true;
                    toggleColumn(col);
                  }
                }}
              >
                <LuiCheckboxInput
                  isChecked={columnVisible(col.colId ?? "")}
                  value={`${col.colId}`}
                  label={col.headerName ?? ""}
                  isDisabled={col.lockVisible}
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
            ))}
          <MenuDivider key={`$$divider_reset_columns`} />
          <MenuItem
            key={"$$reset_columns"}
            onClick={(e: ClickEvent) => {
              // Global react-menu MenuItem handler handles tabs
              if (e.key !== "Tab" && e.key !== "Enter") {
                e.keepOpen = true;
                resetColumns();
              }
            }}
          >
            <LuiIcon name={"ic_regenerate"} alt={"Reset columns"} size={"md"} className={"MenuItemIcon"} />
            Reset columns
          </MenuItem>
        </Menu>
      </>
    </div>
  );
};
