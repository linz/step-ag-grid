import "./FormTest.scss";

import { useCallback, useContext, useState } from "react";
import { LuiAlertModal, LuiAlertModalButtons, LuiButton, LuiTextInput } from "@linzjs/lui";
import { wait } from "../../utils/util";
import { CellEditorCommon } from "../../components/GridCell";
import { useGridPopoverHook } from "../../components/GridPopoverHook";
import { GridPopoverContext } from "../../contexts/GridPopoverContext";

export interface IFormTestRow {
  id: number;
  name: string;
  nameType: string;
  numba: string;
  plan: string;
  distance: number | null;
}

export const FormTest = (props: CellEditorCommon): JSX.Element => {
  const { value } = useContext(GridPopoverContext);
  const [v1, ...v2] = value.split(" ");

  const [nameType, setNameType] = useState(v1);
  const [numba, setNumba] = useState(v2.join(" "));

  const save = useCallback(
    async (selectedRows: IFormTestRow[]): Promise<boolean> => {
      // eslint-disable-next-line no-console
      console.log("onSave", selectedRows, nameType, numba);

      selectedRows.forEach((row) => (row.name = [nameType, numba].join(" ")));
      await wait(1000);

      // Close form
      return true;
    },
    [nameType, numba],
  );

  const [showModal, setShowModal] = useState<boolean>(false);

  const { popoverWrapper } = useGridPopoverHook({ className: props.className, save });

  return popoverWrapper(
    <>
      {showModal && (
        <LuiAlertModal
          data-testid="WarningAlertWithButtons-modal"
          level="warning"
          // If panel is popped out, append modal to poppped out window DOM, otherwise use default
          //appendToElement={() => (poppedOut && popoutElement) || document.body}
        >
          <h2>Header</h2>
          <p className="WarningAlertWithButtons-new-line">
            This modal was added to help fix a bug where the onBlur for the context menu was prematurely closing the
            editor and therefore this modal.
          </p>
          <LuiAlertModalButtons>
            <LuiButton
              level="secondary"
              onClick={() => {
                setShowModal(false);
              }}
              data-testid="WarningAlertWithButtons-cancel"
            >
              Cancel
            </LuiButton>

            <LuiButton
              level="primary"
              onClick={() => {
                setShowModal(false);
              }}
              data-testid="WarningAlertWithButtons-ok"
            >
              OK
            </LuiButton>
          </LuiAlertModalButtons>
        </LuiAlertModal>
      )}
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
