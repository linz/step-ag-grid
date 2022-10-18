import { useCallback, useContext } from "react";
import { CellEditorContext } from "../../contexts/CellEditorContext";

export interface FormMessageProps {
  a: string;
}

export const FormMessage = (props: FormMessageProps): JSX.Element => {
  const { saveRef, cellEditorParamsRef } = useContext(CellEditorContext);
  saveRef.current = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row" }} className={"FormTest"}>
      <div
        style={{ maxWidth: 400, padding: 16 }}
      >{`The value of the field is: ${cellEditorParamsRef.current.value} and props is ${props.a}`}</div>
    </div>
  );
};
