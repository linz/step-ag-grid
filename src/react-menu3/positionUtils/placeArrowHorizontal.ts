import { MutableRefObject } from 'react';

export const placeArrowHorizontal = (p: {
  arrowRef: MutableRefObject<HTMLElement | null>;
  menuX: number;
  anchorRect: DOMRect;
  containerRect: DOMRect;
  menuRect: DOMRect;
}) => {
  let x = p.anchorRect.left - p.containerRect.left - p.menuX + p.anchorRect.width / 2;
  const offset = p.arrowRef.current ? p.arrowRef.current.offsetWidth * 1.25 : 0;
  x = Math.max(offset, x);
  x = Math.min(x, p.menuRect.width - offset);
  return x;
};
