import "./FormTest.scss";

import { useCallback, useState } from "react";
import { LuiTextInput } from "@linzjs/lui";
import { wait } from "../../utils/util";
import { GridGenericCellEditorFormContextParams } from "../../components/GridCell";

export interface IFormTestRow {
  id: number;
  name: string;
  nameType: string;
  numba: string;
  plan: string;
}

export const FormTest = (props: unknown): JSX.Element => {
  const { saveRef, cellEditorParamsRef } = props as any as GridGenericCellEditorFormContextParams;
  saveRef.current = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const [v1, v2, ...v3] = cellEditorParamsRef.current.value.split(" ");

  const [nameType, setNameType] = useState(v1);
  const [numba, setNumba] = useState(v2);
  const [plan, setPlan] = useState(v3.join(" "));

  saveRef.current = useCallback(
    async (selectedRows: IFormTestRow[]): Promise<boolean> => {
      // eslint-disable-next-line no-console
      console.log("onSave", selectedRows, nameType, numba, plan);
      // If not valid return false
      cellEditorParamsRef.current.data.name = [nameType, numba, plan].join(" ");
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
