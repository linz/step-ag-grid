import { ColDef, EditableCallback, ICellEditorParams, ICellRendererParams } from 'ag-grid-community';
import {
  SuppressKeyboardEventParams,
  ValueFormatterFunc,
  ValueFormatterParams,
  ValueGetterFunc,
  ValueGetterParams,
} from 'ag-grid-community';
import { forwardRef, ReactElement, useContext } from 'react';

import { GridPopoverContextProvider } from '../contexts/GridPopoverContextProvider';
import { GridUpdatingContext } from '../contexts/GridUpdatingContext';
import { fnOrVar } from '../utils/util';
import { GridBaseRow } from './Grid';
import { GridCellMultiSelectClassRules } from './GridCellMultiSelectClassRules';
import { GridIcon } from './GridIcon';
import { GridLoadableCell } from './GridLoadableCell';
import { GenericCellColDef, GenericCellRendererParams } from './gridRender';

export interface GenericCellEditorProps<E> {
  multiEdit?: boolean;
  editor?: (editorProps: E) => ReactElement;
  editorParams?: E;
}

export const GridCellRenderer = (props: ICellRendererParams) => {
  const { checkUpdating } = useContext(GridUpdatingContext);
  const colDef = props.colDef as ColDef;

  const rendererParams = colDef.cellRendererParams as GenericCellRendererParams<any> | undefined;
  const warningFn = rendererParams?.warning;
  let warningText = props.data !== undefined && warningFn ? warningFn(props) : undefined;
  const infoFn = rendererParams?.info;
  let infoText = props.data !== undefined && infoFn ? infoFn(props) : undefined;
  if (Array.isArray(warningText)) warningText = warningText.join('\n');
  if (Array.isArray(infoText)) infoText = infoText.join('\n');

  return checkUpdating(colDef.field ?? colDef.colId ?? '', props.data.id) ? (
    <GridLoadableCell />
  ) : (
    <>
      {!!warningText && (
        <GridIcon icon={'ic_warning_outline'} title={typeof warningText === 'string' ? warningText : 'Warning'} />
      )}
      {!!infoText && <GridIcon icon={'ic_info_outline'} title={typeof infoText === 'string' ? infoText : 'Info'} />}
      <div className={'GridCell-container'}>
        {colDef.cellRendererParams?.originalCellRenderer ? (
          <colDef.cellRendererParams.originalCellRenderer {...props} />
        ) : (
          <span title={props.valueFormatted ?? undefined}>{props.valueFormatted}</span>
        )}
      </div>
      {fnOrVar(colDef.editable, props) && rendererParams?.rightHoverElement && (
        <div className={'GridCell-hoverRight'}>{rendererParams?.rightHoverElement}</div>
      )}
    </>
  );
};

// This is so that typescript retains the row type to pass to the GridCells
export interface ColDefT<TData extends GridBaseRow, ValueType = any> extends ColDef<TData, ValueType> {
  editable?: boolean | EditableCallback<TData, ValueType>;
  valueGetter?: string | ValueGetterFunc<TData, ValueType>;
  valueFormatter?: string | ValueFormatterFunc<TData, ValueType>;
  cellRenderer?:
    | ((props: ICellRendererParams<TData, ValueType>) => ReactElement | string | false | null | undefined)
    | string;
  cellRendererParams?: {
    rightHoverElement?: ReactElement;
    originalCellRenderer?: any;
    editAction?: (selectedRows: TData[]) => void;
    shortcutKeys?: Record<string, () => void>;
    warning?: (props: ICellRendererParams<TData, ValueType>) => ReactElement | string | false | null | undefined;
    info?: (props: ICellRendererParams<TData, ValueType>) => ReactElement | string | false | null | undefined;
  };
  editor?: (editorProps: any) => ReactElement;
}

export const suppressCellKeyboardEvents = (e: SuppressKeyboardEventParams) => {
  const shortcutKeys = e.colDef.cellRendererParams?.shortcutKeys ?? {};
  const exec = shortcutKeys[e.event.key];
  if (exec && !e.editing && !e.event.repeat && e.event.type === 'keydown') {
    const editable = fnOrVar(e.colDef?.editable, e);
    return editable ? (exec(e) ?? true) : true;
  }
  // It's important that aggrid doesn't trigger edit on enter
  // as the incorrect selected rows will be returned
  return !['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Tab', ' ', 'Home', 'End', 'PageUp', 'PageDown'].includes(
    e.event.key,
  );
};

