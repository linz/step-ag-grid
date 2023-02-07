import { memo, forwardRef, useContext, useRef, MutableRefObject, PropsWithRef } from "react";
import { HoverItemContext } from "../contexts/HoverItemContext";

export interface withHoveringResultProps {
  isHovering?: boolean;
  externalRef?: MutableRefObject<any>;
  menuItemRef?: MutableRefObject<any>;
}

export const withHovering = <T,>(name: string, WrappedComponent: (props: T) => JSX.Element) => {
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
