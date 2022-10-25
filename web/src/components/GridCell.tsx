import { MutableRefObject, useCallback, useContext, useState } from "react";
import { BaseGridRow } from "./Grid";
import { GridContext } from "../contexts/GridContext";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { GenericCellRendererParams, GridGenericCellRendererComponent } from "./gridRender/GridRenderGenericCell";
import { ColDef, ICellEditorParams } from "ag-grid-community";

type SaveFn = (selectedRows: any[]) => Promise<boolean>;

export interface MyFormProps {
  cellEditorParams: ICellEditorParams;
  updateValue: (saveFn: (selectedRows: any[]) => Promise<boolean>) => Promise<boolean>;
  saving: boolean;
}

export interface GenericCellEditorParams {
  multiEdit?: boolean;
  form?: (props: MyFormProps) => JSX.Element;
}

export interface GenericCellEditorColDef<RowType, FormProps extends Record<string, any>> extends ColDef {
  cellEditorParams?: GenericCellEditorParams & FormProps;
  cellRendererParams?: GenericCellRendererParams;
}

/**
 * For editing a text area.
 */
export const GridCell = <RowType extends BaseGridRow, FormProps extends Record<string, any>>(
  props: GenericCellEditorColDef<RowType, FormProps>,
): ColDef => {
  return props.cellEditorParams
    ? {
        cellRenderer: props.cellRenderer ?? GridGenericCellRendererComponent,
        ...props,
        editable: props.editable ?? true,
        sortable: !!(props?.field || props?.valueGetter),
        resizable: true,
        cellEditor: GenericCellEditorComponent,
        cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
      }
    : {
        cellRenderer: props.cellRenderer ?? GridGenericCellRendererComponent,
        sortable: !!(props?.field || props?.valueGetter),
        resizable: true,
        ...props,
      };
};

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

  const { data } = props;
  const { cellEditorParams } = props.colDef;
  const multiEdit = cellEditorParams?.multiEdit ?? false;
  const field = props.colDef.field ?? "";

  const [saving, setSaving] = useState(false);

  const updateValue = useCallback(
    async (saveFn: (selectedRows: any[]) => Promise<boolean>): Promise<boolean> =>
      !saving && (await updatingCells({ data, multiEdit, field }, saveFn, setSaving)),
    [data, field, multiEdit, saving, updatingCells],
  );

  if (cellEditorParams == null) return <></>;

  // The key=${saving} ensures the cell re-renders when the updatingContext redraws.
  return (
    <>
      {cellEditorParams.form && (
        <cellEditorParams.form key={`${saving}`} cellEditorParams={props} updateValue={updateValue} saving={saving} />
      )}
    </>
  );
};
