import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { GridContext } from '../contexts/GridContext';
import { useGridPopoverContext } from '../contexts/GridPopoverContext';
import { ControlledMenu } from '../react-menu3';
import { MenuCloseEvent } from '../react-menu3/types';
import { CloseReason } from '../react-menu3/utils';
import { GridBaseRow } from './Grid';

export interface GridPopoverHookProps<TData> {
  className: string | undefined;
  invalid?: () =>
    | Promise<ReactElement | boolean | string | null | undefined>
    | ReactElement
    | boolean
    | string
    | null
    | undefined;
  save?: (selectedRows: TData[]) => Promise<boolean>;
  dontSaveOnExternalClick?: boolean;
}

export const useGridPopoverHook = <TData extends GridBaseRow>(props: GridPopoverHookProps<TData>) => {
  const { stopEditing, cancelEdit } = useContext(GridContext);
  const { anchorRef, saving, updateValue } = useGridPopoverContext<TData>();
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const triggerSave = useCallback(
    async (reason?: string) => {
      if (reason == CloseReason.CANCEL) {
        cancelEdit();
        return;
      }
      if (props.invalid && props.invalid()) {
        return;
      }

      if (!props.save) {
        cancelEdit();
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
    [cancelEdit, props, stopEditing, updateValue],
  );

  const popoverWrapper = useCallback(
    (children: ReactElement) => {
      return (
        <>
          {anchorRef.current && (
            <ControlledMenu
              state={isOpen ? 'open' : 'closed'}
              portal={true}
              unmountOnClose={true}
              anchorRef={anchorRef}
              saveButtonRef={saveButtonRef}
              menuClassName={'step-ag-grid-react-menu'}
              onClose={(event: MenuCloseEvent) => {
                // Prevent menu from closing when modals are invoked
                if (event.reason === CloseReason.BLUR) return;
                void triggerSave(event.reason);
              }}
              viewScroll={'auto'}
              dontShrinkIfDirectionIsTop={true}
              className={props.className}
            >
              {saving && ( // This is the overlay that prevents editing when the editor is saving
                <div className={'ComponentLoadingWrapper-saveOverlay'} />
              )}
              {children}
              <button
                ref={saveButtonRef}
                data-reason={''}
                onClick={(e) => {
                  let reason = e.currentTarget.getAttribute('data-reason') ?? undefined;
                  if (props.dontSaveOnExternalClick && reason === CloseReason.BLUR) {
                    reason = CloseReason.CANCEL;
                  }
                  void triggerSave(reason);
                }}
                style={{ display: 'none' }}
              />
            </ControlledMenu>
          )}
        </>
      );
    },
    [anchorRef, isOpen, props.className, props.dontSaveOnExternalClick, saving, triggerSave],
  );

  return {
    popoverWrapper,
    triggerSave,
  };
};
