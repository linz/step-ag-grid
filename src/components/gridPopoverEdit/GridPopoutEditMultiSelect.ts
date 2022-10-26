import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GenericCellColDef, GridGenericCellRendererComponent } from "../gridRender/GridRenderGenericCell";
import { GridCell } from "../GridCell";
import { GridBaseRow } from "../Grid";
import { GridFormMultiSelect, GridFormMultiSelectProps } from "../gridForm/GridFormMultiSelect";

export const GridPopoutEditMultiSelect = <RowType extends GridBaseRow, ValueType>(
  colDef: GenericCellColDef<RowType, GridFormMultiSelectProps<RowType, ValueType>>,
) =>
  GridCell<RowType, GridFormMultiSelectProps<RowType, ValueType>>({
    initialWidth: 65,
    maxWidth: 150,
    cellRenderer: GridGenericCellRendererComponent,
    cellClass: colDef.cellEditor?.multiEdit ? GenericMultiEditCellClass : undefined,
    ...colDef,
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        ...colDef.cellEditorParams,
        form: GridFormMultiSelect,
      },
    }),
  });
