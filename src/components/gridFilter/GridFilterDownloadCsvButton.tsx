import { CsvExportParams } from "ag-grid-community";
import { delay } from "lodash-es";
import { useContext } from "react";

import { LuiMiniSpinner } from "@linzjs/lui";

import { GridContext } from "../../contexts/GridContext";
import { useStateDeferred } from "../../lui/stateDeferredHook";
import { GridFilterHeaderIconButton } from "./GridFilterHeaderIconButton";

export const GridFilterDownloadCsvButton = (csvExportParams: CsvExportParams) => {
  const { downloadCsv } = useContext(GridContext);

  const [downloading, setDownloading, setDownloadingDeferred] = useStateDeferred(false);

  const handleDownloadClick = () => {
    setDownloading(true);
    // Defer the download such that the component disabled state can update
    delay(() => {
      downloadCsv(csvExportParams);
      // Defer re-enablement as the browser takes time to process the download
      setDownloadingDeferred(false, 4000);
    }, 100);
  };

  return downloading ? (
    <LuiMiniSpinner
      size={22}
      divProps={{
        role: "status",
        ["aria-label"]: "Downloading...",
        style: { width: 42, display: "flex", justifyContent: "center" },
      }}
    />
  ) : (
    <GridFilterHeaderIconButton
      icon={"ic_csv_file"}
      title={"Download CSV"}
      onClick={handleDownloadClick}
      disabled={downloading}
    />
  );
};
