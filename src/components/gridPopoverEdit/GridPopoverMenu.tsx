import "./GridPopoverMenu.scss";

import { GenericMultiEditCellClass } from "../GenericCellClass";
import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormPopoutMenu, GridFormPopoutMenuProps } from "../gridForm/GridFormPopoutMenu";
import { GridRenderPopoutMenuCell } from "../gridRender/GridRenderPopoutMenuCell";
import { GenericCellColDef } from "@components/gridRender/GridRenderGenericCell";

/**
 * Popout burger menu
 */
export const GridPopoverMenu = <RowType extends GridBaseRow>(
  colDef: GenericCellColDef<RowType>,
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
