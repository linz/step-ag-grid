import { placeLeftorRight } from "./placeLeftorRight";
import { placeToporBottom } from "./placeToporBottom";
import { MutableRefObject } from "react";
import { getPositionHelpers } from "./getPositionHelpers";
import { MenuDirection } from "../types";

interface positionMenuProps {
  offsetX: number;
  offsetY: number;
  arrowRef: MutableRefObject<HTMLDivElement | null>;
  anchorRef: MutableRefObject<Element | null>;
  arrow?: boolean;
  direction: MenuDirection;
  position: "auto" | "anchor" | "initial";
  align: "start" | "center" | "end";
  positionHelpers: ReturnType<typeof getPositionHelpers>;
}

export const positionMenu = (props: positionMenuProps) => {
  const { arrow, align, direction, offsetX, offsetY, position, anchorRef, arrowRef, positionHelpers } = props;
  const { menuRect, containerRect } = positionHelpers;

  let horizontalOffset = offsetX;
  let verticalOffset = offsetY;
  if (arrow && arrowRef.current) {
    if (direction === "left" || direction === "right") {
      horizontalOffset += arrowRef.current.offsetWidth;
    } else {
      verticalOffset += arrowRef.current.offsetHeight;
    }
  }

  const anchorRect = anchorRef.current
    ? anchorRef.current.getBoundingClientRect()
    : ({ left: 0, right: 0, top: 200, bottom: 200, width: 200, height: 200 } as DOMRect);
  const placeLeftX = anchorRect.left - containerRect.left - menuRect.width - horizontalOffset;
  const placeRightX = anchorRect.right - containerRect.left + horizontalOffset;
  const placeTopY = anchorRect.top - containerRect.top - menuRect.height - verticalOffset;
  const placeBottomY = anchorRect.bottom - containerRect.top + verticalOffset;

  let placeToporBottomX, placeLeftorRightY;
  if (align === "end") {
    placeToporBottomX = anchorRect.right - containerRect.left - menuRect.width;
    placeLeftorRightY = anchorRect.bottom - containerRect.top - menuRect.height;
  } else if (align === "center") {
    placeToporBottomX = anchorRect.left - containerRect.left - (menuRect.width - anchorRect.width) / 2;
    placeLeftorRightY = anchorRect.top - containerRect.top - (menuRect.height - anchorRect.height) / 2;
  } else {
    placeToporBottomX = anchorRect.left - containerRect.left;
    placeLeftorRightY = anchorRect.top - containerRect.top;
  }
  placeToporBottomX += horizontalOffset;
  placeLeftorRightY += verticalOffset;

  const options = {
    ...positionHelpers,
    anchorRect,
    placeLeftX,
    placeRightX,
    placeLeftorRightY,
    placeTopY,
    placeBottomY,
    placeToporBottomX,
    arrowRef,
    arrow,
    direction,
    position,
  };

  switch (direction) {
    case "left":
    case "right":
      return placeLeftorRight(options);

    case "top":
    case "bottom":
    default:
      return placeToporBottom(options);
  }
};
