import { useState } from "react";
import { TextInputFormatted } from "../../lui/TextInputFormatted";
import "../../styles/GridFormSubComponentTextInput.scss";

export interface GridFormSubComponentTextInput {
  setValue: (value: string) => void;
  keyDown: (key: string) => void;
  placeholder?: string;
  className?: string;
  customHelpText?: string;
}

export const GridFormSubComponentTextInput = ({
  keyDown,
  placeholder,
  setValue,
  className,
  customHelpText,
}: GridFormSubComponentTextInput) => {
  const placeholderText = placeholder || "Other...";
  const helpText = customHelpText || "Press enter or tab to save";

  const inputClass = className || "GridFormSubComponentTextInput-full-width-input";
  const [inputValue, setInputValue] = useState("");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
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
      <span
        style={{
          fontSize: "0.75rem",
        }}
      >
        {helpText}
      </span>
    </div>
  );
};
