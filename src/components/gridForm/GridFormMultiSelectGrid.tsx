import { useCallback, useEffect, useRef, useState } from "react";

import { LuiCheckboxInput } from "@linzjs/lui";

import { useGridPopoverContext } from "../../contexts/GridPopoverContext";
import { MenuItem } from "../../react-menu3";
import { ClickEvent } from "../../react-menu3/types";
import { wait } from "../../utils/util";
import { GridBaseRow } from "../Grid";
import { CellEditorCommon } from "../GridCell";
import { GridIcon } from "../GridIcon";
import { useGridPopoverHook } from "../GridPopoverHook";

export interface MultiSelectGridOption {
  value: any;
  label?: string;
  checked?: boolean | "partial";
  canSelectPartial?: boolean;
  warning?: string | undefined;
}

export interface GridFormMultiSelectGridSaveProps<RowType extends GridBaseRow> {
  selectedRows: RowType[];
  addValues: any[];
  removeValues: any[];
}

export interface GridFormMultiSelectGridProps<RowType extends GridBaseRow> extends CellEditorCommon {
  className?: string | undefined;
  noOptionsMessage?: string;
  onSave?: (props: GridFormMultiSelectGridSaveProps<RowType>) => Promise<boolean>;
  options:
    | MultiSelectGridOption[]
    | ((selectedRows: RowType[]) => Promise<MultiSelectGridOption[]> | MultiSelectGridOption[]);
  invalid?: (props: GridFormMultiSelectGridSaveProps<RowType>) => boolean;
}

export const GridFormMultiSelectGrid = <RowType extends GridBaseRow>(
  props: GridFormMultiSelectGridProps<RowType>,
): JSX.Element => {
  const { selectedRows } = useGridPopoverContext<RowType>();
  const optionsInitialising = useRef(false);

  const [initialValues, setInitialValues] = useState<MultiSelectGridOption[]>();
  const [options, setOptions] = useState<MultiSelectGridOption[]>();

  const genSave = useCallback(
    (selectedRows: RowType[]): GridFormMultiSelectGridSaveProps<RowType> => {
      if (!options) return { selectedRows, addValues: [], removeValues: [] };

      const preChecked = (initialValues ?? []).filter((o) => o.checked).map((o) => o.value);
      const postNotChecked = options.filter((o) => o.checked === false).map((o) => o.value);
      const removeValues = preChecked.filter((p) => postNotChecked.some((c) => c === p));

      const preNotChecked = (initialValues ?? []).filter((o) => o.checked !== true).map((o) => o.value);
      const postChecked = options.filter((o) => o.checked === true).map((o) => o.value);
      const addValues = preNotChecked.filter((p) => postChecked.some((c) => c === p));

      return { selectedRows, addValues, removeValues };
    },
    [initialValues, options],
  );

  const save = useCallback(
    async (selectedRows: RowType[]): Promise<boolean> => {
      if (!options || !props.onSave) return true;

      // Any changes to save?
      if (JSON.stringify(initialValues) === JSON.stringify(options)) return true;

      if (!props.onSave) return true;
      await wait(1);
      return await props.onSave(genSave(selectedRows));
    },
    [genSave, initialValues, options, props],
  );

  const invalid = useCallback(() => {
    if (!options) return true;
    return props.invalid && props.invalid(genSave(selectedRows));
  }, [genSave, options, props, selectedRows]);

  const { popoverWrapper } = useGridPopoverHook({
    className: props.className,
    save,
    invalid,
  });

  // Load up options list if it's async function
  useEffect(() => {
    if (options || optionsInitialising.current) return;
    optionsInitialising.current = true;

    (async () => {
      const optionsList = typeof props.options === "function" ? await props.options(selectedRows) : props.options;
      setInitialValues(JSON.parse(JSON.stringify(optionsList)));
      setOptions(optionsList);
      optionsInitialising.current = false;
    })();
  }, [options, props, selectedRows]);

  const toggleValue = useCallback(
    (item: MultiSelectGridOption) => {
      if (options) {
        item.checked = item.checked === true && item.canSelectPartial ? "partial" : !item.checked;
        setOptions([...options]);
      }
    },
    [options, setOptions],
  );

  return popoverWrapper(
    <>
      <div className={"Grid-popoverContainer"}>
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(10, auto)",
            maxWidth: "calc(min(100vw,500px))",
            overflowX: "auto",
          }}
        >
          {options &&
            options.map((o) => (
              <>
                <MenuItem
                  onClick={(e: ClickEvent) => {
                    // Global react-menu MenuItem handler handles tabs
                    if (e.key !== "Tab" && e.key !== "Enter") {
                      e.keepOpen = true;
                      toggleValue(o);
                    }
                  }}
                >
                  <LuiCheckboxInput
                    key={o.label}
                    isChecked={!!o.checked ?? false}
                    isIndeterminate={o.checked === "partial"}
                    value={`${o.value}`}
                    label={
                      <>
                        {o.warning && <GridIcon icon={"ic_warning_outline"} title={o.warning} />}
                        <span
                          className={"GridMultiSelectGrid-Label"}
                          style={{ fontWeight: o.label?.endsWith("0") ? "bold" : "regular" }}
                        >
                          {o.label ?? (o.value == null ? `<${o.value}>` : `${o.value}`)}
                        </span>
                      </>
                    }
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
              </>
            ))}
        </div>
      </div>
    </>,
  );
};
