import { LuiStatusSpinner } from "@linzjs/lui";
import { ForwardedRef, forwardRef } from "react";

const GridLoadingOverlayComponentFr = (
  props: { headerRowHeight: number },
  externalRef: ForwardedRef<HTMLDivElement>,
) => (
  <div
    ref={externalRef}
    style={{
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      position: "absolute",
      backgroundColor: "rgba(255,255,255,0.5)",
    }}
  >
    <div style={{ height: "100%", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: props.headerRowHeight, right: 0, bottom: 0 }}>
        <LuiStatusSpinner />
      </div>
    </div>
  </div>
);

const GridLoadingOverlayComponent = forwardRef(GridLoadingOverlayComponentFr);

export interface GridNoRowsOverlayProps {
  loading: boolean;
  rowCount: number | undefined | null;
  filteredRowCount: number;
  noRowsOverlayText: string | undefined;
  noRowsMatchingOverlayText: string | undefined;
  headerRowHeight: number;
}

export const GridNoRowsOverlayFr = (props: GridNoRowsOverlayProps, externalRef: ForwardedRef<HTMLDivElement>) => {
  if (props.loading) {
    return <GridLoadingOverlayComponent ref={externalRef} headerRowHeight={props.headerRowHeight} />;
  }
  if (props.rowCount === 0) {
    return <div ref={externalRef}>{props.noRowsOverlayText ?? "There are currently no rows"}</div>;
  }
  if (props.filteredRowCount === 0) {
    return <div ref={externalRef}>{props.noRowsMatchingOverlayText ?? "All rows have been filtered"}</div>;
  }
  return <div ref={externalRef} />;
};

export const GridNoRowsOverlay = forwardRef(GridNoRowsOverlayFr);
