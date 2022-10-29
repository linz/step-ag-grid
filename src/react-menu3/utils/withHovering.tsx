import { memo, forwardRef, useContext, useRef } from "react";
import { HoverItemContext } from "./constants";

export const withHovering = (name: string, WrappedComponent: any): any => {
  const Component = memo(WrappedComponent);
  const WithHovering = forwardRef<any>((props: any, ref) => {
    const itemRef = useRef(null);
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
