import "./GridPopoverMenu.scss";

import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormPopoverMenu, GridFormPopoutMenuProps } from "../gridForm/GridFormPopoverMenu";
import { GridRenderPopoutMenuCell } from "../gridRender/GridRenderPopoutMenuCell";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

/**
 * Popout burger menu
 */
export const GridPopoverMenu = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
  custom: GenericCellEditorProps<GridFormPopoutMenuProps<RowType>>,
): ColDefT<RowType> =>
  GridCell<RowType, GridFormPopoutMenuProps<RowType>>(
    {
      maxWidth: 40,
      editable: colDef.editable != null ? colDef.editable : true,
      cellStyle: { justifyContent: "flex-end" },
      cellRenderer: GridRenderPopoutMenuCell,
      cellClass: custom?.multiEdit ? GenericMultiEditCellClass : undefined,
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
