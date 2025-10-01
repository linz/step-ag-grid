import { ICellEditorParams } from 'ag-grid-community';
import { sortBy } from 'lodash-es';
import { PropsWithChildren, RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { GridBaseRow } from '../components/Grid';
import { GridContext } from './GridContext';
import { GridPopoverContext } from './GridPopoverContext';

interface GridPopoverContextProps {
  props: ICellEditorParams<any, any, any>;
}

export const GridPopoverContextProvider = (props2: PropsWithChildren<GridPopoverContextProps>) => {
  const { getFilteredSelectedRows, updatingCells } = useContext(GridContext);
  const children = props2.children;
  const props = props2.props;
  const anchorRef = useRef<Element>(props.eGridCell);

  const hasSaved = useRef(false);
  const [saving, setSaving] = useState(false);

  const { colDef, stopEditing, formatValue, data, value } = props;
  const { cellEditorParams } = colDef;
  const multiEdit = cellEditorParams?.multiEdit ?? false;
  // Then item that is clicked on will always be first in the list
  const selectedRows = useMemo(
    () =>
      multiEdit ? sortBy(getFilteredSelectedRows(), (row) => row.id !== props.data.id) : [props.data as GridBaseRow],
    [getFilteredSelectedRows, multiEdit, props.data],
  );

  const field = props.colDef?.field ?? '';
  const colId = props.colDef?.colId ?? field ?? '';

  const updateValue = useCallback(
    async (saveFn: (selectedRows: any[]) => Promise<boolean>, tabDirection: 1 | 0 | -1): Promise<boolean> => {
      if (hasSaved.current) {
        // already called save so ignore
        return true;
      }
      hasSaved.current = true;
      return saving ? false : await updatingCells({ selectedRows, field }, saveFn, setSaving, tabDirection);
    },
    [field, saving, selectedRows, updatingCells],
  );

  return (
    <GridPopoverContext.Provider
      value={{
        anchorRef: anchorRef as any as RefObject<Element>,
        saving,
        setSaving,
        selectedRows,
        colId,
        field,
        data,
        value,
        updateValue,
        formatValue,
        stopEditing,
      }}
    >
      {children}
    </GridPopoverContext.Provider>
  );
};
