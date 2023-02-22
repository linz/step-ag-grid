import { useEffect, useRef } from "react";

import { EventHandler, MenuChangeEvent } from "../types";
import { safeCall } from "../utils";

export const useMenuChange = (onMenuChange?: EventHandler<MenuChangeEvent>, isOpen?: boolean) => {
  const prevOpen = useRef(isOpen);

  useEffect(() => {
    if (onMenuChange && prevOpen.current !== isOpen) safeCall(onMenuChange, { open: !!isOpen });
    prevOpen.current = isOpen;
  }, [onMenuChange, isOpen]);
};
