import "./FormTest.scss";

import { useCallback, useContext, useState } from "react";
import { LuiTextInput } from "@linzjs/lui";
import { wait } from "../../utils/util";
import { GridFormProps } from "../../components/GridCell";
import { useGridPopoutHook } from "../../components/GridPopoutHook";
import { GridContext } from "../../contexts/GridContext";

export interface IFormTestRow {
  id: number;
  name: string;
  nameType: string;
  numba: string;
  plan: string;
}

export const FormTest = (props: GridFormProps): JSX.Element => {
  const { cellEditorParams } = props;
  const { getSelectedRows } = useContext(GridContext);
  const [v1, v2, ...v3] = cellEditorParams.value.split(" ");

  const [nameType, setNameType] = useState(v1);
  const [numba, setNumba] = useState(v2);
  const [plan, setPlan] = useState(v3.join(" "));

  const save = useCallback(async (): Promise<boolean> => {
    const selectedRows = getSelectedRows();
    // eslint-disable-next-line no-console
    console.log("onSave", selectedRows, nameType, numba, plan);
    // If not valid return false
    cellEditorParams.data.name = [nameType, numba, plan].join(" ");
    await wait(1000);
    return true;
  }, [cellEditorParams.data, getSelectedRows, nameType, numba, plan]);
  const { popoutWrapper } = useGridPopoutHook(props, save);

  return popoutWrapper(
    <div style={{ display: "flex", flexDirection: "row" }} className={"FormTest"}>
      <LuiTextInput label={"Name type"} value={nameType} onChange={(e) => setNameType(e.target.value)} />
      <LuiTextInput label={"Number"} value={numba} onChange={(e) => setNumba(e.target.value)} />
      <LuiTextInput label={"Plan"} value={plan} onChange={(e) => setPlan(e.target.value)} />
    </div>,
  );
};
