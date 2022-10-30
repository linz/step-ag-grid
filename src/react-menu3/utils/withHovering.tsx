import { memo, forwardRef, useContext, useRef, LegacyRef } from "react";
import { HoverItemContext } from "./constants";

export interface withHoveringResultProps {
  isHovering?: boolean;
  externalRef?: LegacyRef<any>;
}

export const withHovering = (name: string, WrappedComponent: (...args: any) => JSX.Element): any => {
  const Component = memo(WrappedComponent);
  const WithHovering = forwardRef<any>((props: any, ref) => {
    const itemRef = useRef<any>(null);
    return (
      <Component
        {...props}
        itemRef={itemRef}
        externalRef={ref}
        isHovering={useContext(HoverItemContext) === itemRef.current}
      />
    );
  });

  WithHovering.displayName = `WithHovering(${name})`;

  return WithHovering;
};
