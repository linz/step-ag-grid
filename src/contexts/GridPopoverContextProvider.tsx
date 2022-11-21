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
  const { getSelectedRows, updatingCells } = useContext(GridContext);
  const anchorRef = useRef<Element>(props.eGridCell);

  const hasSaved = useRef(false);
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
    async (saveFn: (selectedRows: any[]) => Promise<boolean>, tabDirection: 1 | 0 | -1): Promise<boolean> => {
      if (hasSaved.current) return true;
      hasSaved.current = true;
      const r = saving ? false : await updatingCells({ selectedRows, field }, saveFn, setSaving, tabDirection);
      //if (r) stopEditing();
      return r;
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
        field,
        data: props.data,
        value: props.value,
        updateValue,
        formatValue: props.formatValue,
      }}
    >
      {children}
    </GridPopoverContext.Provider>
  );
};
