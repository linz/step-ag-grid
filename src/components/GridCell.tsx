import { forwardRef, useContext } from "react";
import { GridBaseRow } from "./Grid";
import { GridUpdatingContext } from "../contexts/GridUpdatingContext";
import { GridCellMultiSelectClassRules } from "./GridCellMultiSelectClassRules";
import {
  GenericCellColDef,
  GenericCellRendererParams,
  RowValueFormatterParams,
  RowValueGetterParams,
} from "./gridRender/GridRenderGenericCell";
import { ColDef, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { GridLoadableCell } from "./GridLoadableCell";
import { GridIcon } from "./GridIcon";
import { SuppressKeyboardEventParams, ValueFormatterParams } from "ag-grid-community/dist/lib/entities/colDef";
import { GridPopoverContextProvider } from "../contexts/GridPopoverContextProvider";
import { fnOrVar } from "../utils/util";

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
  let warningText = warningFn ? warningFn(props) : undefined;
  const infoFn = rendererParams?.info;
  let infoText = infoFn ? infoFn(props) : undefined;
  if (Array.isArray(warningText)) warningText = warningText.join("\n");
  if (Array.isArray(infoText)) infoText = infoText.join("\n");

  return (
    <GridLoadableCell isLoading={checkUpdating(colDef.field ?? colDef.colId ?? "", props.data.id)}>
      <>
        {!!warningText && (
          <GridIcon icon={"ic_warning_outline"} title={typeof warningText === "string" ? warningText : "Warning"} />
        )}
        {!!infoText && <GridIcon icon={"ic_info_outline"} title={typeof infoText === "string" ? infoText : "Info"} />}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {colDef.cellRendererParams?.originalCellRenderer ? (
            <colDef.cellRendererParams.originalCellRenderer {...props} />
          ) : (
            <span title={props.valueFormatted}>{props.valueFormatted}</span>
          )}
        </div>
        {fnOrVar(colDef.editable, props) && rendererParams?.rightHoverElement && (
          <div style={{ display: "flex", alignItems: "center" }}>{rendererParams?.rightHoverElement}</div>
        )}
      </>
    </GridLoadableCell>
  );
};

// This is so that typescript retains the row type to pass to the GridCells
export interface ColDefT<RowType extends GridBaseRow> extends ColDef {
  _?: RowType;
  editor?: (editorProps: any) => JSX.Element;
}

export const suppressCellKeyboardEvents = (e: SuppressKeyboardEventParams) => {
  const shortcutKeys = e.colDef.cellRendererParams?.shortcutKeys ?? {};
  const exec = shortcutKeys[e.event.key];
  if (!e.editing && !e.event.repeat && e.event.type === "keypress" && exec) {
    const editable = fnOrVar(e.colDef?.editable, e);
    return editable ? exec(e) ?? true : true;
  }
  // It's important that aggrid doesn't trigger edit on enter
  // as the incorrect selected rows will be returned
  return !["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "Tab", " ", "Home", "End", "PageUp", "PageDown"].includes(
    e.event.key,
  );
};

export const generateFilterGetter = <RowType extends GridBaseRow>(
  field: string | undefined,
  filterValueGetter: string | ((params: RowValueGetterParams<RowType>) => string) | undefined,
  valueFormatter: string | ((params: RowValueFormatterParams<RowType>) => string) | undefined,
) => {
  if (filterValueGetter) return filterValueGetter;
  // aggrid will default to valueGetter
  if (typeof valueFormatter !== "function" || !field) return undefined;

  return (params: RowValueGetterParams<RowType>) => {
    const value = params.getValue(field);
    let formattedValue = valueFormatter({ ...params, value });
    // Search for null values using standard dash
    if (formattedValue === "–") formattedValue += " -";
    // Search by raw value as well as formatted
    const gotValue = ["string", "number"].includes(typeof value) ? value : undefined;
    return (formattedValue + (gotValue != null && formattedValue != gotValue ? " " + gotValue : "")) //
      .replaceAll(/\s+/g, " ")
      .trim();
  };
};

/*
 * All cells should use this.
 */
export const GridCell = <RowType extends GridBaseRow, Props extends CellEditorCommon>(
  props: GenericCellColDef<RowType>,
  custom?: {
    multiEdit?: boolean;
    editor?: (editorProps: Props) => JSX.Element;
    editorParams?: Props;
  },
): ColDefT<RowType> => {
  // Generate a default filter value getter which uses the formatted value plus
  // the editable value if it's a string and different from the formatted value.
  // This is so that e.g. bearings can be searched for by DMS or raw number.
  const valueFormatter = props.valueFormatter;
  const filterValueGetter = generateFilterGetter(props.field, props.filterValueGetter, valueFormatter);

  return {
    colId: props.field,
    sortable: !!(props?.field || props?.valueGetter),
    resizable: true,
    editable: props.editable ?? false,
    ...(custom?.editor && {
      cellClassRules: GridCellMultiSelectClassRules,
      editable: props.editable ?? true,
      cellEditor: GenericCellEditorComponentWrapper(custom?.editor),
    }),
    suppressKeyboardEvent: suppressCellKeyboardEvents,
    ...(custom?.editorParams && {
      cellEditorParams: { ...custom.editorParams, multiEdit: custom.multiEdit },
    }),
    // If there's a valueFormatter and no filterValueGetter then create a filterValueGetter
    filterValueGetter,
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

export const GenericCellEditorComponentWrapper = (editor?: (props: any) => JSX.Element) => {
  const obj = { editor };
  return forwardRef(function GenericCellEditorComponentFr(cellEditorParams: ICellEditorParams, _) {
    const valueFormatted = cellEditorParams.formatValue
      ? cellEditorParams.formatValue(cellEditorParams.value)
      : "Missing formatter";
    return (
      <GridPopoverContextProvider props={cellEditorParams}>
        {
          <cellEditorParams.colDef.cellRenderer
            {...cellEditorParams}
            valueFormatted={valueFormatted}
            {...cellEditorParams.colDef.cellRendererParams}
          />
        }
        {obj.editor && <obj.editor {...cellEditorParams} />}
      </GridPopoverContextProvider>
    );
  });
};
