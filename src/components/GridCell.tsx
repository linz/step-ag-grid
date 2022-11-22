import { forwardRef, useContext } from "react";
import { GridBaseRow } from "./Grid";
import { GridUpdatingContext } from "../contexts/GridUpdatingContext";
import { GridCellMultiSelectClassRules } from "./GridCellMultiSelectClassRules";
import {
  GenericCellColDef,
  GenericCellRendererParams,
  GridRendererGenericCell,
} from "./gridRender/GridRenderGenericCell";
import { ColDef, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridLoadableCell } from "./GridLoadableCell";
import { GridIcon } from "./GridIcon";
import { ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridPopoverContextProvider } from "../contexts/GridPopoverContextProvider";

export interface GenericCellEditorProps<E> {
  multiEdit?: boolean;
  editor?: (editorProps: E) => JSX.Element;
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

// This is so that typescript retains the row type to pass to the GridCells
export interface ColDefT<RowType extends GridBaseRow> extends ColDef {
  _?: RowType;
  editor?: (editorProps: any) => JSX.Element;
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
      cellClassRules: GridCellMultiSelectClassRules,
      editable: props.editable ?? true,
      cellEditor: GenericCellEditorComponentWrapper(custom),
    }),
    suppressKeyboardEvent: (e) => {
      // It's important that aggrid doesn't trigger edit on enter
      // as the incorrect selected rows will be returned
      return !["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "Tab", " "].includes(e.event.key);
    },
    ...(custom?.editorParams && {
      cellEditorParams: { ...custom.editorParams, multiEdit: custom.multiEdit },
    }),
    // Default value formatter, otherwise react freaks out on objects
    valueFormatter: (params: ValueFormatterParams) => {
      if (params.value == null) return "–";
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

export const GenericCellEditorComponentWrapper = (custom?: { editor?: (props: any) => JSX.Element }) => {
  return forwardRef(function GenericCellEditorComponentFr(cellEditorParams: ICellEditorParams, _) {
    return (
      <GridPopoverContextProvider props={cellEditorParams}>
        {<cellEditorParams.colDef.cellRenderer {...cellEditorParams} {...cellEditorParams.colDef.cellRendererParams} />}
        {custom?.editor && <custom.editor {...cellEditorParams} />}
      </GridPopoverContextProvider>
    );
  });
};
