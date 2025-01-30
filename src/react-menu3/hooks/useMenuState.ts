import { useTransition } from 'react-transition-state';

import { MenuState, MenuStateOptions } from '../types';
import { getTransition, MenuStateMap } from '../utils';

/**
 * A custom Hook which helps manage the states of `ControlledMenu`.
 */
export const useMenuState = (
  props?: MenuStateOptions,
): [
  {
    /**
     * Menu state which should be forwarded to `ControlledMenu`.
     */
    state?: MenuState;
    /**
     * Stop transition animation. This function value should be forwarded to `ControlledMenu`.
     */
    endTransition: () => void;
  },

  /**
   * Open or close menu.
   *
   * - If no parameter is supplied, this function will toggle state between open and close phases.
   * - You can set a boolean parameter to explicitly switch into one of the two phases.
   */
  (open?: boolean) => void,
] => {
  const { initialMounted, unmountOnClose, transition, transitionTimeout } = props ?? {
    transition: false,
  };
  const [state, toggleMenu, endTransition] = useTransition({
    mountOnEnter: !initialMounted,
    unmountOnExit: unmountOnClose,
    timeout: transitionTimeout ?? 500,
    enter: getTransition(transition, 'open'),
    exit: getTransition(transition, 'close'),
  });

  return [{ state: MenuStateMap[state.status], endTransition }, toggleMenu];
};
