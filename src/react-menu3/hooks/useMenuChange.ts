import { useRef, useEffect } from "react";
import { safeCall } from "../utils";
import { EventHandler, MenuChangeEvent } from "../types";

export const useMenuChange = (onMenuChange?: EventHandler<MenuChangeEvent>, isOpen?: boolean) => {
  const prevOpen = useRef(isOpen);

  useEffect(() => {
    if (onMenuChange && prevOpen.current !== isOpen) safeCall(onMenuChange, { open: !!isOpen });
    prevOpen.current = isOpen;
  }, [onMenuChange, isOpen]);
};
