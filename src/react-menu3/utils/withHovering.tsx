import { forwardRef, memo, MutableRefObject, PropsWithRef, ReactElement, useContext, useRef } from 'react';

import { HoverItemContext } from '../contexts/HoverItemContext';

export interface withHoveringResultProps {
  isHovering?: boolean;
  externalRef?: MutableRefObject<any>;
  menuItemRef?: MutableRefObject<HTMLLIElement>;
}

export const withHovering = <X extends Record<string, any>, T extends PropsWithRef<X>>(
  name: string,
  WrappedComponent: (props: T) => ReactElement,
) => {
  const Component = memo(WrappedComponent);
  const WithHovering = forwardRef<any, T>((props, ref) => {
    const menuItemRef = useRef<any>(null);

    return (
      <>
        {/* @ts-expect-error Can't work out what the ref issue is here */}
        <Component
          {...props}
          menuItemRef={menuItemRef}
          externalRef={ref}
          isHovering={useContext(HoverItemContext) === menuItemRef.current}
        />
      </>
    );
  });

  WithHovering.displayName = `WithHovering(${name})`;

  return WithHovering;
};
