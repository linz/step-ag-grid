import { ForwardedRef, forwardRef, useCallback, useContext, useMemo, useState } from "react";
import { GridBaseRow } from "./Grid";
import { UpdatingContext } from "@contexts/UpdatingContext";
import { GridContext } from "@contexts/GridContext";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { GenericCellRendererParams, GridRendererGenericCell } from "./gridRender/GridRenderGenericCell";
import { ColDef, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridLoadableCell } from "./GridLoadableCell";
import { GridIcon } from "@components/GridIcon";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";

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
  cellRendererParams?: GenericCellRendererParams<RowType>;
}

export const GridCellRenderer = (props: ICellRendererParams) => {
  const { checkUpdating } = useContext(UpdatingContext);
  const colDef = props.colDef as ColDef;

  const rendererParams = colDef.cellRendererParams as GenericCellRendererParams<any> | undefined;
  const warningFn = rendererParams?.warning;
  const warningText = warningFn ? warningFn(props) : undefined;
  const infoFn = rendererParams?.info;
  const infoText = infoFn ? infoFn(props) : undefined;

  return colDef?.cellRendererParams?.originalCellRenderer ? (
    <GridLoadableCell isLoading={checkUpdating(colDef.field ?? colDef.colId ?? "", props.data.id)}>
      <>
        {typeof warningText === "string" && <GridIcon icon={"ic_warning"} title={warningText} />}
        {typeof infoText === "string" && <GridIcon icon={"ic_info"} title={infoText} />}
        <colDef.cellRendererParams.originalCellRenderer {...props} />
      </>
    </GridLoadableCell>
  ) : (
    <GridRendererGenericCell {...props} />
  );
};

/**
 * For editing a text area.
 */
export const GridCell = <RowType extends GridBaseRow, FormProps extends GenericCellEditorParams<RowType>>(
  props: GenericCellEditorColDef<RowType, FormProps>,
): ColDef => {
  return {
    sortable: !!(props?.field || props?.valueGetter),
    resizable: true,
    ...(props.cellEditorParams && {
      cellClass: props?.cellEditorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
      editable: true,
      cellEditor: GenericCellEditorComponent,
    }),
    // Default value formatter, otherwise react freaks out on objects
    valueFormatter: (params: ValueFormatterParams) => {
      const types = ["number", "undefined", "boolean", "string"];
      if (types.includes(typeof params.value)) return params.value;
      else return JSON.stringify(params.value);
    },
    ...props,
    cellRenderer: GridCellRenderer,
    cellRendererParams: {
      originalCellRenderer: props.cellRenderer,
      ...props.cellRendererParams,
    },
  };
};

interface GenericCellEditorICellEditorParams<RowType extends GridBaseRow, FormProps extends Record<string, any>>
  extends ICellEditorParams {
  data: RowType;
  colDef: GenericCellEditorColDef<RowType, FormProps>;
}

export const GenericCellEditorComponentFr = <RowType extends GridBaseRow, FormProps extends Record<string, any>>(
  props: GenericCellEditorICellEditorParams<RowType, FormProps>,
  _: ForwardedRef<any>, // We don't forward the ref, as that's for generic aggrid cell editing
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

export const GenericCellEditorComponent = forwardRef(GenericCellEditorComponentFr);
