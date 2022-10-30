import { memo, forwardRef, useContext, useRef, LegacyRef, MutableRefObject } from "react";
import { HoverItemContext } from "./constants";

export interface withHoveringResultProps {
  isHovering?: boolean;
  externalRef?: MutableRefObject<any>;
  menuItemRef?: MutableRefObject<any>;
}

export const withHovering = (name: string, WrappedComponent: (...args: any) => JSX.Element): any => {
  const Component = memo(WrappedComponent);
  const WithHovering = forwardRef<any>((props: any, ref) => {
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
