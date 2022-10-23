import { ColDef, ICellEditorParams } from "ag-grid-community";
import { GridPopoutComponent } from "./GridPopout";
import { MutableRefObject, useCallback, useContext, useRef, useState } from "react";
import { BaseGridRow } from "./Grid";
import { GridContext } from "../contexts/GridContext";
import { FocusableItem } from "@szhsin/react-menu";
import { ComponentLoadingWrapper } from "./ComponentLoadingWrapper";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { GenericCellRendererParams, GridGenericCellRendererComponent } from "./gridRender/GridRenderGenericCell";

type SaveFn = (selectedRows: any[]) => Promise<boolean>;

export interface GenericCellEditorParams<FormProps extends Record<string, any>> {
  multiEdit: boolean;
  form: (props: FormProps) => JSX.Element;
  formProps: FormProps;
}

export interface GenericCellEditorColDef<RowType, FormProps extends Record<string, any>> extends ColDef {
  cellEditorParams: GenericCellEditorParams<FormProps>;
  cellRendererParams?: GenericCellRendererParams;
}

/**
 * For editing a text area.
 */
export const GridGenericCellEditor = <RowType extends BaseGridRow, FormProps extends Record<string, any>>(
  props: GenericCellEditorColDef<RowType, FormProps>,
): ColDef => ({
  cellRenderer: props.cellRenderer ?? GridGenericCellRendererComponent,
  ...props,
  editable: props.editable ?? true,
  cellEditor: GenericCellEditorComponent,
  cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
});

interface GenericCellEditorICellEditorParams<RowType extends BaseGridRow, FormProps extends Record<string, any>>
  extends ICellEditorParams {
  data: RowType;
  colDef: GenericCellEditorColDef<RowType, FormProps>;
}

export interface GridGenericCellEditorFormContextParams {
  cellEditorParamsRef: MutableRefObject<ICellEditorParams>;
  saveRef: MutableRefObject<SaveFn>;
  triggerSave: () => Promise<void>;
}

export const GenericCellEditorComponent = <RowType extends BaseGridRow, FormProps extends Record<string, any>>(
  props: GenericCellEditorICellEditorParams<RowType, FormProps>,
) => {
  const { updatingCells } = useContext(GridContext);
  const cellEditorParamsRef = useRef<ICellEditorParams>({} as ICellEditorParams);
  const saveRef = useRef<SaveFn>(async () => {
    return false;
  });

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
        {({ ref }: any) => (
          <cellEditorParams.form
            {...props.colDef.cellEditorParams.formProps}
            saveRef={saveRef}
            cellEditorParamsRef={cellEditorParamsRef}
            triggerSave={updateValue}
          />
        )}
      </FocusableItem>
    </ComponentLoadingWrapper>
  );
  return GridPopoutComponent(props, { children, canClose: updateValue });
};
