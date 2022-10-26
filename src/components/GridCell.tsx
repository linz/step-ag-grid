import { useCallback, useContext, useMemo, useState } from "react";
import { GridBaseRow } from "./Grid";
import { GridContext } from "../contexts/GridContext";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { GenericCellRendererParams, GridRendererGenericCell } from "./gridRender/GridRenderGenericCell";
import { ColDef, ICellEditorParams } from "ag-grid-community";

export interface GridFormProps<RowType extends GridBaseRow> {
  cellEditorParams: ICellEditorParams;
  updateValue: (saveFn: (selectedRows: RowType[]) => Promise<boolean>) => Promise<boolean>;
  saving: boolean;
  value: any;
  field: string | undefined;
  selectedRows: RowType[];
  formProps: Record<string, any>;
}

export interface GenericCellEditorParams<RowType extends GridBaseRow> {
  multiEdit?: boolean;
  form?: (props: GridFormProps<RowType>) => JSX.Element;
}

export interface GenericCellEditorColDef<
  RowType extends GridBaseRow,
  FormProps extends GenericCellEditorParams<RowType>,
> extends ColDef {
  cellEditorParams?: FormProps;
  cellRendererParams?: GenericCellRendererParams;
}

/**
 * For editing a text area.
 */
export const GridCell = <RowType extends GridBaseRow, FormProps extends GenericCellEditorParams<RowType>>(
  props: GenericCellEditorColDef<RowType, FormProps>,
): ColDef => {
  return {
    cellRenderer: props.cellRenderer ?? GridRendererGenericCell,
    sortable: !!(props?.field || props?.valueGetter),
    resizable: true,
    ...(props.cellEditorParams && {
      cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
      editable: true,
      cellEditor: GenericCellEditorComponent,
    }),
    ...props,
  };
};

interface GenericCellEditorICellEditorParams<RowType extends GridBaseRow, FormProps extends Record<string, any>>
  extends ICellEditorParams {
  data: RowType;
  colDef: GenericCellEditorColDef<RowType, FormProps>;
}

export const GenericCellEditorComponent = <RowType extends GridBaseRow, FormProps extends Record<string, any>>(
  props: GenericCellEditorICellEditorParams<RowType, FormProps>,
) => {
  const { updatingCells, getSelectedRows } = useContext(GridContext);

  const { colDef, data } = props;
  const { cellEditorParams } = props.colDef;
  const multiEdit = cellEditorParams?.multiEdit ?? false;
  const field = props.colDef.field ?? "";

  const formProps = colDef.cellEditorParams ?? {};
  const value = props.value;

  const selectedRows = useMemo(
    () => (multiEdit ? getSelectedRows<RowType>() : [data]),
    [data, getSelectedRows, multiEdit],
  );

  const [saving, setSaving] = useState(false);

  const updateValue = useCallback(
    async (saveFn: (selectedRows: any[]) => Promise<boolean>): Promise<boolean> => {
      return !saving && (await updatingCells({ selectedRows, field }, saveFn, setSaving));
    },
    [field, saving, selectedRows, updatingCells],
  );

  if (cellEditorParams == null) return <></>;

  return (
    <>
      <div>{colDef.cellRenderer ? <colDef.cellRenderer {...props} saving={saving} /> : props.value}</div>
      {cellEditorParams?.form && (
        <cellEditorParams.form
          cellEditorParams={props}
          updateValue={updateValue}
          saving={saving}
          formProps={formProps}
          value={value}
          field={field}
          selectedRows={selectedRows}
        />
      )}
    </>
  );
};
