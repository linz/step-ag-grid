import { CellFocusedEvent } from "ag-grid-community";
import { CellEditorCommon, ColDefT, GridCell } from "../GridCell";
import { useEffect, useRef } from "react";
import { fnOrVar } from "../../utils/util";
import clsx from "clsx";
import { GenericCellColDef } from "../gridRender";
import { GridBaseRow } from "../Grid";
import { CustomCellEditorProps } from "ag-grid-react";
import { clickInputWhenContainingCellClicked } from "../clickInputWhenContainingCellClicked";

const BooleanCellRenderer = (props: CustomCellEditorProps) => {
  const { onValueChange, value, api, node, column, colDef, data } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkFocus = (event: CellFocusedEvent) => {
      if (event.rowIndex === node.rowIndex && event.column === column) {
        inputRef.current?.focus();
      }
    };
    api.addEventListener("cellFocused", checkFocus);
    return () => {
      api.removeEventListener("cellFocused", checkFocus);
    };
  }, [api, column, node.rowIndex]);

  return (
    <div className={clsx("ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper", { "ag-checked": props.value })}>
      <input
        type="checkbox"
        className="ag-input-field-input ag-checkbox-input"
        disabled={!fnOrVar(colDef?.editable, props)}
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
          const selectedRows = [data];
          const checked = !value;
          onValueChange(checked);
          params.onClick({ selectedRows, selectedRowIds: selectedRows.map((r) => r.id), checked }).then();
        }}
      />
    </div>
  );
};

export interface GridEditBooleanEditorProps<TData> extends CellEditorCommon {
  onClick: (props: {
    selectedRows: TData[];
    selectedRowIds: (string | number)[];
    checked: boolean;
  }) => Promise<boolean>;
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
    cellClass: "LabelPreferencesPanelGridCellAlignCenter",
    headerClass: "LabelPreferencesPanelGridHeaderAlignCenter",
    ...colDef,
  });
};
