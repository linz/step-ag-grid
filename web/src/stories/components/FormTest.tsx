import "./FormTest.scss";

import { useCallback, useContext, useState } from "react";
import { LuiTextInput } from "@linzjs/lui";
import { wait } from "../../utils/util";
import { CellEditorContext } from "../../contexts/CellEditorContext";

export interface IFormTestRow {
  id: number;
  name: string;
  nameType: string;
  numba: string;
  plan: string;
}

export const FormTest = (): JSX.Element => {
  const { saveRef, cellEditorParamsRef } = useContext(CellEditorContext);
  saveRef.current = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const [nameType, setNameType] = useState("IS");
  const [numba, setNumba] = useState("IX");
  const [plan, setPlan] = useState("DP XXXX");

  saveRef.current = useCallback(
    async (selectedRows: IFormTestRow[]): Promise<boolean> => {
      // eslint-disable-next-line no-console
      console.log("onSave", selectedRows, nameType, numba, plan);
      // If not valid return false
      cellEditorParamsRef.current.data.name = "XXX";
      await wait(1000);
      return true;
    },
    [cellEditorParamsRef, nameType, numba, plan],
  );

  return (
    <div style={{ display: "flex", flexDirection: "row" }} className={"FormTest"}>
      <LuiTextInput label={"Name type"} value={nameType} onChange={(e) => setNameType(e.target.value)} />
      <LuiTextInput label={"Number"} value={numba} onChange={(e) => setNumba(e.target.value)} />
      <LuiTextInput label={"Plan"} value={plan} onChange={(e) => setPlan(e.target.value)} />
    </div>
  );
};
