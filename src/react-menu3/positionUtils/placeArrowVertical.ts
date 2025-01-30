import { MutableRefObject } from 'react';

export const placeArrowVertical = (p: {
  arrowRef: MutableRefObject<HTMLElement | null>;
  menuY: number;
  anchorRect: DOMRect;
  containerRect: DOMRect;
  menuRect: DOMRect;
}) => {
  let y = p.anchorRect.top - p.containerRect.top - p.menuY + p.anchorRect.height / 2;
  const offset = p.arrowRef.current ? p.arrowRef.current.offsetHeight * 1.25 : 0;
  y = Math.max(offset, y);
  y = Math.min(y, p.menuRect.height - offset);
  return y;
};
