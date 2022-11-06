import { forwardRef, useContext } from "react";
import { GridBaseRow } from "./Grid";
import { GridUpdatingContext } from "../contexts/GridUpdatingContext";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import {
  GenericCellColDef,
  GenericCellRendererParams,
  GridRendererGenericCell,
} from "./gridRender/GridRenderGenericCell";
import { ColDef, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridLoadableCell } from "./GridLoadableCell";
import { GridIcon } from "../components/GridIcon";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridPopoverContext } from "../contexts/GridPopoverContext";
import { GridPopoverContextProvider } from "../contexts/GridPopoverContextProvider";

export interface GenericCellEditorProps<E> {
  multiEdit?: boolean;
  editor?: (editorProps: E) => JSX.Element;
  editorParams?: E; // Omit<E, keyof CellParams<IFormTestRow>>
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

// This is so that typescript retains the row type to pass to the GridCells
export interface ColDefT<RowType extends GridBaseRow> extends ColDef {
  _?: RowType;
}

/*
 * All cells should use this
 */
export const GridCell = <RowType extends GridBaseRow, Props extends CellEditorCommon>(
  props: GenericCellColDef<RowType>,
  custom?: {
    multiEdit?: boolean;
    editor?: (editorProps: Props) => JSX.Element;
    editorParams?: Props;
  },
): ColDefT<RowType> => {
  return {
    colId: props.field,
    sortable: !!(props?.field || props?.valueGetter),
    resizable: true,
    ...(custom?.editor && {
      cellClass: custom?.multiEdit ? GenericMultiEditCellClass : undefined,
      editable: props.editable ?? true,
      cellEditor: GenericCellEditorComponent(custom.editor),
    }),
    ...(custom?.editorParams && {
      cellEditorParams: { ...custom.editorParams, multiEdit: custom.multiEdit },
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

export interface CellEditorCommon {
  className?: string | undefined;
}

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

const GenericCellEditorComponent3 = (props: ICellEditorParams & { editor: (props: any) => JSX.Element }) => {
  const { setProps, propsRef } = useContext(GridPopoverContext);

  const { colDef } = props;
  const { cellEditorParams } = colDef;
  const multiEdit = cellEditorParams?.multiEdit ?? false;

  // TODO don't need all these props in context
  setProps(props, multiEdit);

  return (
    <>
      {<colDef.cellRenderer {...props} />}
      {props?.editor && <props.editor {...cellEditorParams} {...propsRef.current} />}
    </>
  );
};
