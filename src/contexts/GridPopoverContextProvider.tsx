import { ReactNode, RefObject, useCallback, useContext, useRef, useState } from "react";
import { GridPopoverContext, PropsType } from "./GridPopoverContext";
import { ICellEditorParams } from "ag-grid-community";
import { GridContext } from "@contexts/GridContext";
import { sortBy } from "lodash-es";
import { GridBaseRow } from "@components/Grid";

interface GridPopoverContextProps {
  children: ReactNode;
}

export const GridPopoverContextProvider = (props: GridPopoverContextProps) => {
  const { getSelectedRows, updatingCells } = useContext(GridContext);
  const anchorRef = useRef<Element>();
  const propsRef = useRef<PropsType>({} as PropsType);

  const [saving, setSaving] = useState(false);

  const setProps = useCallback(
    (props: ICellEditorParams, multiEdit: boolean) => {
      // Then item that is clicked on will always be first in the list
      const selectedRows = multiEdit
        ? sortBy(getSelectedRows(), (row) => row.id !== props.data.id)
        : [props.data as GridBaseRow];
      const field = props.colDef?.field ?? "";

      anchorRef.current = props.eGridCell;
      propsRef.current = {
        value: props.value,
        data: props.data,
        field,
        selectedRows,
        updateValue: async (saveFn: (selectedRows: any[]) => Promise<boolean>): Promise<boolean> => {
          return !saving && (await updatingCells({ selectedRows, field }, saveFn, setSaving));
        },
      };
    },
    [getSelectedRows, saving, updatingCells],
  );

  return (
    <GridPopoverContext.Provider
      value={{
        anchorRef: anchorRef as any as RefObject<Element>,
        saving,
        setSaving,
        propsRef,
        setProps,
      }}
    >
      {props.children}
    </GridPopoverContext.Provider>
  );
};
