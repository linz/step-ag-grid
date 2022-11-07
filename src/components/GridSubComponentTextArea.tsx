export interface GridSubComponentTextAreaProps {
  value: string;
  setValue: (value: string) => void;
}

export const GridSubComponentTextArea = (props: GridSubComponentTextAreaProps) => (
  <div className={"FreeTextInput LuiDeprecatedForms"}>
    <textarea
      onMouseEnter={(e) => {
        if (document.activeElement != e.currentTarget) {
          e.currentTarget.focus();
          e.currentTarget.selectionStart = e.currentTarget.value.length;
        }
      }}
      maxLength={10000}
      spellCheck={true}
      className={"free-text-input"}
      onChange={(e) => props.setValue(e.target.value)}
      defaultValue={props.value}
    />
  </div>
);
