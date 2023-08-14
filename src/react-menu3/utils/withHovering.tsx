import { MutableRefObject, PropsWithRef, ReactElement, forwardRef, memo, useContext, useRef } from "react";

import { HoverItemContext } from "../contexts/HoverItemContext";

export interface withHoveringResultProps {
  isHovering?: boolean;
  externalRef?: MutableRefObject<any>;
  menuItemRef?: MutableRefObject<HTMLLIElement>;
}

export const withHovering = <T,>(name: string, WrappedComponent: (props: T) => ReactElement) => {
  const Component = memo(WrappedComponent);
  const WithHovering = forwardRef((props: PropsWithRef<T>, ref) => {
    const menuItemRef = useRef<any>(null);
    return (
      <Component
        {...props}
        menuItemRef={menuItemRef}
        externalRef={ref}
        isHovering={useContext(HoverItemContext) === menuItemRef.current}
      />
    );
  });

  WithHovering.displayName = `WithHovering(${name})`;

  return WithHovering;
};
