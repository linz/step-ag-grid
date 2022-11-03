import "./GridPopoverMenu.scss";
import "../../react-menu3/styles/index.scss";

import { ColDef } from "ag-grid-community";
import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormPopoutMenu, GridFormPopoutMenuProps } from "../gridForm/GridFormPopoutMenu";
import { GridRenderPopoutMenuCell } from "../gridRender/GridRenderPopoutMenuCell";

/**
 * Popout burger menu
 */
export const GridPopoverMenu = <RowType extends GridBaseRow>(
  colDef: ColDef,
  props: GenericCellEditorProps<GridFormPopoutMenuProps<RowType>>,
): ColDefT<RowType> =>
  GridCell<RowType, GridFormPopoutMenuProps<RowType>>(
    {
      maxWidth: 64,
      editable: colDef.editable != null ? colDef.editable : true,
      cellRenderer: GridRenderPopoutMenuCell,
      cellClass: colDef?.cellEditorParams?.multiEdit !== false ? GenericMultiEditCellClass : undefined,
      ...colDef,
      cellRendererParams: {
        // Menus open on single click, this parameter is picked up in Grid.tsx
        singleClickEdit: true,
      },
    },
    {
      editor: GridFormPopoutMenu,
      ...props,
    },
  );
