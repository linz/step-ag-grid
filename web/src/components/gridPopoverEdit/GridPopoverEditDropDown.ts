import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GenericCellColDef, GridGenericCellRendererComponent } from "../gridRender/GridRenderGenericCell";
import { GridCell } from "../GridCell";
import { BaseGridRow } from "../Grid";
import { GridFormDropDown, GridFormPopoutDropDownProps } from "../gridForm/GridFormDropDown";

export const GridPopoutEditDropDown = <RowType extends BaseGridRow, ValueType>(
  colDef: GenericCellColDef<GridFormPopoutDropDownProps<RowType, ValueType>>,
) =>
  GridCell({
    initialWidth: 65,
    maxWidth: 150,
    cellRenderer: GridGenericCellRendererComponent,
    cellClass: colDef.cellEditor?.multiEdit ? GenericMultiEditCellClass : undefined,
    ...colDef,
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        ...colDef.cellEditorParams,
        form: GridFormDropDown,
      },
    }),
  });
