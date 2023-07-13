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
  const { getColumns, getColumnIds, invisibleColumnIds, setInvisibleColumnIds } = useContext(GridContext);

  const columnStorageKey = useMemo(
    () =>
      isEmpty(getColumnIds())
        ? null // Grid hasn't been initialised yet
        : "stepAgGrid_invisibleColumnIds_" + getColumnIds().join("_"),
    [getColumnIds],
  );

  // infer the invisible ids from colDefs
  const resetColumns = useCallback(
    () => setInvisibleColumnIds(getColumnIds("initialHide")),
    [getColumnIds, setInvisibleColumnIds],
  );

  // Load state on start
  useEffect(() => {
    if (!columnStorageKey || loaded) return;
    if (saveState) {
      try {
        const stored = window.localStorage.getItem(columnStorageKey);
        if (!stored) {
          resetColumns();
        } else {
          const invisibleIds = JSON.parse(stored ?? "[]");
          if (!Array.isArray(invisibleIds)) {
            console.error(`stored invisible ids not an array: ${stored}`);
          } else if (!invisibleIds.every((id) => typeof id === "string")) {
            console.error(`stored invisible ids not strings: ${stored}`);
          } else {
            invisibleIds && setInvisibleColumnIds(invisibleIds);
          }
        }
      } catch (ex) {
        console.error(ex);
      }
      setLoaded(true);
    }
  }, [columnStorageKey, getColumns, loaded, resetColumns, saveState, setInvisibleColumnIds]);

  // Save state on column visibility change
  useEffect(() => {
    loaded &&
      columnStorageKey &&
      saveState &&
      window.localStorage.setItem(columnStorageKey, JSON.stringify(invisibleColumnIds));
  }, [columnStorageKey, invisibleColumnIds, loaded, saveState]);

  const toggleColumn = useCallback(
    (colId?: string) => {
      if (!colId || !invisibleColumnIds) return;
      setInvisibleColumnIds(
        invisibleColumnIds.includes(colId)
          ? invisibleColumnIds.filter((id) => id !== colId)
          : [...invisibleColumnIds, colId],
      );
    },
    [invisibleColumnIds, setInvisibleColumnIds],
  );

  const numericRegExp = /^\d+$/;
  const isNonManageableColumn = (col: ColDefT<GridBaseRow>) => {
    return col.lockVisible || col.colId == null || numericRegExp.test(col.colId);
  };

  return (
    <Menu
      menuButton={<GridFilterHeaderIconButton icon={"ic_columns"} title={"Column visibility"} />}
      menuClassName={"step-ag-grid-react-menu"}
      portal={true}
      unmountOnClose={true}
    >
      <div className={"GridFilterColumnsToggle-container"}>
        {getColumns("headerName").map((col) => (
          <MenuItem
            key={col.colId}
            disabled={isNonManageableColumn(col)}
            onClick={(e: ClickEvent) => {
              // Global react-menu MenuItem handler handles tabs
              if (e.key !== "Tab") {
                e.keepOpen = true;
                if (e.key !== "Enter") {
                  toggleColumn(col.colId);
                }
              }
            }}
          >
            <LuiCheckboxInput
              isChecked={!!invisibleColumnIds && !invisibleColumnIds.includes(col.colId ?? "")}
              value={`${col.colId}`}
              label={col.headerName ?? ""}
              isDisabled={isNonManageableColumn(col)}
              inputProps={{
                onClick: (e) => {
                  // Click is handled by MenuItem onClick so keyboard events work
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
          if (e.key !== "Tab") {
            e.keepOpen = e.key !== "Enter";
            resetColumns();
          }
        }}
      >
        <LuiIcon name={"ic_regenerate"} alt={"Reset columns"} size={"md"} className={"MenuItem-icon"} />
        Reset columns
      </MenuItem>
    </Menu>
  );
};
