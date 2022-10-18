import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { useCallback, useContext, useState } from "react";
import { BaseGridRow } from "./Grid";
import { AgGridContext } from "../contexts/AgGridContext";
import { FocusableItem } from "@szhsin/react-menu";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { GenericCellRendererParams, GridGenericCellRendererComponent } from "./GridGenericCellRenderer";
import { CellEditorContextProvider } from "../contexts/CellEditorContextProvider";
import { CellEditorContext } from "../contexts/CellEditorContext";

export interface GenericCellEditorParams<FormProps extends Record<string, any>> {
  multiEdit: boolean;
  form: (props: FormProps) => JSX.Element;
  formProps: FormProps;
}

export interface GenericCellEditorColDef<RowType, FormProps extends Record<string, any>> extends ColDef {
  field: string;
  cellEditorParams: GenericCellEditorParams<FormProps>;
  cellRendererParams?: GenericCellRendererParams;
}

/**
 * For editing a text area.
 */
export const GridGenericCellEditor = <RowType extends BaseGridRow, FormProps extends Record<string, any>>(
  props: GenericCellEditorColDef<RowType, FormProps>,
): ColDef => ({
  ...props,
  editable: props.editable ?? true,
  cellRenderer: GridGenericCellRendererComponent,
  cellEditor: GenericCellEditorComponent,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GenericCellEditorICellEditorParams<RowType extends BaseGridRow, FormProps extends Record<string, any>>
  extends ICellEditorParams {
  data: RowType;
  colDef: GenericCellEditorColDef<RowType, FormProps>;
}

export const GenericCellEditorComponent = <RowType extends BaseGridRow, FormProps extends Record<string, any>>(
  props: GenericCellEditorICellEditorParams<RowType, FormProps>,
) => (
  <CellEditorContextProvider>
    <GenericCellEditorComponent2 {...props} />
  </CellEditorContextProvider>
);

export const GenericCellEditorComponent2 = <RowType extends BaseGridRow, FormProps extends Record<string, any>>(
  props: GenericCellEditorICellEditorParams<RowType, FormProps>,
) => {
  const { updatingCells } = useContext(AgGridContext);
  const { saveRef, cellEditorParamsRef } = useContext(CellEditorContext);

  cellEditorParamsRef.current = props;

  const { data } = props;
  const { cellEditorParams } = props.colDef;
  const { multiEdit } = cellEditorParams;
  const field = props.colDef.field ?? "";

  const [saving, setSaving] = useState(false);

  const updateValue = useCallback(async (): Promise<boolean> => {
    if (saving) return false;
    return await updatingCells({ data, multiEdit, field }, saveRef.current, setSaving);
  }, [data, field, multiEdit, saveRef, saving, updatingCells]);

  const children = (
    <ComponentLoadingWrapper saving={saving}>
      <FocusableItem>
        {({ ref }: any) => <cellEditorParams.form {...props.colDef.cellEditorParams.formProps} />}
      </FocusableItem>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children, canClose: updateValue });
};
