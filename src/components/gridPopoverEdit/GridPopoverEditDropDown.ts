import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";
import { GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormDropDown, GridFormPopoutDropDownProps } from "../gridForm/GridFormDropDown";

export const GridPopoverEditDropDown = <RowType extends GridBaseRow, ValueType>(
  colDef: GenericCellColDef<RowType, GridFormPopoutDropDownProps<RowType, ValueType>>,
) =>
  GridCell<RowType, GridFormPopoutDropDownProps<RowType, ValueType>>({
    initialWidth: 65,
    maxWidth: 150,
    cellClass: colDef.cellEditor?.multiEdit ? GenericMultiEditCellClass : undefined,
    ...colDef,
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        ...colDef.cellEditorParams,
        form: GridFormDropDown,
      },
    }),
  });
