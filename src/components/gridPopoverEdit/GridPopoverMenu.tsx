import { GenericCellEditorProps, GridCell } from '../GridCell';
import { GridFormPopoverMenu, GridFormPopoverMenuProps } from '../gridForm/GridFormPopoverMenu';
import { GenericCellColDef } from '../gridRender/GridRenderGenericCell';
import { GridRenderPopoutMenuCell } from '../gridRender/GridRenderPopoutMenuCell';
import { ColDefT, GridBaseRow } from '../types';

/**
 * Popout burger menu
 */
export const GridPopoverMenu = <TData extends GridBaseRow>(
  colDef: GenericCellColDef<TData>,
  custom: GenericCellEditorProps<GridFormPopoverMenuProps<TData>>,
): ColDefT<TData> =>
  GridCell<TData, any, GridFormPopoverMenuProps<TData>>(
    {
      minWidth: 48,
      maxWidth: 48,
      width: 40,
      sortable: false,
      editable: colDef.editable != null ? colDef.editable : true,
      exportable: false,
      cellStyle: { flex: 1, justifyContent: 'center' },
      cellRenderer: GridRenderPopoutMenuCell,
      // Menus open on single click, this parameter is picked up in Grid.tsx
      singleClickEdit: true,
      ...colDef,
    },
    {
      editor: GridFormPopoverMenu,
      preventAutoEdit: true,
      ...custom,
    },
  );
