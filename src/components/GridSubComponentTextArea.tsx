import { useEffect, useState } from "react";

export interface GridSubComponentTextAreaProps {
  setValue: (value: string) => void;
}

export const GridSubComponentTextArea = (props: GridSubComponentTextAreaProps) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    props.setValue(value);
  }, [props, value]);

  return (
    <div className={"FreeTextInput LuiDeprecatedForms"}>
      <textarea
        autoFocus
        maxLength={10000}
        spellCheck={true}
        className={"free-text-input"}
        onChange={(e) => setValue(e.target.value)}
        defaultValue={value}
      />
    </div>
  );
};
