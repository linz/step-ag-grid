import "./FormTextArea.scss";

import { useCallback, useState } from "react";
import { LuiTextAreaInput } from "@linzjs/lui";
import { wait } from "../../utils/util";
import { FormProps } from "../../components/GenericCellEditor";

export interface IFormTestRow {
  id: number;
  name: string;
  nameType: string;
  numba: string;
  plan: string;
}

export const FormTextArea = (props: FormProps): JSX.Element => {
  const [text, setText] = useState("IS");

  const invalid = useCallback(() => {
    return text.length > 32 && "Text must be no longer than 32";
  }, [text]);

  props.saveRef.current = useCallback(
    async (selectedRows: IFormTestRow[]): Promise<boolean> => {
      if (invalid()) return false;
      // eslint-disable-next-line no-console
      console.log("onSave", selectedRows, text);

      selectedRows.forEach((row) => (row.name = text));
      await wait(1000);
      return true;
    },
    [props.data, text, invalid],
  );

  return (
    <div style={{ display: "flex", flexDirection: "row" }} className={"FormTest"}>
      <LuiTextAreaInput label={"Name type"} value={text} onChange={(e) => setText(e.target.value)} error={invalid()} />
    </div>
  );
};
