import "./GridPopoutMenu.scss";
import "@szhsin/react-menu/dist/index.css";

import { ColDef } from "ag-grid-community";
import { GenericMultiEditCellClass } from "../GenericCellClass";
import { BaseGridRow } from "../Grid";
import { GridCell } from "../GridCell";
import { GridFormPopoutMenu, GridFormPopoutMenuProps } from "../gridForm/GridFormPopoutMenu";
import { GridRenderPopoutMenuCell } from "../gridRender/GridRenderPopoutMenuCell";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

/**
 * Popout burger menu
 */
export const GridPopoutMenu = <RowType extends BaseGridRow>(
  colDef: GenericCellColDef<GridFormPopoutMenuProps<RowType>>,
): ColDef =>
  GridCell({
    maxWidth: 64,
    editable: colDef.editable != null ? colDef.editable : true,
    cellRenderer: GridRenderPopoutMenuCell,
    cellClass: GenericMultiEditCellClass,
    ...colDef,
    cellRendererParams: {
      // Menus open on single click, this parameter is picked up in Grid.tsx
      singleClickEdit: true,
    },
    ...(colDef?.cellEditorParams && {
      cellEditorParams: {
        ...colDef.cellEditorParams,
        form: GridFormPopoutMenu,
      },
    }),
  });
