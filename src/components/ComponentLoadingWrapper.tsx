import { LuiMiniSpinner } from '@linzjs/lui';
import { PropsWithChildren, ReactElement } from 'react';

/**
 * If loading is true this returns a loading spinner, otherwise it returns its children.
 */
export const ComponentLoadingWrapper = (
  props: PropsWithChildren<{
    loading?: boolean;
    saving?: boolean;
    className: string | undefined;
  }>,
): ReactElement => {
  return props.loading ? (
    <LuiMiniSpinner size={22} divProps={{ role: 'status', ['aria-label']: 'Loading', style: { padding: 16 } }} />
  ) : (
    <div style={{ pointerEvents: props.saving ? 'none' : 'inherit' }} className={props.className}>
      {props.saving && <div className={'ComponentLoadingWrapper-saveOverlay'} />}
      {props.children}
    </div>
  );
};
