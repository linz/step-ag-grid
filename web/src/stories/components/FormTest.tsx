import "./FormTest.scss";

import { useCallback, useState } from "react";
import { LuiTextInput } from "@linzjs/lui";
import { wait } from "../../utils/util";
import { FormProps } from "../../components/GenericCellEditor";

export interface IFormTestRow {
  id: number;
  name: string;
  nameType: string;
  numba: string;
  plan: string;
}

export const FormTest = (props: FormProps): JSX.Element => {
  const [nameType, setNameType] = useState("IS");
  const [numba, setNumba] = useState("IX");
  const [plan, setPlan] = useState("DP XXXX");

  props.saveRef.current = useCallback(
    async (selectedRows: IFormTestRow[]): Promise<boolean> => {
      // eslint-disable-next-line no-console
      console.log("onSave", selectedRows, nameType, numba, plan);
      // If not valid return false
      props.data.name = "XXX";
      await wait(1000);
      return true;
    },
    [nameType, numba, plan],
  );

  return (
    <div style={{ display: "flex", flexDirection: "row" }} className={"FormTest"}>
      <LuiTextInput label={"Name type"} value={nameType} onChange={(e) => setNameType(e.target.value)} />
      <LuiTextInput label={"Number"} value={numba} onChange={(e) => setNumba(e.target.value)} />
      <LuiTextInput label={"Plan"} value={plan} onChange={(e) => setPlan(e.target.value)} />
    </div>
  );
};
