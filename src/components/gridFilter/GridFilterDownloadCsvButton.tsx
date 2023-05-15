import { CsvExportParams } from "ag-grid-community/dist/lib/interfaces/exportParams";
import { useContext } from "react";

import { GridContext } from "../../contexts/GridContext";
import { GridFilterHeaderIconButton } from "./GridFilterHeaderIconButton";

export const GridFilterDownloadCsvButton = (csvExportParams: CsvExportParams) => {
  const { downloadCsv } = useContext(GridContext);
  return (
    <GridFilterHeaderIconButton
      icon={"ic_save_download"}
      title={"Download CSV"}
      onClick={() => downloadCsv(csvExportParams)}
    />
  );
};
