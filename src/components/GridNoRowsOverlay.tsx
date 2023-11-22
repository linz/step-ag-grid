import { LuiStatusSpinner } from "@linzjs/lui";

const GridLoadingOverlayComponent = (props: { headerRowHeight: number }) => (
  <div
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

export interface GridNoRowsOverlayProps {
  loading: boolean;
  rowCount: number | undefined | null;
  filteredRowCount: number;
  noRowsOverlayText: string | undefined;
  noRowsMatchingOverlayText: string | undefined;
  headerRowHeight: number;
}

export const GridNoRowsOverlay = (props: GridNoRowsOverlayProps) => {
  if (props.loading) return <GridLoadingOverlayComponent headerRowHeight={props.headerRowHeight} />;
  if (props.rowCount === 0) return <div>{props.noRowsOverlayText ?? "There are currently no rows"}</div>;
  if (props.filteredRowCount === 0)
    return <div>{props.noRowsMatchingOverlayText ?? "All rows have been filtered"}</div>;
  return <span />;
};
