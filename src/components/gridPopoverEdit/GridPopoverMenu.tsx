import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormPopoverMenu, GridFormPopoverMenuProps } from "../gridForm/GridFormPopoverMenu";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";
import { GridRenderPopoutMenuCell } from "../gridRender/GridRenderPopoutMenuCell";

/**
 * Popout burger menu
 */
export const GridPopoverMenu = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  custom: GenericCellEditorProps<GridFormPopoverMenuProps<RowType>>,
): ColDefT<RowType> =>
  GridCell<RowType, GridFormPopoverMenuProps<RowType>>(
    {
      minWidth: 48,
      maxWidth: 48,
      width: 40,
      editable: colDef.editable != null ? colDef.editable : true,
      exportable: false,
      cellStyle: { flex: 1, justifyContent: "center" },
      cellRenderer: GridRenderPopoutMenuCell,
      ...colDef,
      cellRendererParams: {
        // Menus open on single click, this parameter is picked up in Grid.tsx
        singleClickEdit: true,
      },
    },
    {
      editor: GridFormPopoverMenu,
      ...custom,
    },
  );
