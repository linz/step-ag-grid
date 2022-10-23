import { useCallback, useState } from "react";
import { wait } from "../../utils/util";
import { GridGenericCellEditorFormContextParams } from "../GridCell";
import { TextInputFormatted } from "../../lui/TextInputFormatted";

interface GridFormTextInputProps {
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  width?: string | number;
}

export const GridFormTextInput = (props: GridFormTextInputProps): JSX.Element => {
  const { saveRef, cellEditorParamsRef, triggerSave } = props as any as GridGenericCellEditorFormContextParams;
  saveRef.current = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const field = cellEditorParamsRef.current.colDef.field;
  const [text, setText] = useState(cellEditorParamsRef.current.value);

  const invalid = useCallback(() => {
    if (props.required && text.length == 0) {
      return `Some text is required`;
    }
    if (props.maxlength && text.length > props.maxlength) {
      return `Text must be no longer than ${props.maxlength} characters`;
    }
  }, [props.maxlength, props.required, text.length]);

  saveRef.current = useCallback(
    async (selectedRows: Record<string, any>[]): Promise<boolean> => {
      if (field == null) {
        console.error("ColDef has no field set");
        return false;
      }
      if (invalid()) return false;

      selectedRows.forEach((row) => (row[field] = text));
      await wait(1000);
      return true;
    },
    [invalid, text, field],
  );

  return (
    <div style={{ display: "flex", flexDirection: "row", width: props.width ?? 240 }} className={"FormTest"}>
      <TextInputFormatted
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={invalid()}
        formatted={""}
        inputProps={{
          style: { width: "100%" },
          placeholder: props.placeholder,
          onKeyDown: async (e) => {
            if (e.key === "Enter") {
              triggerSave().then();
            }
          },
        }}
      />
    </div>
  );
};
