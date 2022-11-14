import { KeyboardEvent, KeyboardEventHandler, useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "../contexts/GridContext";
import { GridBaseRow } from "./Grid";
import { ControlledMenu } from "../react-menu3";
import { useGridPopoverContext } from "../contexts/GridPopoverContext";
import { MenuCloseEvent } from "../react-menu3/types";

export interface GridPopoverHookProps<RowType> {
  className: string | undefined;
  save?: (selectedRows: RowType[]) => Promise<boolean>;
}

export const useGridPopoverHook = <RowType extends GridBaseRow>(props: GridPopoverHookProps<RowType>) => {
  const { stopEditing } = useContext(GridContext);
  const { anchorRef, saving, updateValue } = useGridPopoverContext<RowType>();
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const triggerSave = useCallback(
    async (reason?: string) => {
      if (reason == "cancel" || !props.save || (updateValue && (await updateValue(props.save)))) {
        setOpen(false);
        stopEditing();
      }
    },
    [props.save, stopEditing, updateValue],
  );

  const onlyInputKeyboardEventHandlers: {
    onKeyUp?: KeyboardEventHandler<HTMLElement> | undefined;
    onKeyDown?: KeyboardEventHandler<HTMLElement> | undefined;
  } = {
    onKeyUp: (e: KeyboardEvent) => {
      const isTextArea = (e.currentTarget as any).type === "textarea";
      if (e.key === "Enter" && !isTextArea) {
        e.preventDefault();
        e.stopPropagation();
        triggerSave().then();
      } else if (e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onKeyDown: (e: KeyboardEvent) => {
      const isTextArea = (e.currentTarget as any).type === "textarea";
      if (e.key === "Enter" && !isTextArea) {
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        !e.shiftKey && triggerSave().then();
      }
    },
  };
  const firstInputKeyboardEventHandlers: {
    onKeyUp?: KeyboardEventHandler<HTMLElement> | undefined;
    onKeyDown?: KeyboardEventHandler<HTMLElement> | undefined;
  } = {
    onKeyUp: (e: KeyboardEvent) => {
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  };

  const lastInputKeyboardEventHandlers: {
    onKeyUp?: KeyboardEventHandler<HTMLElement> | undefined;
    onKeyDown?: KeyboardEventHandler<HTMLElement> | undefined;
  } = {
    onKeyUp: (e: KeyboardEvent) => {
      const isTextArea = (e.currentTarget as any).type === "textarea";
      if (e.key === "Enter" && !isTextArea) {
        e.preventDefault();
        e.stopPropagation();
        triggerSave().then();
      } else if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onKeyDown: (e: KeyboardEvent) => {
      const isTextArea = (e.currentTarget as any).type === "textarea";
      if (e.key === "Enter" && !isTextArea) {
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        triggerSave().then();
      }
    },
  };

  const popoverWrapper = useCallback(
    (children: JSX.Element) => {
      return (
        <>
          {anchorRef.current && (
            <ControlledMenu
              state={isOpen ? "open" : "closed"}
              portal={true}
              unmountOnClose={true}
              anchorRef={anchorRef}
              saveButtonRef={saveButtonRef}
              menuClassName={"step-ag-grid-react-menu"}
              onClose={(event: MenuCloseEvent) => {
                // Prevent menu from closing when modals are invoked
                if (event.reason === "blur") return;
                triggerSave(event.reason).then();
              }}
              viewScroll={"auto"}
              dontShrinkIfDirectionIsTop={true}
              className={props.className}
              closeMenuExclusionClassName={"ReactModal__Content"}
            >
              {saving && ( // This is the overlay that prevents editing when the editor is saving
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: "rgba(64,64,64,0.1)",
                    zIndex: 1000,
                  }}
                />
              )}
              {children}
              <button ref={saveButtonRef} onClick={() => triggerSave().then()} style={{ display: "none" }} />
            </ControlledMenu>
          )}
        </>
      );
    },
    [anchorRef, isOpen, props.className, saving, triggerSave],
  );

  return {
    popoverWrapper,
    triggerSave,
    onlyInputKeyboardEventHandlers,
    firstInputKeyboardEventHandlers,
    lastInputKeyboardEventHandlers,
  };
};
