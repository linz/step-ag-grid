import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridContext } from "../contexts/GridContext";
import { GridBaseRow } from "./Grid";
import { ControlledMenu } from "../react-menu3";
import { useGridPopoverContext } from "../contexts/GridPopoverContext";
import { MenuCloseEvent } from "../react-menu3/types";
import { CloseReason } from "../react-menu3/utils";

export interface GridPopoverHookProps<RowType> {
  className: string | undefined;
  invalid?: () => Promise<boolean | string | null> | boolean | string | null;
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
      if (reason == CloseReason.CANCEL) {
        stopEditing();
        return;
      }
      if (props.invalid && props.invalid()) {
        return;
      }

      if (!props.save) {
        stopEditing();
      } else if (props.save) {
        // forms that don't provide an invalid fn must wait until they have saved to close
        if (props.invalid) stopEditing();
        if (
          await updateValue(
            props.save,
            reason === CloseReason.TAB_FORWARD ? 1 : reason === CloseReason.TAB_BACKWARD ? -1 : 0,
          )
        ) {
          if (!props.invalid) stopEditing();
        }
      }
    },
    [props, stopEditing, updateValue],
  );

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
                if (event.reason === CloseReason.BLUR) return;
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
              <button
                ref={saveButtonRef}
                data-reason={""}
                onClick={(e) => {
                  triggerSave(e.currentTarget.getAttribute("data-reason") ?? undefined).then();
                }}
                style={{ display: "none" }}
              />
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
  };
};
