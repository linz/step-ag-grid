export interface GridNoRowsOverlayProps {
  rowCount: number | undefined | null;
  filteredRowCount: number;
  noRowsOverlayText: string | undefined;
}

export const GridNoRowsOverlay = (params: GridNoRowsOverlayProps) => {
  if (params.rowCount === 0) return <span>{params.noRowsOverlayText ?? "There are currently no rows"}</span>;
  if (params.filteredRowCount === 0) return <span>All rows have been filtered</span>;
  return <span />;
};
