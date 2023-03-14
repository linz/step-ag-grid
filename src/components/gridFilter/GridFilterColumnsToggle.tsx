import clsx from "clsx";
import { isEmpty } from "lodash-es";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { LuiCheckboxInput, LuiIcon } from "@linzjs/lui";

import { GridContext } from "../../contexts/GridContext";
import { Menu, MenuDivider, MenuItem } from "../../react-menu3";
import { ClickEvent } from "../../react-menu3/types";
import { GridBaseRow } from "../Grid";
import { ColDefT } from "../GridCell";
import { GridFilterHeaderIconButton } from "./GridFilterHeaderIconButton";

export interface GridFilterColumnsToggleProps {
  saveState?: boolean;
}

export const GridFilterColumnsToggle = ({ saveState = true }: GridFilterColumnsToggleProps): JSX.Element => {
  const [loaded, setLoaded] = useState(false);
  const { getColumns, invisibleColumnIds, setInvisibleColumnIds } = useContext(GridContext);

  const columnStorageKey = useMemo(() => {
    // Grid hasn't been initialised yet
    if (isEmpty(getColumns())) return null;
    return (
      "stepAgGrid_invisibleColumnIds_" +
      getColumns()
        .map((col) => col.colId || "")
        .join("_")
    );
  }, [getColumns]);

  // Load state on start
  useEffect(() => {
    if (!columnStorageKey || loaded) return;
    if (saveState) {
      try {
        const stored = window.localStorage.getItem(columnStorageKey);
        const invisibleIds = JSON.parse(stored ?? "[]");
        if (!Array.isArray(invisibleIds)) {
          console.error(`stored invisible ids not an array: ${stored}`);
        } else if (!invisibleIds.every((id) => typeof id === "string")) {
          console.error(`stored invisible ids not strings: ${stored}`);
        } else {
          invisibleIds && setInvisibleColumnIds(invisibleIds);
          setLoaded(true);
        }
      } catch (ex) {
        console.error(ex);
      }
    }
  }, [columnStorageKey, loaded, saveState, setInvisibleColumnIds]);

  // Save state on column visibility change
  useEffect(() => {
    loaded &&
      columnStorageKey &&
      saveState &&
      window.localStorage.setItem(columnStorageKey, JSON.stringify(invisibleColumnIds));
  }, [columnStorageKey, invisibleColumnIds, loaded, saveState]);

  const toggleColumn = useCallback(
    (colId?: string) => {
      if (!colId) return;
      setInvisibleColumnIds(
        invisibleColumnIds.includes(colId)
          ? invisibleColumnIds.filter((id) => id !== colId)
          : [...invisibleColumnIds, colId],
      );
    },
    [invisibleColumnIds, setInvisibleColumnIds],
  );

  const resetColumns = () => {
    setInvisibleColumnIds([]);
  };

  const numericRegExp = /^\d+$/;
  const isNonManageableColum = (col: ColDefT<GridBaseRow>) => {
    return col.lockVisible || col.colId == null || numericRegExp.test(col.colId);
  };

  return (
    <div className={clsx("lui-margin-top-xxs lui-margin-bottom-xxs")} style={{ display: "flex", alignItems: "center" }}>
      <>
        <Menu
          menuButton={<GridFilterHeaderIconButton icon={"ic_columns"} title={"Column visibility"} />}
          menuClassName={"step-ag-grid-react-menu"}
          portal={true}
          unmountOnClose={true}
        >
          <div className={"GridFilterColumnsToggle-container"}>
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
                      toggleColumn(col.colId);
                    }
                  }}
                >
                  <LuiCheckboxInput
                    isChecked={!invisibleColumnIds.includes(col.colId ?? "")}
                    value={`${col.colId}`}
                    label={col.headerName ?? ""}
                    isDisabled={isNonManageableColum(col)}
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
          </div>
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
