import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormMultiSelect, GridFormMultiSelectProps } from "../gridForm/GridFormMultiSelect";
import { GenericCellColDef } from "@components/gridRender/GridRenderGenericCell";

export const GridPopoutEditMultiSelect = <RowType extends GridBaseRow, ValueType>(
  colDef: GenericCellColDef<RowType>,
  props: GenericCellEditorProps<RowType, any, GridFormMultiSelectProps<RowType, ValueType>>,
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
