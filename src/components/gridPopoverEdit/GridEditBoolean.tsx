import { CellFocusedEvent } from 'ag-grid-community';
import { CustomCellEditorProps } from 'ag-grid-react';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import { fnOrVar } from '../../utils/util';
import { clickInputWhenContainingCellClicked } from '../clickInputWhenContainingCellClicked';
import { CellEditorCommon, GridCell } from '../GridCell';
import { GenericCellColDef } from '../gridRender';
import { ColDefT, GridBaseRow } from '../types';

const BooleanCellRenderer = (props: CustomCellEditorProps) => {
  const { onValueChange, value, api, node, column, colDef, data } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkFocus = (event: CellFocusedEvent) => {
      if (event.rowIndex === node.rowIndex && event.column === column) {
        inputRef.current?.focus();
      }
    };
    api.addEventListener('cellFocused', checkFocus);
    return () => {
      api.removeEventListener('cellFocused', checkFocus);
    };
  }, [api, column, node.rowIndex]);

  const isDisabled = !fnOrVar(colDef?.editable, props);

  return (
    <div
      className={clsx('ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper', {
        'ag-checked': props.value,
        'ag-disabled': isDisabled,
      })}
    >
      <input
        type="checkbox"
        className="ag-input-field-input ag-checkbox-input"
        disabled={isDisabled}
        ref={inputRef}
        checked={value}
        onChange={() => {}}
        onClick={(e) => {
          e.stopPropagation();
          // cell has to be in edit mode
          // if in non-edit mode clickInputWhenContainingCellClicked will click to put it in edit mode
          if (!onValueChange) return;
          const params = props?.colDef?.cellEditorParams as GridEditBooleanEditorProps<any> | undefined;
          if (!params) return;
          // The data cannot be relied upon if grid changed whilst editing, data will be stale
          // So I get the data from the node itself which will be up to date.
          const selectedRows: { id: string | number }[] = [];
          api.forEachNode((n) => {
            if (n.data.id === data.id) {
              selectedRows.push(n.data);
            }
          });

          const checked = !value;
          onValueChange(checked);
          void params.onClick({ selectedRows, selectedRowIds: selectedRows.map((r) => r.id), checked });
        }}
      />
    </div>
  );
};

export interface GridEditBooleanEditorProps<TData extends GridBaseRow> extends CellEditorCommon {
  onClick: (props: {
    selectedRows: TData[];
    selectedRowIds: TData['id'][];
    checked: boolean;
  }) => Promise<boolean> | boolean;
}

export const GridEditBoolean = <TData extends GridBaseRow>(
  colDef: GenericCellColDef<TData, boolean>,
  editorProps: GridEditBooleanEditorProps<TData>,
): ColDefT<TData> => {
  return GridCell({
    minWidth: 64,
    maxWidth: 64,
    cellRenderer: BooleanCellRenderer as any,
    cellEditor: BooleanCellRenderer,
    cellEditorParams: editorProps,
    onCellClicked: clickInputWhenContainingCellClicked,
    singleClickEdit: true,
    resizable: false,
    editable: true,
    cellClass: 'GridCellAlignCenter',
    headerClass: 'GridHeaderAlignCenter',
    ...colDef,
  });
};
