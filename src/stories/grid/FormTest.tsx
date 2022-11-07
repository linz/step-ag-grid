import "./FormTest.scss";

import { useCallback, useState } from "react";
import { LuiAlertModal, LuiAlertModalButtons, LuiButton, LuiTextInput } from "@linzjs/lui";
import { wait } from "../../utils/util";
import { CellEditorCommon, CellParams } from "../../components/GridCell";
import { useGridPopoverHook } from "../../components/GridPopoverHook";
import { GridBaseRow } from "../../components/Grid";

export interface IFormTestRow {
  id: number;
  name: string;
  nameType: string;
  numba: string;
  plan: string;
  distance: number | null;
}

export const FormTest = <RowType extends GridBaseRow>(_props: CellEditorCommon): JSX.Element => {
  const props = _props as CellParams<RowType>;
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

  const [showModal, setShowModal] = useState<boolean>(false);

  const { popoverWrapper } = useGridPopoverHook({ className: _props.className, save });

  return popoverWrapper(
    <>
    {showModal &&
    <LuiAlertModal
    data-testid="WarningAlertWithButtons-modal"
    level="warning"
    // If panel is popped out, append modal to poppped out window DOM, otherwise use default
    //appendToElement={() => (poppedOut && popoutElement) || document.body}
  >
    <h2>Header</h2>
    <p className="WarningAlertWithButtons-new-line">This modal was added to help fix a bug where the onBlur for the context menu was prematurely closing the editor and therefore this modal.</p>
    <LuiAlertModalButtons>
        <LuiButton level="secondary" onClick={()=> {setShowModal(false);}} data-testid="WarningAlertWithButtons-cancel">
          Cancel
        </LuiButton>

        <LuiButton level="primary" onClick={()=> {setShowModal(false);}} data-testid="WarningAlertWithButtons-ok" >
          OK
        </LuiButton>
    </LuiAlertModalButtons>
  </LuiAlertModal>
}
    <div style={{ display: "flex", flexDirection: "row" }} className={"FormTest Grid-popoverContainer"}>
      <div className={"FormTest-textInput"}>
        <LuiTextInput label={"Name type"} value={nameType} onChange={(e) => setNameType(e.target.value)} />
      </div>
      <div className={"FormTest-textInput"}>
        <LuiTextInput label={"Number"} value={numba} onChange={(e) => setNumba(e.target.value)} />
      </div>
      <div className={"FormTest-textInput"}>
        <LuiButton onClick={() => setShowModal(true)}>Show Modal</LuiButton>
      </div>
    </div>
    </>,
  );
};
