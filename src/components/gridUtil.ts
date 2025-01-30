import { ColDef } from 'ag-grid-community';

import { isGridCellFiller } from './GridCellFiller';

export const getColId = (colDef: ColDef): string => colDef.colId ?? '';
export const isFlexColumn = (colDef: ColDef): boolean => !!colDef.flex && !isGridCellFiller(colDef);
