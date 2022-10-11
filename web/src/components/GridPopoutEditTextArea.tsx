import "./GridPopoutEditTextArea.scss";

import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./AgGrid";
import { AgGridContext } from "../contexts/AgGridContext";
import { FocusableItem } from "@szhsin/react-menu";

export interface GridPopoutEditTextAreaProps<RowType> {
  multiEdit?: boolean;
  onSave?: (selectRows: RowType[], value: string) => Promise<boolean> | boolean;
}

export interface GridPopoutEditTextAreaColDef<RowType> extends ColDef {
  cellEditorParams: GridPopoutEditTextAreaProps<RowType>;
}

/**
 * For editing a text area.
 */
export const GridPopoutEditTextArea = <RowType extends BaseAgGridRow, ValueType>(
  props: GridPopoutEditTextAreaColDef<RowType>,
): ColDef => ({
  ...props,
  editable: props.editable ?? true,
  cellEditor: GridPopoutEditTextAreaComp,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GridPopoutICellEditorParams<RowType extends BaseAgGridRow> extends ICellEditorParams {
  data: RowType;
  colDef: {
    field: string | undefined;
    cellEditorParams: GridPopoutEditTextAreaProps<RowType>;
  };
}

const GridPopoutEditTextAreaComp = <RowType extends BaseAgGridRow>(props: GridPopoutICellEditorParams<RowType>) => {
  const { cellEditorParams } = props.colDef;
  const field = props.colDef.field ?? "";

  const { updatingCells } = useContext(AgGridContext);

  const initialValue = useRef(props.data[field as keyof RowType] as string);
  const [value, setValue] = useState(initialValue.current);
  const [saving, setSaving] = useState(false);

  const updateValue = useCallback(
    async (value: string): Promise<boolean> => {
      // Nothing changed
      if (value === initialValue.current) return true;
      return await updatingCells(
        props,
        async (selectedRows) => {
          const hasChanged = selectedRows.some((row) => row[field as keyof RowType] !== value);
          if (hasChanged) {
            if (cellEditorParams?.onSave) {
              return cellEditorParams.onSave(selectedRows, value);
            }
            selectedRows.forEach((row) => (row[field as keyof RowType] = value));
          }
          return true;
        },
        setSaving,
      );
    },
    [cellEditorParams, field, props, updatingCells],
  );

  const children = (
    <FocusableItem className={"FreeTextInput LuiDeprecatedForms"}>
      {({ ref }: any) => (
        <textarea
          ref={ref}
          autoFocus
          maxLength={10000}
          spellCheck={true}
          className={"FreeTextInput-text-input"}
          onChange={(e) => setValue(e.target.value)}
          disabled={saving}
          defaultValue={value}
        />
      )}
    </FocusableItem>
  );
  return GridPopoutComponent(props, { children, canClose: () => updateValue(value) });
};
