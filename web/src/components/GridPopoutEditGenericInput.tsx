import "./GridPopoutEditGenericInput.scss";

import { ColDef, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseGridRow } from "./Grid";
import { GridContext } from "../contexts/GridContext";
import { FocusableItem } from "@szhsin/react-menu";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { GridGenericCellRendererComponent } from "./gridRender/GridRenderGenericCell";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { TextInputFormatted } from "../lui/TextInputFormatted";

export interface GridPopoutEditGenericInputCellEditorProps<RowType> {
  placeHolder: string;
  parser?: (value: string) => number | null;
  validator?: (value: string) => string | undefined;
  formatter?: (props: ValueFormatterParams) => string;
  multiEdit: boolean;
  onSave?: (selectedRows: RowType[], value: number | null) => Promise<boolean> | boolean;
}

export interface GridPopoutEditCellRendererProps<RowType> {
  warning?: (props: ICellRendererParams) => string | boolean;
  info?: (props: ICellRendererParams) => string | boolean;
}

export interface GridPopoutEditGenericInputColDef<RowType> extends ColDef {
  field: string;
  cellEditorParams: GridPopoutEditGenericInputCellEditorProps<RowType>;
  cellRendererParams: GridPopoutEditCellRendererProps<RowType>;
}

/**
 * For editing a text area.
 */
export const GridPopoutEditGenericInput = <RowType extends BaseGridRow, ValueType>(
  props: GridPopoutEditGenericInputColDef<RowType>,
): ColDef => ({
  ...props,
  cellRenderer: GridGenericCellRendererComponent,
  cellRendererParams: {
    ...props.cellRendererParams,
  },
  editable: props.editable ?? true,
  cellEditor: GridPopoutEditGenericInputComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GridPopoutICellEditorParams<RowType extends BaseGridRow> extends ICellEditorParams {
  data: RowType;
  colDef: GridPopoutEditGenericInputColDef<RowType>;
}

export const GridPopoutEditGenericInputComp = <RowType extends BaseGridRow>(
  props: GridPopoutICellEditorParams<RowType>,
) => {
  const { data } = props;
  const { cellEditorParams } = props.colDef;
  const { multiEdit } = cellEditorParams;
  const validator = useMemo(() => cellEditorParams.validator ?? (() => "No validator"), [cellEditorParams.validator]);
  const parser = useMemo(() => cellEditorParams.parser ?? (() => null), [cellEditorParams.parser]);
  const formatter = cellEditorParams.formatter ?? (() => "[Missing formatter]");
  const field = props.colDef.field;

  const { updatingCells } = useContext(GridContext);

  const sanitiseValue = (v: number): string => {
    return v != null ? `${v}` : "";
  };
  const initialValue = useRef(sanitiseValue(props.data[field as keyof RowType] as number));
  const [value, setValue] = useState(initialValue.current);
  const [saving, setSaving] = useState(false);

  const updateValue = useCallback(
    async (value: string): Promise<boolean> => {
      if (saving) return false;

      if (validator(value)) {
        // If we don't reselect the input the escape handler no longer works to cancel
        (document.querySelectorAll(".GridPopoutEditGenericInput input")[0] as HTMLElement)?.focus();
        return false;
      }

      return await updatingCells(
        { data, multiEdit, field },
        async (selectedRows) => {
          const hasChanged = selectedRows.some((row) => sanitiseValue(row[field as keyof RowType]) !== value);
          if (hasChanged) {
            const newValue = parser(value);
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
    [cellEditorParams, data, field, multiEdit, parser, saving, updatingCells, validator],
  );
  const children = (
    <ComponentLoadingWrapper saving={saving}>
      <FocusableItem className={"free-FreeTextInput"}>
        {({ ref }: any) => (
          <div ref={ref} className={"GridPopoutEditGenericInput"}>
            <TextInputFormatted
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
              formatted={
                validator(value)
                  ? "?"
                  : formatter({
                      ...props,
                      value: parser(value),
                    } as ValueFormatterParams)
              }
              error={validator(value)}
            />
          </div>
        )}
      </FocusableItem>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children, canClose: () => updateValue(value) });
};
