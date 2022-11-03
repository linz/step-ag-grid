import { ReactNode, RefObject, useContext, useRef, useState } from "react";
import { GridPopoverContext, PropsType } from "./GridPopoverContext";
import { ICellEditorParams } from "ag-grid-community";
import { GridBaseRow } from "@components/Grid";
import { GridContext } from "@contexts/GridContext";

interface GridPopoverContextProps {
  children: ReactNode;
}

export const GridPopoverContextProvider = (props: GridPopoverContextProps) => {
  const { getSelectedRows, updatingCells } = useContext(GridContext);
  const anchorRef = useRef<Element>();
  const propsRef = useRef<PropsType>({} as PropsType);
  const updateValueRef = useRef<(saveFn: (selectedRows: any[]) => Promise<boolean>) => Promise<boolean>>(async () => {
    console.error("updateValueRef.current is not set");
    return false;
  });

  const [saving, setSaving] = useState(false);

  const setProps = (props: ICellEditorParams, multiEdit: boolean) => {
    const selectedRows = multiEdit ? getSelectedRows<GridBaseRow>() : [props.data];
    const field = props.colDef?.field ?? "";

    anchorRef.current = props.eGridCell;
    propsRef.current = {
      value: props.value,
      data: props.data,
      field,
      selectedRows,
    };

    updateValueRef.current = async (saveFn: (selectedRows: any[]) => Promise<boolean>): Promise<boolean> => {
      return !saving && (await updatingCells({ selectedRows, field }, saveFn, setSaving));
    };
  };

  return (
    <GridPopoverContext.Provider
      value={{
        anchorRef: anchorRef as any as RefObject<Element>,
        saving,
        setSaving,
        updateValueRef,
        propsRef,
        setProps,
      }}
    >
      {props.children}
    </GridPopoverContext.Provider>
  );
};
