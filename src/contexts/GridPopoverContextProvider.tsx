import { ReactNode, RefObject, useCallback, useContext, useMemo, useRef, useState } from "react";
import { GridPopoverContext } from "./GridPopoverContext";
import { ICellEditorParams } from "ag-grid-community";
import { GridContext } from "./GridContext";
import { sortBy } from "lodash-es";
import { GridBaseRow } from "../components/Grid";

interface GridPopoverContextProps {
  props: ICellEditorParams;
  children: ReactNode;
}

export const GridPopoverContextProvider = ({ props, children }: GridPopoverContextProps) => {
  const { getSelectedRows, updatingCells, stopEditing, selectNextCell } = useContext(GridContext);
  const anchorRef = useRef<Element>(props.eGridCell);

  const [saving, setSaving] = useState(false);

  const { colDef } = props;
  const { cellEditorParams } = colDef;
  const multiEdit = cellEditorParams?.multiEdit ?? false;
  // Then item that is clicked on will always be first in the list
  const selectedRows = useMemo(
    () => (multiEdit ? sortBy(getSelectedRows(), (row) => row.id !== props.data.id) : [props.data as GridBaseRow]),
    [getSelectedRows, multiEdit, props.data],
  );
  const field = props.colDef?.field ?? "";

  const updateValue = useCallback(
    async (saveFn: (selectedRows: any[]) => Promise<boolean>, tabToNextCell: boolean): Promise<boolean> => {
      let result = false;
      if (!saving) {
        result = await updatingCells({ selectedRows, field }, saveFn, setSaving);
        if (result) {
          stopEditing();
          tabToNextCell && selectNextCell();
        }
      }

      return result;
    },
    [field, saving, selectNextCell, selectedRows, stopEditing, updatingCells],
  );

  return (
    <GridPopoverContext.Provider
      value={{
        anchorRef: anchorRef as any as RefObject<Element>,
        saving,
        setSaving,
        selectedRows,
        field,
        data: props.data,
        value: props.value,
        updateValue,
      }}
    >
      {children}
    </GridPopoverContext.Provider>
  );
};
