import "./GridPopoutEditGenericInput.scss";

import { ColDef, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./AgGrid";
import { AgGridContext } from "../contexts/AgGridContext";
import { FocusableItem } from "@szhsin/react-menu";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { LuiTextInput } from "@linzjs/lui";
import { AgGridGenericCellRenderer } from "./AgGridGenericCellRenderer";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

export interface GridPopoutEditBearingCellEditorProps<RowType> {
  placeHolder: string;
  parser: (value: string) => number | null;
  validator: (value: string) => string | undefined;
  multiEdit: boolean;
  onSave?: (selectedRows: RowType[], value: number | null) => Promise<boolean> | boolean;
}

export interface GridPopoutEditCellRendererProps<RowType> {
  warning?: (props: ICellRendererParams) => string | boolean;
  info?: (props: ICellRendererParams) => string | boolean;
  formatter: (props: ValueFormatterParams) => string;
}

export interface GridPopoutEditBearingColDef<RowType> extends ColDef {
  cellEditorParams: GridPopoutEditBearingCellEditorProps<RowType>;
  cellRendererParams: GridPopoutEditCellRendererProps<RowType>;
}

/**
 * For editing a text area.
 */
export const GridPopoutEditGenericInput = <RowType extends BaseAgGridRow, ValueType>(
  props: GridPopoutEditBearingColDef<RowType>,
): ColDef => ({
  ...props,
  cellRenderer: AgGridGenericCellRenderer,
  valueFormatter: props.cellRendererParams.formatter,
  cellRendererParams: {
    ...props.cellRendererParams,
  },
  editable: props.editable ?? true,
  cellEditor: GridPopoutEditBearingComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GridPopoutICellEditorParams<RowType extends BaseAgGridRow> extends ICellEditorParams {
  data: RowType;
  colDef: {
    field: string;
    cellRendererParams: GridPopoutEditCellRendererProps<RowType>;
    cellEditorParams: GridPopoutEditBearingCellEditorProps<RowType>;
  };
}

const GridPopoutEditBearingComp = <RowType extends BaseAgGridRow>(props: GridPopoutICellEditorParams<RowType>) => {
  const { data } = props;
  const { cellRendererParams, cellEditorParams } = props.colDef;
  const { multiEdit } = cellEditorParams;
  const field = props.colDef.field;

  const { updatingCells } = useContext(AgGridContext);

  const sanitiseValue = (v: number): string => {
    return v != null ? `${v}` : "";
  };
  const initialValue = useRef(sanitiseValue(props.data[field as keyof RowType] as number));
  const [value, setValue] = useState(initialValue.current);
  const [saving, setSaving] = useState(false);

  const updateValue = useCallback(
    async (value: string): Promise<boolean> => {
      if (saving) return false;

      if (cellEditorParams.validator(value)) {
        // If we don't reselect the input the escape handler no longer works to cancel
        (document.querySelectorAll(".GridPopoutEditGenericInput input")[0] as HTMLElement)?.focus();
        return false;
      }

      return await updatingCells(
        { data, multiEdit, field },
        async (selectedRows) => {
          const hasChanged = selectedRows.some((row) => sanitiseValue(row[field as keyof RowType]) !== value);
          if (hasChanged) {
            const newValue = cellEditorParams.parser(value);
            if (cellEditorParams?.onSave) {
              return cellEditorParams.onSave(selectedRows, newValue);
            } else {
              selectedRows.forEach((row) => (row[field as keyof RowType] = newValue));
            }
          }
          return true;
        },
        setSaving,
      );
    },
    [cellEditorParams, data, field, multiEdit, saving, updatingCells],
  );
  const children = (
    <ComponentLoadingWrapper saving={saving}>
      <FocusableItem className={"free-FreeTextInput"}>
        {({ ref }: any) => (
          <div ref={ref} style={{ display: "flex", flexDirection: "row" }} className={"GridPopoutEditBearing"}>
            <LuiTextInput
              label={"Bearing correction"}
              value={value ?? ""}
              onChange={(e) => {
                setValue(e.target.value.trim());
              }}
              inputProps={{
                autoFocus: true,
                placeholder: cellEditorParams.placeHolder,
                disabled: false,
                maxLength: 16,
                onKeyDown: async (e) => {
                  if (e.key === "Enter") {
                    if (await updateValue(value)) {
                      props.api.stopEditing();
                    }
                  }
                },
              }}
              error={cellEditorParams.validator(value)}
            />
            <LuiTextInput
              label={"Formatted"}
              value={
                cellEditorParams.validator(value)
                  ? "?"
                  : cellRendererParams.formatter({
                      ...props,
                      value: cellEditorParams.parser(value),
                    } as ValueFormatterParams)
              }
              inputProps={{
                disabled: true,
              }}
            />
          </div>
        )}
      </FocusableItem>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children, canClose: () => updateValue(value) });
};
