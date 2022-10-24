import { useCallback, useContext, useState } from "react";
import { wait } from "../../utils/util";
import { MyFormProps } from "../GridCell";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import { GridContext } from "../../contexts/GridContext";
import { useGridPopoutHook } from "../GridPopoutHook";

interface GridFormTextInputProps {
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
}

export const GridFormTextInput = (props: MyFormProps) => {
  const { cellEditorParams } = props;
  const { colDef } = cellEditorParams;
  const formProps = colDef.cellEditorParams as GridFormTextInputProps;
  const { getSelectedRows } = useContext(GridContext);
  const [text, setText] = useState(cellEditorParams.value);

  const invalid = useCallback(() => {
    if (formProps.required && text.length == 0) {
      return `Some text is required`;
    }
    if (formProps.maxlength && text.length > formProps.maxlength) {
      return `Text must be no longer than ${formProps.maxlength} characters`;
    }
  }, [formProps.maxlength, formProps.required, text.length]);

  const save = useCallback(async (): Promise<boolean> => {
    const field = colDef.field;
    if (field == null) {
      console.error("ColDef has no field set");
      return false;
    }
    if (invalid()) return false;

    getSelectedRows<any>().forEach((row) => (row[field] = text));
    await wait(1000);
    return true;
  }, [colDef.field, invalid, props, getSelectedRows, text]);
  const { popoutWrapper, triggerSave } = useGridPopoutHook(props, save);

  return popoutWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: formProps.width ?? 240 }} className={"FormTest"}>
      <TextInputFormatted
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={invalid()}
        formatted={""}
        inputProps={{
          style: { width: "100%" },
          placeholder: formProps.placeholder,
          onKeyDown: async (e) => e.key === "Enter" && triggerSave().then(),
        }}
      />
    </div>,
  );
};