export const generateFilterGetter = <TData extends GridBaseRow, ValueType>(
  field: string | undefined,
  filterValueGetter: string | ValueGetterFunc<TData, ValueType> | undefined,
  valueFormatter: string | ValueFormatterFunc<TData, ValueType> | undefined,
): string | ValueGetterFunc<TData, ValueType> | undefined => {
  if (filterValueGetter) return filterValueGetter;
  // aggrid will default to valueGetter
  if (typeof valueFormatter !== 'function' || !field) return undefined;

  return (params: ValueGetterParams<TData, ValueType>): any => {
    const value = params.getValue(field);
    let formattedValue = valueFormatter({ ...params, value });
    // Search for null values using standard dash
    if (formattedValue === '–') formattedValue += ' -';
    // Search by raw value as well as formatted
    const gotValue = ['string', 'number'].includes(typeof value) ? value : undefined;
    return (formattedValue + (gotValue != null && formattedValue != gotValue ? ' ' + gotValue : '')) //
      .replace(/\s+/g, ' ')
      .trim();
  };
};

/*
 * All cells should use this.
 */
export const GridCell = <TData extends GridBaseRow, TValue = any, Props extends CellEditorCommon = any>(
  props: GenericCellColDef<TData, TValue>,
  custom?: {
    multiEdit?: boolean;
    preventAutoEdit?: boolean;
    editor?: (editorProps: Props) => ReactElement;
    editorParams?: Props;
  },
): ColDefT<TData, TValue> => {
  // props.field = ;
  // Generate a default filter value getter which uses the formatted value plus
  // the editable value if it's a string and different from the formatted value.
  // This is so that e.g. bearings can be searched for by DMS or raw number.
  const valueFormatter = props.valueFormatter;
  // FIXME
  const filterValueGetter = generateFilterGetter(props.field, props.filterValueGetter as any, valueFormatter as any);
  const exportable = props.exportable;
  // Can't leave this here ag-grid will complain
  delete props.exportable;

  return {
    colId: props.field ?? props.field,
    headerTooltip: props.headerName,
    // Technically valueGetter should not be here as it may not be sortable
    sortable: !!(props?.field || props?.valueGetter || props?.valueFormatter),
    resizable: true,
    editable: props.editable ?? false,
    ...(custom?.editor && {
      cellClassRules: GridCellMultiSelectClassRules,
      editable: props.editable ?? true,
      cellEditor: GenericCellEditorComponentWrapper(custom?.editor),
    }),
    suppressKeyboardEvent: suppressCellKeyboardEvents,
    ...(custom?.editorParams && {
      cellEditorParams: {
        ...custom.editorParams,
        multiEdit: custom.multiEdit,
        preventAutoEdit: custom.preventAutoEdit ?? false,
      },
    }),
    // If there's a valueFormatter and no filterValueGetter then create a filterValueGetter
    // FIXME
    filterValueGetter: filterValueGetter as any,
    // Default value formatter, otherwise react freaks out on objects
    valueFormatter: (params: ValueFormatterParams) => {
      if (params.value == null) return '–';
      const types = ['number', 'boolean', 'string'];
      if (types.includes(typeof params.value)) return `${params.value}`;
      else return JSON.stringify(params.value);
    },
    ...props,
    cellRenderer: typeof props.cellRenderer === 'string' ? props.cellRenderer : GridCellRenderer,
    cellRendererParams: {
      originalCellRenderer: props.cellRenderer,
      ...props.cellRendererParams,
    },
    headerComponentParams: {
      exportable,
      ...props.headerComponentParams,
    },
  };
};

export interface CellEditorCommon {
  className?: string | undefined;
}

export const GenericCellEditorComponentWrapper = (editor?: (props: any) => ReactElement) => {
  const obj = { editor };
  return forwardRef(function GenericCellEditorComponentFr(cellEditorParams: ICellEditorParams, _) {
    const valueFormatted = cellEditorParams.formatValue
      ? cellEditorParams.formatValue(cellEditorParams.value)
      : 'Missing formatter';
    return (
      <GridPopoverContextProvider props={cellEditorParams}>
        <>
          {
            <cellEditorParams.colDef.cellRenderer
              {...cellEditorParams}
              valueFormatted={valueFormatted}
              {...cellEditorParams.colDef.cellRendererParams}
            />
          }
          {obj.editor && <obj.editor {...cellEditorParams} />}
        </>
      </GridPopoverContextProvider>
    );
  });
};
