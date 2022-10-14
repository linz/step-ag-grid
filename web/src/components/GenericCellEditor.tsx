import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useRef, useState } from "react";
import { BaseAgGridRow } from "./Grid";
import { AgGridContext } from "../contexts/AgGridContext";
import { FocusableItem } from "@szhsin/react-menu";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { GenericMultiEditCellClass } from "./GenericCellClass";

export type FormProps = { saveRef: Record<string, any> } & ICellEditorParams;

export interface GenericCellEditorProps<RowType> {
  multiEdit: boolean;
  form: (props: FormProps) => JSX.Element;
}

export interface GenericCellEditorColDef<RowType> extends ColDef {
  field: string;
  cellEditorParams: GenericCellEditorProps<RowType>;
}

/**
 * For editing a text area.
 */
export const GenericCellEditor = <RowType extends BaseAgGridRow, ValueType>(
  props: GenericCellEditorColDef<RowType>,
): ColDef => ({
  ...props,
  editable: props.editable ?? true,
  cellEditor: GenericCellEditorComponent,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GenericCellEditorICellEditorParams<RowType extends BaseAgGridRow> extends ICellEditorParams {
  data: RowType;
  colDef: GenericCellEditorColDef<RowType>;
}

export const GenericCellEditorComponent = <RowType extends BaseAgGridRow>(
  props: GenericCellEditorICellEditorParams<RowType>,
) => {
  const { data } = props;
  const { cellEditorParams } = props.colDef;
  const { multiEdit } = cellEditorParams;
  const field = props.colDef.field ?? "";

  const { updatingCells } = useContext(AgGridContext);
  const [saving, setSaving] = useState(false);

  const saveRef = useRef(async (selectedRows: RowType[]) => {
    console.error("Form is missing saveRef, cannot save");
    return false;
  });

  const updateValue = useCallback(async (): Promise<boolean> => {
    if (saving) return false;

    return await updatingCells(
      { data, multiEdit, field },
      async (selectedRows) => {
        return saveRef.current(selectedRows);
      },
      setSaving,
    );
  }, [data, field, multiEdit, saving, updatingCells]);

  const children = (
    <ComponentLoadingWrapper saving={saving}>
      <FocusableItem>{({ ref }: any) => <cellEditorParams.form {...props} saveRef={saveRef} />}</FocusableItem>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children, canClose: () => updateValue() });
};
