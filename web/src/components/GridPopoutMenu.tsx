import "./GridPopoutMenu.scss";
import "@szhsin/react-menu/dist/index.css";

import { ColDef } from "ag-grid-community";
import { GenericMultiEditCellClass } from "./GenericCellClass";
import { BaseGridRow } from "./Grid";
import { GridPopupProps } from "./gridPopoutEdit/GridPopupProps";
import { GridGenericCellEditor } from "./GridGenericCellEditor";
import { GridFormPopoutMenu, GridFormPopoutMenuProps } from "./gridForm/GridFormPopoutMenu";
import { GridPopoutMenuCellRenderer } from "./gridRender/GridPopoutMenuCellRenderer";

/**
 * Popout burger menu
 */
export const GridPopoutMenu = <RowType extends BaseGridRow>(
  colDef: ColDef,
  props: GridPopupProps<RowType, GridFormPopoutMenuProps<RowType>>,
): ColDef =>
  GridGenericCellEditor({
    ...colDef,
    editable: colDef.editable != null ? colDef.editable : true,
    maxWidth: 64,
    cellRenderer: GridPopoutMenuCellRenderer,
    cellRendererParams: {
      // Menus open on single click, this parameter is picked up in Grid.tsx
      singleClickEdit: true,
    },
    cellEditorParams: {
      ...colDef.cellEditorParams,
      form: GridFormPopoutMenu,
      formProps: props.formProps,
      multiEdit: props.multiEdit,
    },
    cellClass: GenericMultiEditCellClass,
  });
