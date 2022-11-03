import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormMultiSelect, GridFormMultiSelectProps } from "../gridForm/GridFormMultiSelect";
import { ColDef } from "ag-grid-community";

export const GridPopoutEditMultiSelect = <RowType extends GridBaseRow, ValueType>(
  colDef: ColDef,
  props: { editorParams: GridFormMultiSelectProps<RowType, ValueType> },
) =>
  GridCell<RowType>(
    {
      initialWidth: 65,
      maxWidth: 150,
      cellClass: colDef.cellEditor?.multiEdit ? GenericMultiEditCellClass : undefined,
      ...colDef,
    },
    {
      editor: GridFormMultiSelect,
      ...props,
    },
  );
