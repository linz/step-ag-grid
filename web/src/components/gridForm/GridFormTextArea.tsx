import { useCallback, useContext, useState } from "react";
import { wait } from "../../utils/util";
import { MyFormProps } from "../GridCell";
import { TextAreaInput } from "../../lui/TextArea";
import { GridContext } from "../../contexts/GridContext";
import { useGridPopoutHook } from "../GridPopoutHook";

interface FormTextAreaProps {
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
}

export const GridFormTextArea = (props: MyFormProps) => {
  const { cellEditorParams } = props;
  const { colDef } = cellEditorParams;
  const formProps = colDef.cellEditorParams as FormTextAreaProps;
  const { getSelectedRows } = useContext(GridContext);
  const field = colDef.field;
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
    if (field == null) {
      console.error("ColDef has no field set");
      return false;
    }
    if (invalid()) return false;
    getSelectedRows<any>().forEach((row) => (row[field] = text));
    await wait(5000);
    return true;
  }, [field, invalid, getSelectedRows, text]);
  const { popoutWrapper } = useGridPopoutHook(props, save);

  return popoutWrapper(
    <div style={{ display: "flex", flexDirection: "row", width: formProps.width ?? 240 }} className={"FormTest"}>
      <TextAreaInput
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={invalid()}
        inputProps={{ placeholder: formProps.placeholder }}
      />
    </div>,
  );
};
