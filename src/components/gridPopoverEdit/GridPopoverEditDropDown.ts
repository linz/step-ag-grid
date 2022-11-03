import { GenericMultiEditCellClass } from "../GenericCellClass";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormDropDown, GridFormPopoutDropDownProps } from "../gridForm/GridFormDropDown";
import { ColDef } from "ag-grid-community";

export const GridPopoverEditDropDown = <RowType extends GridBaseRow, ValueType>(
  colDef: ColDef,
  props: GenericCellEditorProps<GridFormPopoutDropDownProps<RowType, ValueType>>,
): ColDefT<RowType> =>
  GridCell(
    {
      initialWidth: 65,
      maxWidth: 150,
      cellClass: props.editorParams?.multiEdit ? GenericMultiEditCellClass : undefined,
      ...colDef,
    },
    {
      editor: GridFormDropDown,
      ...props,
    },
  );
