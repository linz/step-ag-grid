import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

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

export const CancelPromise = () => Promise.resolve(true);

export const useGridPopoverHook = <TData extends GridBaseRow>({
  className,
  save,
  invalid,
  dontSaveOnExternalClick,
}: GridPopoverHookProps<TData>) => {
  const { anchorRef, saving, updateValue, stopEditing } = useGridPopoverContext<TData>();
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const triggerSave = useCallback(
    async (reason?: string) => {
      if (reason == CloseReason.CANCEL) {
        await updateValue(CancelPromise, 0);
        stopEditing();

        return;
      }
      if (invalid?.()) {
        // Don't close, don't do anything it's invalid
        return;
      }

      if (
        await updateValue(
          save ?? (() => Promise.resolve(true)),
          reason === CloseReason.TAB_FORWARD ? 1 : reason === CloseReason.TAB_BACKWARD ? -1 : 0,
        )
      ) {
        stopEditing();
      }
    },
    [invalid, save, stopEditing, updateValue],
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
                if (event.reason === CloseReason.BLUR) {
                  return;
                }
                void triggerSave(event.reason);
              }}
              viewScroll={'auto'}
              dontShrinkIfDirectionIsTop={true}
              className={className}
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
                  if (dontSaveOnExternalClick && reason === CloseReason.BLUR) {
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
    [anchorRef, isOpen, className, dontSaveOnExternalClick, saving, triggerSave],
  );

  return {
    popoverWrapper,
    triggerSave,
    gridPopoverOpen: isOpen,
  };
};
