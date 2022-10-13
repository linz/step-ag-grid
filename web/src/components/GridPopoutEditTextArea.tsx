import "./GridPopoutEditTextArea.scss";

import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useRef, useState } from "react";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseAgGridRow } from "./Grid";
import { AgGridContext } from "../contexts/AgGridContext";
import { FocusableItem } from "@szhsin/react-menu";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";

export interface GridPopoutEditTextAreaProps<RowType> {
  multiEdit: boolean;
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
    field: string;
    cellEditorParams: GridPopoutEditTextAreaProps<RowType>;
  };
}

const GridPopoutEditTextAreaComp = <RowType extends BaseAgGridRow>(props: GridPopoutICellEditorParams<RowType>) => {
  const { data } = props;
  const { cellEditorParams } = props.colDef;
  const { multiEdit } = cellEditorParams;
  const field = props.colDef.field;

  const { updatingCells } = useContext(AgGridContext);

  const initialValue = useRef(props.data[field as keyof RowType] as string);
  const [value, setValue] = useState(initialValue.current);
  const [saving, setSaving] = useState(false);

  const updateValue = useCallback(
    async (value: string): Promise<boolean> => {
      if (saving) return false;

      // Nothing changed
      if (value === initialValue.current) return true;
      return await updatingCells(
        { data, multiEdit, field },
        async (selectedRows) => {
          const hasChanged = selectedRows.some((row) => row[field as keyof RowType] !== value);
          if (hasChanged) {
            if (cellEditorParams?.onSave) {
              return cellEditorParams.onSave(selectedRows, value);
            } else {
              selectedRows.forEach((row) => (row[field as keyof RowType] = value));
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
      <FocusableItem className={"free-FreeTextInput LuiDeprecatedForms"}>
        {({ ref }: any) => (
          <textarea
            ref={ref}
            autoFocus
            maxLength={10000}
            spellCheck={true}
            className={"free-text-input"}
            onChange={(e) => setValue(e.target.value)}
            defaultValue={value}
          />
        )}
      </FocusableItem>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children, canClose: () => updateValue(value) });
};
