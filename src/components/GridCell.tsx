import { forwardRef, useContext } from "react";
import { GridBaseRow } from "./Grid";
import { GridUpdatingContext } from "@contexts/GridUpdatingContext";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import {
  GenericCellColDef,
  GenericCellRendererParams,
  GridRendererGenericCell,
} from "./gridRender/GridRenderGenericCell";
import { ColDef, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridLoadableCell } from "./GridLoadableCell";
import { GridIcon } from "@components/GridIcon";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridPopoverContext } from "@contexts/GridPopoverContext";
import { GridPopoverContextProvider } from "@contexts/GridPopoverContextProvider";

export interface RendererProps<RowType extends GridBaseRow> extends Record<string, any> {
  data?: RowType;
}

export interface EditorProps<RowType extends GridBaseRow> extends Record<string, any> {
  data?: RowType;
}

export interface GenericCellEditorProps<
  RowType extends GridBaseRow,
  T extends RendererProps<RowType>,
  E extends EditorProps<RowType>,
> {
  renderer?: (rendererProps: T) => JSX.Element;
  editor?: (editorProps: E) => JSX.Element;
  rendererParams?: T;
  editorParams?: E;
}

export const GridCellRenderer = (props: ICellRendererParams) => {
  const { checkUpdating } = useContext(GridUpdatingContext);
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
export const GridCell = <RowType extends GridBaseRow>(
  props: GenericCellColDef<RowType>,
  custom?: GenericCellEditorProps<RowType, any, any>,
): ColDef => {
  return {
    sortable: !!(props?.field || props?.valueGetter),
    resizable: true,
    ...(custom?.editor && {
      cellClass: custom.editorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
      editable: props.editable ?? true,
      cellEditor: GenericCellEditorComponent(custom.editor),
    }),
    ...(custom?.editorParams && {
      cellEditorParams: custom.editorParams,
    }),
    // Default value formatter, otherwise react freaks out on objects
    valueFormatter: (params: ValueFormatterParams) => {
      if (params.value == null) return "-";
      const types = ["number", "boolean", "string"];
      if (types.includes(typeof params.value)) return `${params.value}`;
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

export interface CellParams<RowType extends GridBaseRow> {
  value: any;
  data: RowType;
  field: string | undefined;
  selectedRows: RowType[];
}

// TODO memo?
export const GenericCellEditorComponent = (editor: (props: any) => JSX.Element) =>
  forwardRef(function GenericCellEditorComponent2(props: ICellEditorParams, _) {
    return (
      <GridPopoverContextProvider>
        <GenericCellEditorComponent3 {...{ ...props, editor }} />
      </GridPopoverContextProvider>
    );
  });

export const GenericCellEditorComponent3 = (props: ICellEditorParams & { editor: (props: any) => JSX.Element }) => {
  const { setProps, propsRef } = useContext(GridPopoverContext);

  const { colDef } = props;
  const { cellEditorParams } = colDef;
  const multiEdit = cellEditorParams?.multiEdit ?? false;

  // TODO don't need all these props in context
  setProps(props, multiEdit);

  return (
    <>
      <div>{colDef.cellRenderer ? <colDef.cellRenderer {...props} /> : props.value}</div>
      {props?.editor && <props.editor {...cellEditorParams} {...propsRef.current} />}
    </>
  );
};
