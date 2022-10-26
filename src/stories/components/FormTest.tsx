import "./FormTest.scss";

import { useCallback, useState } from "react";
import { LuiTextInput } from "@linzjs/lui";
import { wait } from "../../utils/util";
import { GridFormProps } from "../../components/GridCell";
import { useGridPopoutHook } from "../../components/GridPopoutHook";
import { GridBaseRow } from "../../components/Grid";

export interface IFormTestRow {
  id: number;
  name: string;
  nameType: string;
  numba: string;
  plan: string;
}

export const FormTest = <RowType extends GridBaseRow>(props: GridFormProps<RowType>): JSX.Element => {
  const [v1, v2, ...v3] = props.value.split(" ");

  const [nameType, setNameType] = useState(v1);
  const [numba, setNumba] = useState(v2);
  const [plan, setPlan] = useState(v3.join(" "));

  const save = useCallback(async (): Promise<boolean> => {
    // eslint-disable-next-line no-console
    console.log("onSave", props.selectedRows, nameType, numba, plan);

    // @ts-ignore
    props.selectedRows.forEach((row) => (row["name"] = [nameType, numba, plan].join(" ")));
    await wait(1000);

    // Close form
    return true;
  }, [nameType, numba, plan, props.selectedRows]);
  const { popoutWrapper } = useGridPopoutHook(props, save);

  return popoutWrapper(
    <div style={{ display: "flex", flexDirection: "row" }} className={"FormTest Grid-popoverContainer"}>
      <div className={"FormTest-textInput"}>
        <LuiTextInput label={"Name type"} value={nameType} onChange={(e) => setNameType(e.target.value)} />
      </div>
      <div className={"FormTest-textInput"}>
        <LuiTextInput label={"Number"} value={numba} onChange={(e) => setNumba(e.target.value)} />
      </div>
      <div className={"FormTest-textInput"}>
        <LuiTextInput label={"Plan"} value={plan} onChange={(e) => setPlan(e.target.value)} />
      </div>
    </div>,
  );
};
