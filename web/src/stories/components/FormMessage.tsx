import { useCallback, useState } from "react";
import { FormProps } from "../../components/GenericCellEditor";

export const FormMessage = (props: FormProps): JSX.Element => {
  props.saveRef.current = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row" }} className={"FormTest"}>
      <div style={{ maxWidth: 400, padding: 16 }}>{`The value of the field is: ${
        props.data[props.colDef.field ?? ""]
      }`}</div>
    </div>
  );
};
