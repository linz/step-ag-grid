import { useTransition } from "react-transition-state";
import { MenuStateMap, getTransition } from "../utils";

interface useMenuStateProps {
  initialMounted?: boolean;
  unmountOnClose?: boolean;
  transition: boolean | Record<string, string>;
  transitionTimeout?: number;
}

export const useMenuState = (props?: useMenuStateProps) => {
  const { initialMounted, unmountOnClose, transition, transitionTimeout } = props ?? {
    transition: false,
  };
  const [state, toggleMenu, endTransition] = useTransition({
    mountOnEnter: !initialMounted,
    unmountOnExit: unmountOnClose,
    timeout: transitionTimeout ?? 500,
    enter: getTransition(transition, "open"),
    exit: getTransition(transition, "close"),
  });

  return [{ state: MenuStateMap[state], endTransition }, toggleMenu];
};
