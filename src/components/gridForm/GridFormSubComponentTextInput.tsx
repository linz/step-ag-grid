import { useState } from "react";
import { TextInputFormatted } from "../../lui/TextInputFormatted";

export interface GridFormSubComponentTextInput {
  setValue: (value: string) => void;
  keyDown: (key: string) => void;
  placeholder?: string;
  className?: string;
}

export const GridFormSubComponentTextInput = ({
  keyDown,
  placeholder,
  setValue,
  className,
}: GridFormSubComponentTextInput) => {
  const placeholderText = placeholder || "Other...";
  const inputClass = className || "";
  const [inputValue, setInputValue] = useState("");
  return (
    <>
      <TextInputFormatted
        className={inputClass}
        value={inputValue}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
          setInputValue(value);
        }}
        inputProps={{
          onKeyDown: (k: any) => keyDown(k.key),
          placeholder: placeholderText,
          onMouseEnter: (e) => {
            if (document.activeElement != e.currentTarget) {
              e.currentTarget.focus();
            }
          },
          style: {
            width: "100%",
          },
        }}
      />
    </>
  );
};
